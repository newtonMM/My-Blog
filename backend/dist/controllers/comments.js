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
exports.findComment = exports.findAllArticleComments = exports.deleteComment = exports.updateComment = exports.saveComment = void 0;
const comments_1 = require("../models/comments");
const saveComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment, article_id, user_prof_id } = req.body;
    try {
        const newComment = new comments_1.Comments(comment, article_id, user_prof_id);
        const response = (yield newComment.save());
        if (response.failed) {
            console.log(response);
            const error = { code: 200, message: "failed" };
            throw error;
        }
        res.status(200).json({ message: "saved successfully", response });
    }
    catch (error) {
        next(error);
    }
});
exports.saveComment = saveComment;
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = req.body;
    const id = parseInt(req.params.id);
    if (!req.body || !id) {
        const error = new Error(" comment details or the category id are missing");
        throw id;
    }
    const data = { comment, id };
    try {
        const response = (yield comments_1.Comments.update(data));
        console.log(response);
        if (response.failed) {
            const error = new Error("could not update the comment ");
            throw error;
        }
        res.status(200).json({ message: "updated successfully " });
    }
    catch (error) {
        next(error);
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params);
    const id = parseInt(req.params.id);
    console;
    try {
        const response = (yield comments_1.Comments.delete(id));
        console.log(response);
        if (response.failed || response.rows.affectedRows === 0) {
            const error = new Error("could not delete the comment ");
            throw error;
        }
        res.status(200).json({ message: "delete successful" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteComment = deleteComment;
const findAllArticleComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { article_id } = req.params;
    console.log(req.session);
    try {
        const response = (yield comments_1.Comments.findAll(article_id));
        if (response.failed || response.rows.length === 0) {
            const error = new Error("could not find the comment ");
            throw error;
        }
        console.log(response);
        res
            .status(200)
            .json({ message: " found the comment ", data: response.rows });
    }
    catch (error) {
        next(error);
    }
});
exports.findAllArticleComments = findAllArticleComments;
const findComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const response = (yield comments_1.Comments.findOne(id));
        if (response.failed) {
            const error = new Error("could not find the comment ");
            throw error;
        }
        res.status(200).json({ message: "success", data: response.rows });
    }
    catch (error) {
        next(error);
    }
});
exports.findComment = findComment;
