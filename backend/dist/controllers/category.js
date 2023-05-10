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
exports.findCategory = exports.deleteCategory = exports.findAllCategories = exports.updateCategory = exports.saveCategory = void 0;
const category_1 = require("../models/category");
const uuid_1 = require("uuid");
const saveCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name) {
        const error = new Error(" entry cannot be empty");
        throw error;
    }
    try {
        console.log(req.body);
        const id = (0, uuid_1.v4)();
        const series = new category_1.Category(id, name);
        const newCategory = (yield series.save());
        if (newCategory.failed ||
            !newCategory ||
            newCategory.rows.affectedRows === 0) {
            console.log(newCategory);
            const error = new Error("an error occured, could not save");
            throw error;
        }
        res.status(200).json({ message: "saved category successfully " });
    }
    catch (error) {
        console.log(error);
    }
});
exports.saveCategory = saveCategory;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const { id } = req.params;
    if (!req.body || !id) {
        const error = new Error(" category details or the category id are missing");
        throw id;
    }
    try {
        const categories = { name, id };
        const updateResponse = (yield category_1.Category.update(categories));
        if (updateResponse.failed || updateResponse.rows.affectedRows === 0) {
            console.log(updateResponse);
            const error = new Error("an error occured, could not update");
            throw error;
        }
        console.log(updateResponse);
        res.status(200).json({ message: "category  updated" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateCategory = updateCategory;
const findAllCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = (yield category_1.Category.findAll());
        if (response.failed) {
            const error = new Error("could not fetch categories");
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
exports.findAllCategories = findAllCategories;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    try {
        const response = (yield category_1.Category.deleteSeries(id));
        if (response.failed || response.rows.affectedRows === 0) {
            const error = new Error("failed to delete");
            throw error;
        }
        res.status(200).json({ message: "category deleted successdully" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteCategory = deleteCategory;
const findCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = (yield category_1.Category.findByID(id));
        if (response.failed) {
            const error = new Error("could not get category");
            throw error;
        }
        res.status(200).json({ message: "found category", data: response.rows });
    }
    catch (error) {
        console.log(error);
    }
});
exports.findCategory = findCategory;
