import { IncomeCategory } from './income.model.js';

// Categories
export async function getCategories(req, res) {
  try {
    const categories = await IncomeCategory.find({ userId: req.user.userId });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function createCategory(req, res) {
  try {
    const { name } = req.body;
    const category = await IncomeCategory.create({ userId: req.user.userId, name });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await IncomeCategory.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { name },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const category = await IncomeCategory.findOneAndDelete({ _id: id, userId: req.user.userId });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
