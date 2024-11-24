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
    unique: true
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
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'incomeCategory',
      //required: true,
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

const incomeCategoryModel = model('incomeCategory', incomeCategorySchema);
const incomeModel = model('income', incomeSchema);

export { incomeModel, incomeCategoryModel };
