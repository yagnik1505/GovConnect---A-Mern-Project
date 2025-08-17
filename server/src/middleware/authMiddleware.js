import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains { id, designation }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user?.designation !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};
