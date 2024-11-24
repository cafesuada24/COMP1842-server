import { Schema, model } from 'mongoose';
import { hashPassword } from '../auth/auth.util.js';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin'],
  },
  preferences: {
    currency: {
      type: String,
      enum: ['USD', 'VND'],
      default: 'USD',
    },
    language: {
      type: String,
      enum: ['en', 'vi'],
      default: 'en',
    },
  },
  financialSummary: {
    totalIncome: {
      type: Number,
      default: 0,
    },
    totalExpenses: {
      type: Number,
      default: 0,
    },
    savingGoal: {
      type: Number,
      default: 0,
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }
  next();
});

const User = model('User', userSchema);

export default User;
