"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerServiceHost = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const routing_1 = require("../routing");
const common_1 = require("../common");
const INVALID_CERTIFICATE_DETAILS = "Invalid SSL Certificate Details Provided!";
const CUSTOMERS_API = "/api/customers";
const PUBLIC_ROOT = "/";
class CustomerServiceHost {
    constructor(portNumber, httpsEnabled, certificateDetails) {
        this.portNumber = portNumber;
        this.customerRouting = new routing_1.CustomerRouting();
        this.application = express_1.default();
        if (httpsEnabled) {
            const validation = certificateDetails && certificateDetails.keyFile !== null &&
                certificateDetails.certFile !== null &&
                fs_1.default.existsSync(certificateDetails.keyFile) &&
                fs_1.default.existsSync(certificateDetails.certFile);
            if (!validation) {
                throw new Error(INVALID_CERTIFICATE_DETAILS);
            }
            const keyFile = (certificateDetails === null || certificateDetails === void 0 ? void 0 : certificateDetails.keyFile) || "";
            const certFile = (certificateDetails === null || certificateDetails === void 0 ? void 0 : certificateDetails.certFile) || "";
            this.webServer = https_1.default.createServer({
                key: fs_1.default.readFileSync(keyFile),
                cert: fs_1.default.readFileSync(certFile),
                passphrase: certificateDetails === null || certificateDetails === void 0 ? void 0 : certificateDetails.passphrase
            }, this.application);
        }
        else {
            this.webServer = http_1.default.createServer(this.application);
        }
        this.initialize();
    }
    applyCors(request, response, next) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Methods", "*");
        response.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, X-Requested-With");
        response.header("Access-Control-Allow-Credentials", "true");
        next();
    }
    initialize() {
        if (this.application) {
            this.application.use(this.applyCors);
            this.application.use(body_parser_1.default.json());
            this.application.use(CUSTOMERS_API, this.customerRouting.Router);
            this.application.use(PUBLIC_ROOT, express_1.default.static("public"));
        }
    }
    start() {
        const promise = new Promise((resolve, reject) => {
            try {
                if (this.webServer) {
                    this.webServer.listen(this.portNumber, () => {
                        resolve(true);
                    });
                }
                else
                    reject(false);
            }
            catch (exception) {
                common_1.LogManager.error(exception);
                reject(false);
            }
        });
        return promise;
    }
    stop() {
        const promise = new Promise((resolve, reject) => {
            try {
                if (this.webServer) {
                    this.webServer.close(() => {
                        resolve(true);
                    });
                }
                else
                    reject(false);
            }
            catch (exception) {
                common_1.LogManager.error(exception);
                reject(false);
            }
        });
        return promise;
    }
}
exports.CustomerServiceHost = CustomerServiceHost;
//# sourceMappingURL=customer-service-hosting.js.map