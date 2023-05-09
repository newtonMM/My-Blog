import { Router } from "express";
import {
  signup,
  login,
  update,
  deleteUser,
  findAllUsers,
  findUser,
} from "../controllers/user";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/update-details/:userId", update);
router.delete("/delete/:id", deleteUser);
router.get("/all-users", findAllUsers);
router.get("/get-user/:id", findUser);

export default router;
