import { Schema, model } from 'mongoose';

const savingGoalSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: [0, 'Target amount can not be negative']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount can not be negative']
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'achieved', 'failed'],
    default: 'active'
  }
}, { timestamps: true });

savingGoalSchema.pre('findOneAndUpdate', async function() {
  const update = this.getUpdate();
  if (update.$inc) {
    const doc = await this.model.findOne(this.getQuery());
    const amount = doc.currentAmount + update
  }
  next();
});

export default model('savingGoal', savingGoalSchema);
