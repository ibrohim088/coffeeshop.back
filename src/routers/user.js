import express from 'express';
import UserModel from '../schema/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { postSchema, httpValidator } from '../validators/Users.js';


const router = express.Router();

router.get('/', async (req, res) => {
   try {
      const user = await UserModel.find()
      res.status(200).json({ data: user })
   } catch (error) {
      res.status(500).json({ error: error })
   }
});

router.post('/register', async (req, res) => {
   try {
      // Log the incoming request body to check its structure
      console.log("Request Body:", req.body);

      // Check if password is present in the request body
      if (!req.body || !req.body.password) {
         return res.status(400).json({ msg: "Password is required" });
      }

      // Validate the request body using httpValidator
      const isValid = httpValidator({ body: req.body }, postSchema, res);
      if (!isValid) {
         console.log("Validation failed");
         return;
      }

      // Check if email already exists in the database
      const emailExists = await UserModel.exists({ email: req.body?.email });
      console.log("Email Exists:", emailExists);

      if (emailExists) {
         return res.status(400).json({ msg: "Email already exists" });
      }

      // Hash the password using bcrypt
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      console.log("Hashed Password:", req.body.password);

      // Create the user and save it to the database
      const user = new UserModel(req.body);
      await user.save();
      console.log("User saved successfully");

      // Respond with success
      res.status(201).json({ msg: 'User registered successfully', user });
   } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ msg: error.message || "An unexpected error occurred" });
   }
});


router.post('/login', async (req, res) => {
   try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email }).select('+password');
      if (!user) return res.status(400).json({ msg: 'User not found' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '30d' });

      const { password: pwd, ...userData } = user._doc;

      res.json({ token, user: userData });
   } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ msg: error.message || 'Something went wrong' });
   }
});

router.delete('/:id', async (req, res) => {
   try {
       const id = req.params.id
       const users = await UserModel.findByIdAndDelete(id)

       if (!users) {
           return res.status(404).json({ message: 'User not found' })
       }

       res.status(200).json({ message: 'User deleted', data: users });
   } catch (error) {
       res.status(500).json({ message: error.message });
   }
})


// router.patch("/:id", async (req, res) => {
//    try {
//      const isValid = httpValidator(
//        { body: req.body, params: req.params },
//        patchSchema,
//        res
//      );
//      if (!isValid) return;
 
//      if (req?.body?.password) {
//        req.body.password = bcrypt.hashSync(req.body?.password, 10);
//      }
 
//      if (req.body?.email) {
//        const emailExists = await UserModel.exists({
//          email: req.body?.email,
//          _id: { $ne: new Types.ObjectId(req.params.id) },
//        });
//        if (emailExists)
//          return res.status(400).json({ msg: "Email already exists" });
//      }
 
//      const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
//        new: true,
//      });
//      res.status(200).json({ message: "Updated", user });
//    } catch (error) {
//      res.status(400).json({ msg: error.message });
//    }
//  });

export default router;