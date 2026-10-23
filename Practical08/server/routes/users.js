const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/userController");

// Route-level middleware: validate body before creating a user
function validateUser(req, res, next) {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }
  next();
}

router.get("/", ctrl.getUsers);
router.get("/:id", ctrl.getUserById);
router.post("/", validateUser, ctrl.createUser);
router.put("/:id", ctrl.updateUser);
router.delete("/:id", ctrl.deleteUser);

module.exports = router;
