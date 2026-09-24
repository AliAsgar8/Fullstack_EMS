// Get profile

export const getProfile = async (req, res) => {
  try {
    const session = req.session;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId));
    if (!user) {
      return res.json({ firstName: "Admin", lastName: "", email: session.email });
    }
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile

export const updateProfile = async (req, res) => {
  try {
    const session = req.session;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId));
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if(user.isDeleted){
      return res.status(401).json({ success: false, message: "User is deleted" });
    }

    await db.update(users).set({
      bio: req.body.bio,
    })
      .where(eq(users.id, session.userId));
    
    return res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}