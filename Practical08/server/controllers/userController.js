// In-memory "database" + request handlers for /api/users
let users = [
  { id: 1, name: "Amit Shah", email: "amit@example.com" },
  { id: 2, name: "Riya Patel", email: "riya@example.com" },
];
let nextId = 3;

// GET /api/users
exports.getUsers = (req, res) => {
  const { search } = req.query; // query-string handling: /api/users?search=amit
  let result = users;
  if (search) {
    result = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()));
  }
  res.json(result);
};

// GET /api/users/:id
exports.getUserById = (req, res, next) => {
  const user = users.find((u) => u.id === Number(req.params.id)); // route params
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }
  res.json(user);
};

// POST /api/users
exports.createUser = (req, res) => {
  const { name, email } = req.body; // request body
  const user = { id: nextId++, name, email };
  users.push(user);
  res.status(201).json(user);
};

// PUT /api/users/:id
exports.updateUser = (req, res, next) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }
  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;
  res.json(user);
};

// DELETE /api/users/:id
exports.deleteUser = (req, res, next) => {
  const index = users.findIndex((u) => u.id === Number(req.params.id));
  if (index === -1) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }
  const [removed] = users.splice(index, 1);
  res.json({ message: "User deleted", user: removed });
};
