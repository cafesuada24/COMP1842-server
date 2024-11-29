import { Income, IncomeCategory } from './income.model.js';
import User from '../user/user.model.js';
import mongoose, { isValidObjectId } from 'mongoose';
import { runInTransaction } from '../../utils/database.util.js';

export async function createIncome(req, res) {
  try {
    await runInTransaction(async (session) => {
      const userId = req.user.userId;
      const { category, amount, description } = req.body;

      if (category && category?._id) {
        if (!isValidObjectId(category._id) || !IncomeCategory.exists({ _id: category._id, userId: userId }, { session })) {
          throw new mongoose.Error.ValidationError('Invalid category id');
        }
      }

      const income = new Income({ userId, category: category?._id, amount, description });
      await income.save({ session });

      const userUpdated = await User.findByIdAndUpdate(
        userId,
        { $inc: { "financialSummary.totalIncome": amount } },
        { new: true, session }
      );
      if (!userUpdated) {
        throw new Error('An error occurred when updating balance');
      }

      res.status(201).json({ success: true, data: await income.populate('category', 'name description') });
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: 'Invalid input', error });
    } else {
      res.status(500).json({ success: false, message: 'Error updating income', error });
    }
  }
}

export async function getIncomes(req, res) {
  try {
    const userId = req.user.userId;
    const incomes = await Income.find({ userId })
      .populate('category', 'name description');
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching incomes', error });
  }
}

export async function updateIncome(req, res) {
  try {
    await runInTransaction(async (session) => {
      const userId = req.user.userId;
      const { incomeId } = req.params;
      const { amount, description, category } = req.body;

      const income = await Income.findOne({ _id: incomeId, userId }).session(session);
      if (!income) {
        return res.status(404).json({ message: 'Income not found' });
      }

      let change = 0;

      if (amount) {
        change = amount - income.amount;
        income.amount = amount;
      }
      if (description) {
        income.description = description;
      }
      if (category && category?._id) {
        if (!isValidObjectId(category._id) || !IncomeCategory.exists({ _id: category._id, userId })) {
          throw new mongoose.Error.ValidationError('Invalid category id');
        }
        income.category = category._id;
      }
      await income.save();

      const userUpdated = await User.findByIdAndUpdate(
        income.userId,
        { $inc: { "financialSummary.totalIncome": change } },
        { new: true, session }
      );

      if (!userUpdated) {
        throw new Error('An error occurred when updating balance');
      }

      res.status(200).json({ success: true, message: 'Income updated successfully', data: await income.populate('category', 'name description') });
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: 'Invalid input', error });
    } else {
      res.status(500).json({ success: false, message: 'Error updating income', error });
    }
  }
}

export async function deleteIncome(req, res) {
  try {
    await runInTransaction(async (session) => {
      const { incomeId } = req.params;
      const income = await Income.findOne({ _id: incomeId, userId: req.user.userId }).session(session);
      if (!income) {
        throw new mongoose.error.validationerror('invalid category id');
      }
      const user = await User.findById({ _id: req.user.userId }).session(session);
      user.financialSummary.totalIncome -= income.amount;
      user.save();
      await Income.deleteOne(income).session(session);

      res.status(200).json({ success: true });
    })
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: 'Invalid input', error });
    } else {
      res.status(500).json({ success: false, message: 'Error updating income', error });
    }
  }
};

