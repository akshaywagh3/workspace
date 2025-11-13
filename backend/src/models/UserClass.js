import UserModel from "./User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class User {
  #email;
  #password;
  #firstname;
  #lastname;

  constructor(email, password) {
    this.#email = email;
    this.#password = password;
    this.#firstname = firstname;
    this.#lastname = lastname;
  }

  async register() {
    const userExists = await UserModel.findOne({ email: this.#email });
    if (userExists) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(this.#password, 10);
    const newUser = new UserModel({
      email: this.#email,
      password: hashedPassword,
      firstname: this.#firstname,
      lastname: this.#lastname,
    });
    await newUser.save();
    return newUser;
  }

  static async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return { user, token };
  }
}

export default User;
