const Category = require('../../Models/adminModel/categorySchema');

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCategory, deleteCategory };
