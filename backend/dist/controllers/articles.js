"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findArticle = exports.deleteArticle = exports.findAllArticles = exports.updateArticle = exports.saveArticle = void 0;
const articles_1 = require("../models/articles");
const uuid_1 = require("uuid");
const saveArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, image_url, category_id, series_id, author_id, } = req.body;
    try {
        console.log(req.body);
        const id = (0, uuid_1.v4)();
        const article = new articles_1.Articles(id, image_url, content, category_id, series_id, author_id, title);
        const newArticle = (yield article.save());
        if (newArticle.failed || newArticle.rows.affectedRows === 0) {
            console.log(newArticle);
            const error = new Error("an error occured, could not save");
            throw error;
        }
        res
            .status(200)
            .json({ message: "saved article successfully ", newArticle });
    }
    catch (error) {
        console.log(error);
    }
});
exports.saveArticle = saveArticle;
const updateArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { image_url, content, title, category_id } = req.body;
    const { id } = req.params;
    if (Object.values(req.body).includes(undefined)) {
        const error = new Error("some of  article details  missing");
        throw id;
    }
    try {
        const article = { id, image_url, content, title, category_id };
        const updateResponse = (yield articles_1.Articles.update(article));
        if (updateResponse.failed || updateResponse.rows.affectedRows === 0) {
            console.log(updateResponse);
            const error = new Error("an error occured, could not update");
            throw error;
        }
        console.log(updateResponse);
        res.status(200).json({ message: "Articles  updated" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateArticle = updateArticle;
const findAllArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = (yield articles_1.Articles.findAll());
        if (response.failed) {
            const error = new Error("could not fetch articles");
            throw error;
        }
        res
            .status(200)
            .json({ message: "found all articles", response: response.rows });
    }
    catch (error) {
        console.log(error);
    }
});
exports.findAllArticles = findAllArticles;
const deleteArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    try {
        const response = (yield articles_1.Articles.deleteArticle(id));
        if (response.failed || response.rows.affectedRows === 0) {
            const error = new Error("failed to delete");
            throw error;
        }
        res.status(200).json({ message: "Articles deleted successdully" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteArticle = deleteArticle;
const findArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = (yield articles_1.Articles.findByID(id));
        if (response.failed) {
            const error = new Error("could not get article");
            throw error;
        }
        res.status(200).json({ message: "found article", data: response.rows });
    }
    catch (error) {
        console.log(error);
    }
});
exports.findArticle = findArticle;
