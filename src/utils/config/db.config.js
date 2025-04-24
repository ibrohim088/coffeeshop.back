import { config } from "dotenv";

config();
export default {
   db:{
      url: process.env.MONGO_URL || "mongodb://localhost:27017/coffee_sh",
   }
}