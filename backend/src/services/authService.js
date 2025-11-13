// services/authService.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository.js";
import ErrorHandler  from "../middleware/errorMiddleware.js";

class AuthService {
  async register(email, password,firstname,lastname) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ErrorHandler("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.createUser(email, hashedPassword,firstname,lastname);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return {
      token:token,
      id: newUser._id,
      email: newUser.email,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      createdAt: newUser.createdAt,
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new ErrorHandler("Invalid credentials", 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ErrorHandler("Invalid credentials", 400);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return {
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      createdAt: user.createdAt,
      token:token
    };
  }
}

export default new AuthService();
