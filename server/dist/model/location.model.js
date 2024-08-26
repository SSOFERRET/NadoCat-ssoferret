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
exports.getLocationById = exports.updateLocationById = exports.deleteLocations = exports.addLocation = void 0;
const addLocation = (tx, location) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.locations.create({
        data: {
            longitude: Number(location.longitude),
            latitude: Number(location.latitude),
            detail: location.detail || ""
        },
    });
});
exports.addLocation = addLocation;
const deleteLocations = (tx, locationIds) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.locations.deleteMany({
        where: {
            locationId: {
                in: locationIds
            }
        }
    });
});
exports.deleteLocations = deleteLocations;
const updateLocationById = (tx, locationId, location) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.locations.update({
        where: {
            locationId
        },
        data: location
    });
});
exports.updateLocationById = updateLocationById;
const getLocationById = (tx, locationId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tx.locations.findUnique({
        where: {
            locationId
        }
    });
});
exports.getLocationById = getLocationById;
