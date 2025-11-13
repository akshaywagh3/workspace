import mongoose from "mongoose";

class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    Database.instance = this;
    this.connection = null;
  }

  async connect(uri) {
    if (this.connection) return this.connection;
    try {
      this.connection = await mongoose.connect(uri);
      console.log("MongoDB Connected ✅");
      return this.connection;
    } catch (error) {
      console.error("MongoDB connection failed ❌", error);
      process.exit(1);
    }
  }
}

export default new Database();
