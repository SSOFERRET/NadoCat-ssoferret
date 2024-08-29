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
exports.deleteLocationsByLocationIds = exports.getAndDeleteLocationFormats = void 0;
const missing_model_1 = require("../../model/missing.model");
const location_model_1 = require("../../model/location.model");
const getAndDeleteLocationFormats = (tx, postData) => __awaiter(void 0, void 0, void 0, function* () {
    const locations = yield (0, missing_model_1.getLocationFormatsByPostId)(tx, postData);
    yield (0, missing_model_1.deleteLocationFormats)(tx, postData);
    return locations;
});
exports.getAndDeleteLocationFormats = getAndDeleteLocationFormats;
const deleteLocationsByLocationIds = (tx, locations) => __awaiter(void 0, void 0, void 0, function* () {
    const formattedLocations = locations.map((location) => location.locationId);
    return yield (0, location_model_1.deleteLocations)(tx, formattedLocations);
});
exports.deleteLocationsByLocationIds = deleteLocationsByLocationIds;
