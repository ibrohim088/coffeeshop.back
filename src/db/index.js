import mongoose from "mongoose";

export function db() {
   mongoose.connect('mongodb://localhost:27017/coffee_shop')  //useUnifiedTopology bilan useNewUrlParser ochirsa Warning digan yozu yoqoladi
   .then(() => console.log('MongoDB connected...'))
   .catch((err) => console.log(err));
}