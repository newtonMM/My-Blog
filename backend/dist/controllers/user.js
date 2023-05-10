"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = exports.findAllUsers = exports.deleteUser = exports.update = exports.login = exports.signup = void 0;
const user_1 = require("../models/user");
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //   if (!req.body) {
    //     const error = new Error("not request");
    //     throw error;
    //   }
    console.log(req.body);
    const { first_name, last_name, email, password, cover_image_url, profile_image_url, username, } = req.body;
    const usernameTaken = yield user_1.User.findUserByUserName(username);
    if (usernameTaken) {
        const error = new Error("username already exist");
        throw error;
    }
    try {
        const id = (0, uuid_1.v4)();
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPw = yield bcryptjs_1.default.hash(password, salt);
        const user = new user_1.User(id, first_name, last_name, email, hashedPw, username, cover_image_url, profile_image_url);
        const userD = yield user.save();
        if (!userD) {
            const error = new Error("an error ocurred");
            throw error;
        }
        res.status(200).json({ message: "user saved successfulyy" });
    }
    catch (error) {
        throw error;
    }
});
exports.signup = signup;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = (yield user_1.User.findUserByUserName(username));
        const isEqual = yield bcryptjs_1.default.compare(password, user.password);
        if (!isEqual) {
            const error = new Error("you have entered the wrong password");
            throw error;
        }
        const token = jsonwebtoken_1.default.sign({
            username: user.username,
            userId: user.user_id,
        }, process.env.JWT_SECRET_KEY);
        if (!token) {
            const error = new Error("could not generate token");
            throw error;
        }
        res.status(200).json({ message: "Login successful", token });
    }
    catch (error) {
        console.log(error);
    }
});
exports.login = login;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, username, cover_image_url, profile_image_url, } = req.body;
    const { userId } = req.params;
    try {
        const updatedDetails = {
            last_name,
            first_name,
            email,
            username,
            cover_image_url,
            profile_image_url,
        };
        const updateResults = (yield user_1.User.updateUserDetails(updatedDetails, userId));
        if (updateResults.failed || !updateResults) {
            console.log(updateResults);
            const error = new Error("updated failed");
            throw error;
        }
        console.log(updateResults);
        res.status(200).json({ message: "Updated user successfully" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.update = update;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    try {
        const response = (yield user_1.User.deleteUser(id));
        if (response.failed || response.rows.affectedRows === 0) {
            const error = new Error("failed to delete");
            throw error;
        }
        res.status(200).json({ message: "user deleted successdully" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteUser = deleteUser;
const findAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = (yield user_1.User.findAll());
        if (response.failed || !response.rows) {
            const error = new Error("could not fetch users");
            throw error;
        }
        res
            .status(200)
            .json({ message: "found all users", response: response.rows });
    }
    catch (error) {
        console.log(error);
    }
});
exports.findAllUsers = findAllUsers;
const findUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = (yield user_1.User.findByID(id));
        if (response.failed || !response.rows) {
            const error = new Error("could not delete");
            throw error;
        }
        res.status(200).json({ message: "found user", data: response.rows });
    }
    catch (error) {
        console.log(error);
    }
});
exports.findUser = findUser;
