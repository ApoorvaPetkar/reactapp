"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
const models_1 = require("./models");
const hosting_1 = require("./hosting");
const DEFAULT_PORT_NUMBER = 8080;
const INVALID_SSL_CERTIFICATE_DETAILS = "Invalid SSL Certificate Env. Details Specified!";
class MainClass {
    static main() {
        try {
            const portNumber = parseInt(process.env.LISTENER_PORT || "") || DEFAULT_PORT_NUMBER;
            const enableHttps = (process.env.ENABLE_HTTPS || "") === "true";
            let host;
            if (enableHttps) {
                const certFile = process.env.CERT_FILE;
                if (!certFile) {
                    throw new Error(INVALID_SSL_CERTIFICATE_DETAILS);
                }
                const keyFile = process.env.KEY_FILE;
                if (!keyFile) {
                    throw new Error(INVALID_SSL_CERTIFICATE_DETAILS);
                }
                const passphrase = process.env.PASS_PHRASE || "";
                const certificateDetails = new models_1.CertificateDetails(certFile, keyFile, passphrase);
                host = new hosting_1.CustomerServiceHost(portNumber, enableHttps, certificateDetails);
            }
            else {
                host = new hosting_1.CustomerServiceHost(portNumber, enableHttps);
            }
            host.start()
                .then(() => common_1.LogManager.info("Customer Service Host Started Successfully!"), () => common_1.LogManager.error("Unable to Start the Customer Service Host!"));
            const shutdown = () => {
                host.stop()
                    .then(() => common_1.LogManager.info("Customer Service Host Stopped Successfully!"), () => common_1.LogManager.error("Unable to Stop the Customer Service Host"));
            };
            process.on('exit', shutdown);
            process.on('SIGINT', shutdown);
        }
        catch (error) {
            common_1.LogManager.error(error);
        }
    }
}
MainClass.main();
//# sourceMappingURL=index.js.map