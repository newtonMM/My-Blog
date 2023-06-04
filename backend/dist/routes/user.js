"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const isAuth_1 = __importDefault(require("../middlewares/isAuth"));
const router = (0, express_1.Router)();
router.post("/signup", user_1.signup);
router.post("/login", user_1.login);
router.put("/update-details/:userId", isAuth_1.default, user_1.update);
router.delete("/delete-user/:id", isAuth_1.default, user_1.deleteUser);
router.get("/all-users", isAuth_1.default, user_1.findAllUsers);
router.get("/get-user/:id", isAuth_1.default, user_1.findUser);
exports.default = router;
