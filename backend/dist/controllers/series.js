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
exports.findSeries = exports.deleteSeries = exports.findAllSeries = exports.updateSeries = exports.saveSeries = void 0;
const series_1 = require("../models/series");
const uuid_1 = require("uuid");
const saveSeries = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    if (!name || !description) {
        const error = new Error(" entry cannot be empty");
        throw error;
    }
    try {
        const id = (0, uuid_1.v4)();
        const series = new series_1.Series(id, name, description);
        const newSeries = (yield series.save());
        if (newSeries.failed || !newSeries || newSeries.rows.affectedRows === 0) {
            console.log(newSeries);
            const error = new Error("an error occured, could not save");
            throw error;
        }
        res.status(200).json({ message: "saved series successfully " });
    }
    catch (error) {
        console.log(error);
    }
});
exports.saveSeries = saveSeries;
const updateSeries = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    const { id } = req.params;
    if (!req.body || !id) {
        const error = new Error(" category details or the category id are missing");
        throw id;
    }
    try {
        const details = { name, description, id };
        const updateResponse = (yield series_1.Series.update(details));
        if (updateResponse.failed || updateResponse.rows.affectedRows === 0) {
            console.log(updateResponse);
            const error = new Error("an error occured, could not update");
            throw error;
        }
        console.log(updateResponse);
        res.status(200).json({ message: "series  updated" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateSeries = updateSeries;
const findAllSeries = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = (yield series_1.Series.findAll());
        if (response.failed) {
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
exports.findAllSeries = findAllSeries;
const deleteSeries = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    try {
        const response = (yield series_1.Series.deleteSeries(id));
        if (response.failed || response.rows.affectedRows === 0) {
            const error = new Error("failed to delete");
            throw error;
        }
        res.status(200).json({ message: "series deleted successdully" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteSeries = deleteSeries;
const findSeries = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const response = (yield series_1.Series.findByID(id));
        if (response.failed) {
            const error = new Error("could not get series");
            throw error;
        }
        res.status(200).json({ message: "found series", data: response.rows });
    }
    catch (error) {
        console.log(error);
    }
});
exports.findSeries = findSeries;
