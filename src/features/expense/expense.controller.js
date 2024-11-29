import mongoose, { isValidObjectId } from 'mongoose';

import { Expense, ExpenseCategory } from './expense.model.js';
import User from '../user/user.model.js';
import { runInTransaction } from '../../utils/database.util.js';

export async function createExpense(req, res) {
  try {
    await runInTransaction(async (session) => {
      const userId = req.user.userId;
      const { category, amount, description } = req.body;

      if (category && category?._id) {
        if (!isValidObjectId(category._id) || !ExpenseCategory.exists({ _id: category._id, userId: userId }, { session })) {
          throw new mongoose.Error.ValidationError('Invalid category id');
        }
      }
      const expense = await Expense({ userId, category: category?._id, amount, description });
      expense.save({ session });

      const userUpdated = await User.findByIdAndUpdate(
        userId,
        { $inc: { "financialSummary.totalExpense": amount } },
        { new: true, session }
      );

      if (!userUpdated) {
        throw new Error('An error occurred when updating balance');
      }

      res.status(201).json({ success: true, data: await expense.populate('category', 'name description') });
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: 'Invalid input', error });
    } else {
      res.status(500).json({ success: false, message: 'Error adding expense', error });
    }
  }
}

export async function getExpenses(req, res) {
  try {
    const expenses = await Expense.find({ userId: req.user.userId })
      .populate('category', 'name description');
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching expenses', error });
  }
}

export async function updateExpense(req, res) {
  try {
    await runInTransaction(async (session) => {
      const userId = req.user.userId;
      const { expenseId } = req.params;
      const { category, amount, description } = req.body;

      const expense = await Expense.findOne({ _id: expenseId, userId }).session(session);
      if (!expense) {
        throw new mongoose.Error.ValidationError('Expense not found');
      }

      let change = 0;

      if (amount) {
        change = amount - expense.amount;
        expense.amount = amount;
      }
      if (description) {
        expense.description = description;
      }

      if (category && category?._id) {
        if (!isValidObjectId(category._id) || !ExpenseCategory.exists({ _id: category._id, userId })) {
          throw new mongoose.Error.ValidationError('Invalid category id');
        }
        expense.category = category._id;
      }
      await expense.save();


      const userUpdated = await User.findByIdAndUpdate(
        expense.userId,
        { $inc: { "financialSummary.totalExpense": change } },
        { new: true, session }
      );

      if (!userUpdated) {
        throw new Error('An error occurred when updating balance');
      }


      res.status(200).json({ success: true, message: 'Expense updated successfully', data: await expense.populate('category', 'name description') });
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: 'Invalid input', error });
    } else {
      res.status(500).json({ success: false, message: 'Error updating expense', error });
    }
  }
}

export async function deleteExpense(req, res) {
  try {
    await runInTransaction(async (session) => {
      const { expenseId } = req.params;

      const expense = await Expense.findOne({ _id: expenseId, userId: req.user.userId }).session(session);
      if (!expense) {
        throw new mongoose.Error.ValidationError('Expense not found');
      }

      const user = await User.findById({ _id: req.user.userId }).session(session);
      user.financialSummary.totalExpense -= expense.amount;
      user.save();

      await Expense.deleteOne(expense).session(session);

      res.status(200).json({ success: true });
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ success: false, message: 'Invalid input', error });
    } else {
      res.status(500).json({ success: false, message: 'Error updating expense', error });
    }
  }
}
