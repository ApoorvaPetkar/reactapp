import { CustomerService, ICustomerService } from '../business/services';
import express from 'express';
import { ICustomerRouting } from './icustomer-routing';
import { HttpStatusCodes } from '../constants';
import { Customer } from '../models';

const NO_RECORDS_FOUND = "No Customer Record(s) Found!";
const INVALID_ARGUMENTS = "Invalid Customer Argument(s) Specified!";
const MIN_SEARCH_STR_LEN = 3;
const UNKNOWN_ERROR = "Unknown Error Occurred, Try again later!";
const MIN_RECORDS = 1;

class CustomerRouting implements ICustomerRouting {
    private router: express.Router;
    private customerService: ICustomerService;

    constructor(customerService?: ICustomerService) {
        this.customerService = customerService || new CustomerService();
        this.router = express.Router();

        this.initializeRouting();
    }

    private initializeRouting() {
        this.router.get("/", async (request, response) => {
            try {
                const customerRecords = await this.customerService.getCustomers();

                if (customerRecords) {
                    response
                        .status(HttpStatusCodes.OK)
                        .send(customerRecords);
                }
                else {
                    response
                        .status(HttpStatusCodes.NO_CONTENT)
                        .send({
                            message: NO_RECORDS_FOUND
                        });
                }
            } catch (exception) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send(exception);
            }
        });

        this.router.get("/:customerId", async (request, response) => {
            const customerId = parseInt(request.params.customerId || "");

            if (!customerId) {
                response
                    .status(HttpStatusCodes.BAD_REQUEST)
                    .send({
                        message: INVALID_ARGUMENTS
                    });

                return;
            }

            try {
                const filteredRecord = await this.customerService.getCustomerById(customerId);

                if (filteredRecord) {
                    response
                        .status(HttpStatusCodes.OK)
                        .send(filteredRecord);
                }
                else {
                    response
                        .status(HttpStatusCodes.NO_CONTENT)
                        .send({
                            message: NO_RECORDS_FOUND
                        });
                }
            } catch (exception) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send(exception);
            }
        });

        this.router.get("/search/:searchString", async (request, response) => {
            const searchString = request.params.searchString;
            const validation = searchString && searchString.length >= MIN_SEARCH_STR_LEN;

            if (!validation) {
                response
                    .status(HttpStatusCodes.BAD_REQUEST)
                    .send({
                        message: INVALID_ARGUMENTS
                    });

                return;
            }

            try {
                const filteredRecords = await this.customerService.searchCustomers(searchString);

                if (filteredRecords !== null && filteredRecords.length >= MIN_RECORDS) {
                    response
                        .status(HttpStatusCodes.OK)
                        .send(filteredRecords);
                } else {
                    response
                        .status(HttpStatusCodes.NO_CONTENT)
                        .send({
                            message: NO_RECORDS_FOUND
                        });
                }
            } catch (exception) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send(exception);
            }
        });

        this.router.post("/", async (request, response) => {
            const body = request.body;
            const customerRecord: Customer = new Customer(
                body.customerId, body.customerName, body.add,
                body.email, body.phoneNumber, body.customerType,
                body.creditLimit, body.activeStatus, body.remarks);

            const validation = customerRecord !== null &&
                customerRecord.customerId && customerRecord.customerName &&
                customerRecord.creditLimit;

            if (!validation) {
                response
                    .status(HttpStatusCodes.BAD_REQUEST)
                    .send({
                        message: INVALID_ARGUMENTS
                    });

                return;
            }

            try {
                const status = await this.customerService.addNewCustomer(customerRecord);

                if (status) {
                    response
                        .status(HttpStatusCodes.OK)
                        .send(status);
                } else {
                    response
                        .status(HttpStatusCodes.SERVER_ERROR)
                        .send({
                            message: UNKNOWN_ERROR
                        });
                }
            } catch (exception) {
                response
                    .status(HttpStatusCodes.SERVER_ERROR)
                    .send(exception);
            }
        });
    }

    public get Router() {
        return this.router;
    }
}

export {
    CustomerRouting
};
