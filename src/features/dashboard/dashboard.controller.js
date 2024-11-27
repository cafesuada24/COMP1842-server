import { runInTransaction } from '../../utils/database.util.js';
import { Expense } from '../expense/expense.model.js';
import { Income } from '../income/income.model.js';
import SavingGoal from '../saving-goal/saving-goal.model.js'

export async function getDashboard(req, res) {
  try {
    await runInTransaction(async (session) => {
      const user = req.userData;
      const dashboardData = {};

      dashboardData.balance = user.financialSummary.totalIncome - user.financialSummary.totalExpense;
      
      dashboardData.activeSavingGoal = await SavingGoal.countDocuments({
        userId: user._id,
        status: 'active',
      }).session(session);

      dashboardData.income = (await Income.aggregate([
        {
          $match: { userId: user._id },
        },
        {
          $group: {
            _id: null,
            count: { $count: {} },
            totalAmount: { $sum: "$amount" }
          }
        }
      ]).session(session))[0] ?? {
        count: 0,
        totalAmount: 0,
      };

      dashboardData.expense = (await Expense.aggregate([
        {
          $match: { userId: user._id },
        },
        {
          $group: {
            _id: null,
            count: { $count: {} },
            totalAmount: { $sum: "$amount" }
          }
        }
      ]).session(session))[0] ?? {
        count: 0,
        totalAmount: 0,
      };

      res.status(200).json({ success: true, dashboardData });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard', error });
  }
}
