import jwt from "jsonwebtoken";

// ✅ General Auth Middleware
export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");

    req.user = {
      id: decoded.id,
      designation: (decoded.designation || "user").toLowerCase(),
      userType: (decoded.userType || "public").toLowerCase(),
    };

    return next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token is not valid" });
  }
};

// ✅ Admin-only Middleware
export const adminMiddleware = (req, res, next) => {
  if (req.user?.designation === "admin") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Admin access required" });
};

// ✅ Government or Admin Middleware
export const govOrAdminMiddleware = (req, res, next) => {
  const isAdmin = req.user?.designation === "admin";
  const isGov = req.user?.userType === "government";

  if (isAdmin || isGov) {
    return next();
  }

  return res
    .status(403)
    .json({ success: false, message: "Government or Admin access required" });
};

// ✅ Alias
export const governmentOrAdminMiddleware = govOrAdminMiddleware;
