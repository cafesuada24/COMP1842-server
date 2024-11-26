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
        required: true
    },
    currentAmount: {
        type: Number,
        default: 0
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

export default model('savingGoal', savingGoalSchema);
