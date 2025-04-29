import mongoose from "mongoose";

const User = mongoose.Schema({
   name: {
      type: mongoose.SchemaTypes.String,
      required: true,
   },
   email: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
   },
   
   password:{
      type: mongoose.SchemaTypes.String,
      required: true,
      // minlength: 8,
      // maxlength: 100,
      // validate: {
      //    validator: function(v) {
      //       return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      //    message: "Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters."
      // }
   },
}, {
   timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
   }, versionKey: false,
})

const userSchema = mongoose.model('User' , User);
export default userSchema;