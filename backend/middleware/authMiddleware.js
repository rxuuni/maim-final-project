import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.split(" ")[1] ;
  
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, "EeAa112233");
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin only" });
  next();
};
