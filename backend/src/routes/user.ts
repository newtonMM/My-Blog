import { Router } from "express";
import {
  signup,
  login,
  update,
  deleteUser,
  findAllUsers,
  findUser,
} from "../controllers/user";
import isAuth from "../middlewares/isAuth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/update-details/:userId", isAuth, update);
router.delete("/delete-user/:id", isAuth, deleteUser);
router.get("/all-users", isAuth, findAllUsers);
router.get("/get-user/:id", isAuth, findUser);

export default router;
