import { runInTransaction } from '../../utils/database.util.js';
import SavingGoal from './saving-goal.model.js';

export async function createSavingGoal(req, res) {
  try {
    const userId = req.user.userId;
    const { title, targetAmount, deadline } = req.body;

    const savingGoal = new SavingGoal({ userId, title, targetAmount, deadline });
    await savingGoal.save();

    res.status(201).json({ success: true, message: 'Saving goal created successfully', savingGoal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating saving goal', error });
  }
}

export async function getSavingGoals(req, res) {
  try {
    const { userId } = req.query;

    const savingGoals = await SavingGoal.find({ userId });

    res.status(200).json({ success: true, savingGoals });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching saving goals', error });
  }
}

export async function updateSavingGoal(req, res) {
  await runInTransaction(async (session) => {
    try {
      const { goalId } = req.params;
      const { title, targetAmount, currentAmount, deadline } = req.body;

      const savingGoal = await SavingGoal.findOne({ _id: goalId, userId: req.user.userId }).session(session);

      if (!savingGoal) {
        return res.status(404).json({ success: false, message: 'Saving goal not found' });
      }

      if (title) {
        savingGoal.title = title;
      }
      if (currentAmount) {
        savingGoal.currentAmount = currentAmount;
      }
      if (targetAmount) {
        savingGoal.targetAmount = targetAmount;
      }
      if (savingGoal.currentAmount >= savingGoal.targetAmount) {
        savingGoal.status = 'achieved';
      } else {
        savingGoal.status = 'active';
      }
      if (deadline) {
        savingGoal.deadline = deadline;
      }

      await savingGoal.save({ session });

      res.status(200).json({ success: true, message: 'Saving goal updated successfully', savingGoal });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating saving goal', error });
    }
  });
}

export async function deleteSavingGoal(req, res) {
  try {
    const { goalId } = req.params;

    const savingGoal = await SavingGoal.findByIdAndDelete(goalId);

    if (!savingGoal) {
      return res.status(404).json({ success: false, message: 'Saving goal not found' });
    }

    res.status(200).json({ success: true, message: 'Saving goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting saving goal', error });
  }
};