import mongoose from "mongoose";

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}

export default main;
