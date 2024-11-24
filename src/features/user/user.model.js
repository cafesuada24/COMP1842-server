import { Schema, model } from 'mongoose';
//const { hash, compare } = require('bcryptjs');
import bcrypt from 'bcryptjs';

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
  finacialSummary: {
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
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

export default User;
