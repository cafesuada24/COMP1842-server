import mongoose, { isValidObjectId } from 'mongoose';

import { Expense, ExpenseCategory } from './expense.model.js';

export async function createExpense(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = req.userData;

    const { categoryId, amount, description } = req.body;

    const expense = await Expense.create([{ userId: user._id, categoryId, amount, description }], { session: session });

    user.financialSummary.totalExpense += amount;
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
    const expenses = await Expense.find({ userId: req.user.userId })
      .populate('categoryId', 'name description');
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
}

export async function updateExpense(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();


  try {
    const user = req.userData;
    const { expenseId } = req.params;
    const { categoryId, amount, description } = req.body;

    const expense = await Expense.findOne({ _id: expenseId, userId: user._id }).session(session);
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
    if (categoryId) {
      if (!isValidObjectId(categoryId) || !ExpenseCategory.exists({ _id: categoryId, userId: user._id }).session(session)) {
        throw new mongoose.Error.ValidationError('Invalid category id');
      }
      expense.categoryId = categoryId;
    }
    await expense.save({ session });

    user.financialSummary.totalExpense += change;
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: 'Expense updated successfully', income: expense });
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: 'Invalid input', error });
    } else {
      res.status(500).json({ message: 'Error updating expense', error });
    } } finally {
    await session.endSession();
  }
}

export async function deleteExpense(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = req.userData;
    const { expenseId } = req.params;
    const expense = await Expense.findOneAndDelete({ _id: expenseId, userId: user._id }, { session });

    if (!expense) {
      throw new mongoose.Error.ValidationError('Expense not found');
    }

    user.financialSummary.totalExpense -= expense.amount;
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: 'Expense deleted successfully' });
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
