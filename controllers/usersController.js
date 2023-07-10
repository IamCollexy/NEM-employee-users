const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new user

const createUser = async (req, res) => {
  const { username, password, roles } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and Password are required.' });
  }

  try {
    const duplicateUser = await User.findOne({ username }).exec();
    if (duplicateUser) {
      return res.sendStatus(409); // Conflict
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      roles,
      password: hashedPassword,
    });

    res.status(201).json({
      success: `New user: ${user.username} created!`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update a user by ID
const updateUserById = async (req, res) => {
  const { id, username, password, roles } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { username, password: hashedPassword, roles },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a user by ID
const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res
        .status(400)
        .json({ message: 'ID parameter is required.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(204)
        .json({ message: `No user matches ID ${userId}` });
    }

    const result = await User.deleteOne({ _id: userId });
    console.log(result);
    res
      .status(200)
      .json({ message: `Deleted user: ${user.username}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};
