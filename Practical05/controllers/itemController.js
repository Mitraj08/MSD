// controllers/itemController.js
const itemModel = require("../models/itemModel");

// GET /api/items
const getItems = (req, res) => {
  const items = itemModel.getAllItems();
  res.status(200).json({ success: true, count: items.length, data: items });
};

// GET /api/items/:id
const getItem = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = itemModel.getItemById(id);

  if (!item) {
    return res.status(404).json({ success: false, message: `Item with id ${id} not found` });
  }
  res.status(200).json({ success: true, data: item });
};

// POST /api/items
const createItem = (req, res) => {
  const { name, description, price } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Field 'name' is required" });
  }

  const newItem = itemModel.createItem({ name, description, price });
  res.status(201).json({ success: true, data: newItem });
};

// PUT /api/items/:id
const updateItem = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updated = itemModel.updateItem(id, req.body);

  if (!updated) {
    return res.status(404).json({ success: false, message: `Item with id ${id} not found` });
  }
  res.status(200).json({ success: true, data: updated });
};

// DELETE /api/items/:id
const deleteItem = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = itemModel.deleteItem(id);

  if (!deleted) {
    return res.status(404).json({ success: false, message: `Item with id ${id} not found` });
  }
  res.status(200).json({ success: true, data: deleted, message: "Item deleted successfully" });
};

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
};
