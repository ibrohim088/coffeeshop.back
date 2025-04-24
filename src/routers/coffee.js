/** @format */

import express from "express";
import { upload } from "../utils/multer.js";
import Coffee from "../schema/Coffee.js";
import CoffeeShop from "../schema/CoffeeShop.js";
const router = express.Router();

router.get("/coffee", async (req, res) => {
   try {
      const { s } = req.query || {};
      let q = {};

      if (s) {
         q.name = { $regex: new RegExp(s, "i") };
      }
      console.log(q);
      const coffee = await Coffee.find(q);

      res.status(200).send({ data: coffee });
   } catch (error) {
      res.status(500).send("Error: " + error.message);
   }
});
router.get("/coffee/:id", async (req, res, next) => {
   try {
      const id = req.params.id;
      const coffee = await Coffee.findById(id);
      res.status(200).send({ data: coffee });
   } catch (error) {
      res.status(500).send("Error: " + error.message);
   }
});

router.post("/coffee", upload.single("image"), async (req, res) => {
   try {
      const { coffeeShopId, name, price } = req.body;

      // Debug print
      console.log("Received coffeeShopId:", coffeeShopId);

      const coffeeShop = await CoffeeShop.findById(coffeeShopId);

      if (!coffeeShop) {
         return res.status(404).send({ message: "Coffee shop not found" });
      }

      if (!req.file) {
         return res.status(400).send({ message: "Image file is required" });
      }

      const coffee = new Coffee({
         name,
         price,
         coffeeShopId,
         image: `uploads/${req.file.filename}`,
      });

      await coffee.save();
      res.status(201).send({ data: coffee });

   } catch (error) {
      console.error("Error creating coffee:", error);
      res.status(500).send("Error: " + error.message);
   }
});


router.delete("/coffee/:id", async (req, res) => {
   try {
      const deletedCoffee = await Coffee.findByIdAndDelete(req.params.id);
      if (!deletedCoffee) {
         return res.status(404).send({ message: "Coffee not found" });
      }

      res.send({ message: "Coffee deleted", data: deletedCoffee });
   } catch (error) {
      res.status(500).send({ error: "Error: " + error.message });
   }
});


export default router;
