import http from 'http';
import https from 'https';
import net from 'net';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import { IServiceHost } from './iservice-host';
import { CustomerRouting, ICustomerRouting } from '../routing';
import { CertificateDetails } from '../models';
import { LogManager } from '../common';


const INVALID_CERTIFICATE_DETAILS = "Invalid SSL Certificate Details Provided!";
const CUSTOMERS_API = "/api/customers";
const PUBLIC_ROOT = "/";

class CustomerServiceHost implements IServiceHost {
    private customerRouting: ICustomerRouting;
    private application: express.Application;
    private webServer: net.Server;

    constructor(private portNumber: number,
        httpsEnabled: boolean,
        certificateDetails?: CertificateDetails | null) {
        this.customerRouting = new CustomerRouting();
        this.application = express();

        if (httpsEnabled) {
            const validation = certificateDetails && certificateDetails.keyFile !== null &&
                certificateDetails.certFile !== null &&
                fs.existsSync(certificateDetails.keyFile) &&
                fs.existsSync(certificateDetails.certFile);

            if (!validation) {
                throw new Error(INVALID_CERTIFICATE_DETAILS);
            }

            const keyFile = certificateDetails?.keyFile || "";
            const certFile = certificateDetails?.certFile || "";

            this.webServer = https.createServer({
                key: fs.readFileSync(keyFile),
                cert: fs.readFileSync(certFile),
                passphrase: certificateDetails?.passphrase
            }, this.application);
        } else {
            this.webServer = http.createServer(this.application);
        }

        this.initialize();
    }

    private applyCors(request: express.Request, response: express.Response, next: express.NextFunction) {
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Methods", "*");
        response.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, X-Requested-With");
        response.header("Access-Control-Allow-Credentials", "true");

        next();
    }

    private initialize() {
        if (this.application) {
            this.application.use(this.applyCors);
            this.application.use(bodyParser.json());
            this.application.use(CUSTOMERS_API, this.customerRouting.Router);
            this.application.use(PUBLIC_ROOT, express.static("public"));
        }
    }

    public start(): Promise<boolean> {
        const promise = new Promise<boolean>(
            (resolve, reject) => {
                try {
                    if (this.webServer) {
                        this.webServer.listen(this.portNumber, () => {
                            resolve(true);
                        });
                    } else reject(false);
                } catch (exception) {
                    LogManager.error(exception);

                    reject(false);
                }
            });

        return promise;
    }

    public stop(): Promise<boolean> {
        const promise = new Promise<boolean>(
            (resolve, reject) => {
                try {
                    if (this.webServer) {
                        this.webServer.close(() => {
                            resolve(true);
                        });
                    } else reject(false);
                } catch (exception) {
                    LogManager.error(exception);

                    reject(false);
                }
            });

        return promise;
    }
}

export {
    CustomerServiceHost
};