import { LogManager } from "./common";
import { CertificateDetails, Customer } from "./models";
import { Configuration } from "./config";
import { CustomerService } from "./business/services";
import { CustomerServiceHost, IServiceHost } from "./hosting";

const DEFAULT_PORT_NUMBER = 8080;
const INVALID_SSL_CERTIFICATE_DETAILS = "Invalid SSL Certificate Env. Details Specified!";

class MainClass {
    static main(): void {
        try {
            const portNumber = parseInt(process.env.LISTENER_PORT || "") || DEFAULT_PORT_NUMBER;
            const enableHttps = (process.env.ENABLE_HTTPS || "") === "true";
            let host: IServiceHost;

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
                const certificateDetails = new CertificateDetails(certFile, keyFile, passphrase);

                host = new CustomerServiceHost(portNumber, enableHttps, certificateDetails);
            } else {
                host = new CustomerServiceHost(portNumber, enableHttps);
            }

            host.start()
                .then(() => LogManager.info("Customer Service Host Started Successfully!"),
                    () => LogManager.error("Unable to Start the Customer Service Host!"));

            const shutdown = () => {
                host.stop()
                    .then(
                        () => LogManager.info("Customer Service Host Stopped Successfully!"),
                        () => LogManager.error("Unable to Stop the Customer Service Host"!));
            };

            process.on('exit', shutdown);
            process.on('SIGINT', shutdown);
        } catch (error) {
            LogManager.error(error);
        }
    }
}

MainClass.main();