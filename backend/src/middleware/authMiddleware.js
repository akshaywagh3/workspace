import jwt from "jsonwebtoken";
import ErrorHandler  from "./errorMiddleware.js";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next( new ErrorHandler("No token, authorization denied", 401));
              
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ErrorHandler("Token is not valid", 401));
  }
};
