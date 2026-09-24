// Login for admin and employee

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Email, password and role are required" });
    }

    const user = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (role === "admin" && user.role !== "admin") {
      return res
        .status(401)
        .json({ message: "You are not authorized to access this resource" });
    }
    if (role === "employee" && user.role !== "employee") {
      return res
        .status(401)
        .json({ message: "You are not authorized to access this resource" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get session for employee and admin
// GET /api/auth/session

export const getSession = async (req, res) => {
  const session = req.session;
  return res.json({ user: session.user });
};

// Change password for employee and admin
// Post /api/auth/change-password

export const changePassword = async (req, res) => {
  try {
    const session = req.session;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current password and new password are required" });
    }
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId));
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid current password" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({ password: hashedNewPassword })
      .where(eq(users.id, session.userId));
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
