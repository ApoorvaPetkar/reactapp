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
exports.CustomerService = void 0;
const config_1 = require("../../config");
const common_1 = require("../../common");
const db_management_1 = require("../../db-management");
const INVALID_CONNECTION_STRING = "Invalid Connection String Specified!";
const INVALID_ARGUMENTS = "Invalid Argument(s) Specified!";
const MIN_CHARS = 3;
const MIN_CREDIT = 1;
class CustomerService {
    constructor() {
        this.badKeywords = new Set(["bad", "not good", "worse"]);
        const configurationSettings = config_1.Configuration.getConfiguration();
        const connectionString = configurationSettings === null || configurationSettings === void 0 ? void 0 : configurationSettings.getConnectionString();
        if (!connectionString) {
            throw new Error(INVALID_CONNECTION_STRING);
        }
        this.connectionString = connectionString;
    }
    getCustomers() {
        return __awaiter(this, void 0, void 0, function* () {
            let customers = [];
            try {
                yield db_management_1.Mongoose.connect(this.connectionString, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                customers = yield db_management_1.CustomersContext.find({});
            }
            catch (exception) {
                common_1.LogManager.error(exception);
                throw exception;
            }
            finally {
                yield db_management_1.Mongoose.disconnect();
            }
            return customers;
        });
    }
    getCustomerById(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let filteredCustomer;
            if (!customerId) {
                throw new Error(INVALID_ARGUMENTS);
            }
            try {
                yield db_management_1.Mongoose.connect(this.connectionString, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                filteredCustomer =
                    yield db_management_1.CustomersContext.findOne({ customerId: customerId });
            }
            catch (exception) {
                common_1.LogManager.error(exception);
                throw exception;
            }
            finally {
                yield db_management_1.Mongoose.disconnect();
            }
            return filteredCustomer;
        });
    }
    searchCustomers(searchString) {
        return __awaiter(this, void 0, void 0, function* () {
            let filteredCustomers = [];
            const validation = searchString && searchString.length >= MIN_CHARS &&
                !this.badKeywords.has(searchString);
            if (!validation)
                throw new Error(INVALID_ARGUMENTS);
            try {
                yield db_management_1.Mongoose.connect(this.connectionString, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                filteredCustomers = yield db_management_1.CustomersContext.find({
                    customerName: {
                        $regex: searchString,
                        $options: "-i"
                    }
                });
            }
            catch (exception) {
                common_1.LogManager.error(exception);
                throw exception;
            }
            finally {
                yield db_management_1.Mongoose.disconnect();
            }
            return filteredCustomers;
        });
    }
    addNewCustomer(customerRecord) {
        return __awaiter(this, void 0, void 0, function* () {
            let status = false;
            const validation = customerRecord !== null &&
                customerRecord.customerId && customerRecord.customerName &&
                customerRecord.creditLimit >= MIN_CREDIT;
            if (!validation) {
                throw new Error(INVALID_ARGUMENTS);
            }
            try {
                yield db_management_1.Mongoose.connect(this.connectionString, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
                const addedRecord = yield db_management_1.CustomersContext.create(customerRecord);
                status = addedRecord !== null && addedRecord._id;
            }
            catch (exception) {
                common_1.LogManager.error(exception);
                throw exception;
            }
            finally {
                yield db_management_1.Mongoose.disconnect();
            }
            return status;
        });
    }
}
exports.CustomerService = CustomerService;
//# sourceMappingURL=customer-service.js.map