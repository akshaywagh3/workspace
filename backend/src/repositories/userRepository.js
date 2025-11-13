// repositories/userRepository.js
import User from "../models/User.js";

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(email, hashedPassword,firstname,lastname) {
    const newUser = new User({ email, password: hashedPassword,firstname,lastname });
    await newUser.save();

    return {
      id: newUser._id,
      email: newUser.email,
      firstname: newUser.firstname,
      lastname: newUser.lastname,
      createdAt: newUser.createdAt,
    };
  }
}

export default new UserRepository();
