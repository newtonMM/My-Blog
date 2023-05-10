import { Router } from "express";
import {
  saveSeries,
  updateSeries,
  findAllSeries,
  deleteSeries,
  findSeries,
} from "../controllers/series";

const router = Router();

router.post("/new-series", saveSeries);
router.put("/update-series/:id", updateSeries);
router.get("/all-series", findAllSeries);
router.delete("/delete-series/:id", deleteSeries);
router.get("/get-series/:id", findSeries);

export default router;
