import { Router } from "express";
import {
  saveCategory,
  findAllCategories,
  findCategory,
  deleteCategory,
  updateCategory,
} from "../controllers/category";

const router = Router();

router.post("/new-category", saveCategory);
router.put("/update-category/:id", updateCategory);
router.get("/all-categories", findAllCategories);
router.delete("/delete-category/:id", deleteCategory);
router.get("/get-category/:id", findCategory);

export default router;
