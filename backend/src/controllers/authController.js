// controllers/authController.js
import authService from "../services/authService.js";

export const registerUser = async (req, res, next) => {
  try {
    const { email, password,firstname,lastname } = req.body;
    const response = authService.register(email, password,firstname,lastname);
     res.status(201).json({
      success: true,
      token: response.token,
      userid: response.id,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    // res.json({ token });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token:user.token,
      id:user.id
    });
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    res.json({ userId: req.user.id });
  } catch (error) {
    next(error);
  }
};
