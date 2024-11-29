import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const incomeCategorySchema = new Schema({
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

const incomeSchema = new Schema(
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
      ref: 'incomeCategory',
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

const IncomeCategory = model('incomeCategory', incomeCategorySchema);
const Income = model('income', incomeSchema);

export { Income, IncomeCategory };
