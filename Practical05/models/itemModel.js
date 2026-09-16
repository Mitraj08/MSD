// models/itemModel.js
// A simple in-memory "database" using an array.
// This avoids needing to set up MongoDB/MySQL/etc. so the project
// runs immediately with zero extra configuration.
// (Swap this out for a real database later if you need persistence.)

let items = [
  { id: 1, name: "Laptop", description: "16GB RAM, 512GB SSD", price: 75000 },
  { id: 2, name: "Mouse", description: "Wireless mouse", price: 799 },
];

let nextId = 3;

const getAllItems = () => items;

const getItemById = (id) => items.find((item) => item.id === id);

const createItem = (data) => {
  const newItem = {
    id: nextId++,
    name: data.name,
    description: data.description || "",
    price: data.price || 0,
  };
  items.push(newItem);
  return newItem;
};

const updateItem = (id, data) => {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...data,
    id: items[index].id, // id should never change
  };
  return items[index];
};

const deleteItem = (id) => {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const deleted = items[index];
  items.splice(index, 1);
  return deleted;
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
