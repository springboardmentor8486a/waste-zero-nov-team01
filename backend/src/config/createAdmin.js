const bcrypt = require("bcryptjs");
const User = require("../models/user");

const createAdminIfNotExists = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    const existingAdmin = await User.findOne({
      role: "admin",
      email: adminEmail,
    });

    if (existingAdmin) {
      // Update admin password to match .env
      await User.findByIdAndUpdate(existingAdmin._id, {
        password: hashedPassword,
      });
      console.log("  # Admin password updated to: " + process.env.ADMIN_PASSWORD);
      return;
    }

    await User.create({
      name: "System Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      status: "active",
      location: "System",
      skills: [],
      bio: "Built-in platform administrator",
    });

    console.log(" Built-in admin account created with password: " + process.env.ADMIN_PASSWORD);
  } catch (error) {
    console.error(" Admin creation failed:", error.message);
  }
};

module.exports = createAdminIfNotExists;
