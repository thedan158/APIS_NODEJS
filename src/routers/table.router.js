import express from "express";
const router = express.Router();

import { TableController } from "../controllers/table.controller.js";

router.post("/createTable", TableController.createTable);
router.delete("/deleteTable/:id", TableController.deleteTable);
router.put("/updateTable/:id", TableController.updateTable);
router.put("/updateBusyTable", TableController.updateBusyTable);

router.get("/getAllTable/:restaurantID", TableController.getAllTable);
router.post(
  "/getAllTableOfRestaurant",
  TableController.getAllTableOfRestaurant
);

export default router;
