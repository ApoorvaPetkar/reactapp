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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRouting = void 0;
const services_1 = require("../business/services");
const express_1 = __importDefault(require("express"));
const constants_1 = require("../constants");
const models_1 = require("../models");
const NO_RECORDS_FOUND = "No Customer Record(s) Found!";
const INVALID_ARGUMENTS = "Invalid Customer Argument(s) Specified!";
const MIN_SEARCH_STR_LEN = 3;
const UNKNOWN_ERROR = "Unknown Error Occurred, Try again later!";
const MIN_RECORDS = 1;
class CustomerRouting {
    constructor(customerService) {
        this.customerService = customerService || new services_1.CustomerService();
        this.router = express_1.default.Router();
        this.initializeRouting();
    }
    initializeRouting() {
        this.router.get("/", (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customerRecords = yield this.customerService.getCustomers();
                if (customerRecords) {
                    response
                        .status(constants_1.HttpStatusCodes.OK)
                        .send(customerRecords);
                }
                else {
                    response
                        .status(constants_1.HttpStatusCodes.NO_CONTENT)
                        .send({
                        message: NO_RECORDS_FOUND
                    });
                }
            }
            catch (exception) {
                response
                    .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                    .send(exception);
            }
        }));
        this.router.get("/:customerId", (request, response) => __awaiter(this, void 0, void 0, function* () {
            const customerId = parseInt(request.params.customerId || "");
            if (!customerId) {
                response
                    .status(constants_1.HttpStatusCodes.BAD_REQUEST)
                    .send({
                    message: INVALID_ARGUMENTS
                });
                return;
            }
            try {
                const filteredRecord = yield this.customerService.getCustomerById(customerId);
                if (filteredRecord) {
                    response
                        .status(constants_1.HttpStatusCodes.OK)
                        .send(filteredRecord);
                }
                else {
                    response
                        .status(constants_1.HttpStatusCodes.NO_CONTENT)
                        .send({
                        message: NO_RECORDS_FOUND
                    });
                }
            }
            catch (exception) {
                response
                    .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                    .send(exception);
            }
        }));
        this.router.get("/search/:searchString", (request, response) => __awaiter(this, void 0, void 0, function* () {
            const searchString = request.params.searchString;
            const validation = searchString && searchString.length >= MIN_SEARCH_STR_LEN;
            if (!validation) {
                response
                    .status(constants_1.HttpStatusCodes.BAD_REQUEST)
                    .send({
                    message: INVALID_ARGUMENTS
                });
                return;
            }
            try {
                const filteredRecords = yield this.customerService.searchCustomers(searchString);
                if (filteredRecords !== null && filteredRecords.length >= MIN_RECORDS) {
                    response
                        .status(constants_1.HttpStatusCodes.OK)
                        .send(filteredRecords);
                }
                else {
                    response
                        .status(constants_1.HttpStatusCodes.NO_CONTENT)
                        .send({
                        message: NO_RECORDS_FOUND
                    });
                }
            }
            catch (exception) {
                response
                    .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                    .send(exception);
            }
        }));
        this.router.post("/", (request, response) => __awaiter(this, void 0, void 0, function* () {
            const body = request.body;
            const customerRecord = new models_1.Customer(body.customerId, body.customerName, body.add, body.email, body.phoneNumber, body.customerType, body.creditLimit, body.activeStatus, body.remarks);
            const validation = customerRecord !== null &&
                customerRecord.customerId && customerRecord.customerName &&
                customerRecord.creditLimit;
            if (!validation) {
                response
                    .status(constants_1.HttpStatusCodes.BAD_REQUEST)
                    .send({
                    message: INVALID_ARGUMENTS
                });
                return;
            }
            try {
                const status = yield this.customerService.addNewCustomer(customerRecord);
                if (status) {
                    response
                        .status(constants_1.HttpStatusCodes.OK)
                        .send(status);
                }
                else {
                    response
                        .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                        .send({
                        message: UNKNOWN_ERROR
                    });
                }
            }
            catch (exception) {
                response
                    .status(constants_1.HttpStatusCodes.SERVER_ERROR)
                    .send(exception);
            }
        }));
    }
    get Router() {
        return this.router;
    }
}
exports.CustomerRouting = CustomerRouting;
//# sourceMappingURL=customer-routing.js.map