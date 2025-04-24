/** @format */

import express from "express";
import { upload } from "../utils/multer.js";
import CoffeeShop from "../schema/CoffeeShop.js";
const router = express.Router();

router.get("/coffee-shop", async (req, res) => {
   try {
      const { s } = req.query || {};
      let q = {};

      if (s) {
         q.name = { $regex: new RegExp(s, "i") };
      }

      const coffeeShops = await CoffeeShop.find(q).populate("coffees");
      res.status(200).send({ data: coffeeShops });
   } catch (error) {
      res.status(500).send("Error: " + error.message);
   }
});

router.get("/coffee-shop/:id", async (req, res, next) => {
   try {
      const id = req.params.id;
      const cShop = await CoffeeShop.findById(id);
      res.status(200).send({ data: cShop });
   } catch (error) {
      res.status(500).send("Error: " + error.message);
   }
});

router.post("/coffee-shop", upload.single("logo"), async (req, res, next) => {
   try {
      // console.log(req.file);
      const cShop = new CoffeeShop({ ...req.body, logo: req.file?.filename });
      await cShop.save();
      res.status(201).send({ data: cShop });
   } catch (error) {
      res.status(500).send("Error: " + error.message);
   }
});

router.delete("/coffee-shop/:id", async (req, res) => {
   try {
      const deletedShop = await CoffeeShop.findByIdAndDelete(req.params.id);
      if (!deletedShop) {
         return res.status(404).send({ error: "Coffee shop not found" });
      }
      res.send({ message: "Coffee shop deleted", data: deletedShop });
   } catch (error) {
      res.status(500).send({ error: "Error: " + error.message });
   }
});
export default router;