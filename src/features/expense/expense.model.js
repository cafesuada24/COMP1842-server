import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const expenseCategorySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const expenseSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Income amount must me positive'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'expenseCategory',
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ExpenseCategory = model('expenseCategory', expenseCategorySchema);
const Expense = model('expense', expenseSchema);

export { Expense , ExpenseCategory };
