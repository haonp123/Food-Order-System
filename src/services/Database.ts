import mongoose from "mongoose";

import { MONGO_URI } from "../config";

export default async () => {
  try {
    const res = await mongoose.connect(MONGO_URI);

    console.log("Database connected to", res.connection.host);
  } catch (err) {
    console.log(err);
  }
};
