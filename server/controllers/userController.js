const User = require("../models/User");
const mockUsers = require("../data/users.json");

const seedUsers = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      for (const u of mockUsers) {
        await User.create({
          name: u.name,
          email: u.email,
          password: "password123",
        });
      }
      console.log("Mock users seeded successfully");
    }
  } catch (err) {
    console.error("Error seeding users:", err);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

module.exports = { seedUsers, getAllUsers };
