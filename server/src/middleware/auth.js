export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const session = jwt.verify(token, process.env.JWT_SECRET);

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.session = session;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const isAdmin = async (req, res, next) => {
  if(req.session.user.role !== "admin"){
    return res.status(401).json({ message: "You are not authorized to access this resource" });
  }
  next();
};