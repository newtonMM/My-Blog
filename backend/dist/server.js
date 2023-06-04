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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_1 = __importDefault(require("./routes/user"));
const series_1 = __importDefault(require("./routes/series"));
const category_1 = __importDefault(require("./routes/category"));
const articles_1 = __importDefault(require("./routes/articles"));
const comments_1 = __importDefault(require("./routes/comments"));
const express_session_1 = __importDefault(require("express-session"));
const sessions_1 = require("./models/sessions");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use((0, express_session_1.default)({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    store: sessions_1.sessionStore,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use(user_1.default);
app.use(series_1.default);
app.use(category_1.default);
app.use(articles_1.default);
app.use(comments_1.default);
app.use((error, req, res, next) => {
    console.log("from server", error);
    const statusCode = 500;
    const message = "an error occured";
    res.status(statusCode).json({ message: message });
});
app.listen(3000, () => {
    console.log("we are server is running at port 3000");
});
