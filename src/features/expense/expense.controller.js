import mongoose, { isValidObjectId } from 'mongoose';

import { Expense, ExpenseCategory } from './expense.model.js';
import User from '../user/user.model.js';

export async function createExpense(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    //const userId = req.user.userId;
    const user = req.userData;

    const { categoryId, amount, description } = req.body;

    const expense = await Expense.create([{ userId: user._id, categoryId, amount, description }], { session: session });

    user.financialSummary.totalIncome -= amount;
    await user.save({ session });

    await session.commitTransaction();

    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Invalid input', error });
    } else {
      res.status(500).json({ message: 'Error updating expense', error });
    }
  } finally {
    await session.endSession();
  }
}

export async function getExpenses(req, res) {
  try {
    const userId = req.user.userId;
    const incomes = await Expense.find({ userId })
      .populate('categoryId', 'name description');
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching incomes', error });
  }
}

export async function updateExpense(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user.userId;
    const { incomeId } = req.params;
    const { amount, description, categoryId } = req.body;

    const income = await Expense.findOne({ _id: incomeId, userId: userId });
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
    if (categoryId) {
      if (!isValidObjectId(categoryId) || !ExpenseCategory.exists({ _id: categoryId, userId: userId })) {
        throw new mongoose.Error.ValidationError('Invalid category id');
      }
      income.categoryId = categoryId;
    }
    income.save();

    const userUpdated = await User.findByIdAndUpdate(
      income.userId,
      { $inc: { "financialSummary.totalIncome": change } },
      { new: true }
    );

    if (!userUpdated) {
      throw new Error('An error occurred when updating balance');
    }

    res.status(200).json({ message: 'Income updated successfully', income });
    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Invalid input', error });
    } else {
      res.status(500).json({ message: 'Error updating income', error });
    }
  } finally {
    await session.endSession();
  }
}

export async function deleteExpense(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { incomeId } = req.params;
    const income = await Expense.findOneAndDelete({ _id: incomeId, userId: req.user.userId });

    if (!income) {
      res.status(404).json({ message: 'Income not found' });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      income.userId,
      { $inc: { "financialSummary.totalIncome": -income.amount } },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('An error occurred when updating balance');
    }
    res.status(200).json({ message: 'Income deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Invalid input', error });
    } else {
      res.status(500).json({ message: 'Error updating income', error });
    }
  } finally {
    await session.endSession();
  }
}
