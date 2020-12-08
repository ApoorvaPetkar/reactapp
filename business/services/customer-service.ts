import { Configuration } from "../../config";
import { ICustomer, LogManager } from "../../common";
import { ICustomerService } from "./icustomer-services";
import { CustomersContext, Mongoose } from "../../db-management";

const INVALID_CONNECTION_STRING = "Invalid Connection String Specified!";
const INVALID_ARGUMENTS = "Invalid Argument(s) Specified!";
const MIN_CHARS = 3;
const MIN_CREDIT = 1;

class CustomerService implements ICustomerService {
    private connectionString: string;
    private badKeywords: Set<string> = new Set<string>(["bad", "not good", "worse"]);

    constructor() {
        const configurationSettings = Configuration.getConfiguration();
        const connectionString = configurationSettings?.getConnectionString();

        if (!connectionString) {
            throw new Error(INVALID_CONNECTION_STRING);
        }

        this.connectionString = connectionString;
    }

    public async getCustomers(): Promise<ICustomer[] | null> {
        let customers: ICustomer[] | null = [];

        try {
            await Mongoose.connect(this.connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            customers = await CustomersContext.find({});
        } catch (exception) {
            LogManager.error(exception);

            throw exception;
        }
        finally {
            await Mongoose.disconnect();
        }

        return customers;
    }

    public async getCustomerById(customerId: number): Promise<ICustomer | null> {
        let filteredCustomer: ICustomer | null;

        if (!customerId) {
            throw new Error(INVALID_ARGUMENTS);
        }

        try {
            await Mongoose.connect(this.connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            filteredCustomer =
                await CustomersContext.findOne({ customerId: customerId });
        } catch (exception) {
            LogManager.error(exception);

            throw exception;
        } finally {
            await Mongoose.disconnect();
        }

        return filteredCustomer;
    }

    public async searchCustomers(searchString: string): Promise<ICustomer[] | null> {
        let filteredCustomers: ICustomer[] | null = [];

        const validation = searchString && searchString.length >= MIN_CHARS &&
            !this.badKeywords.has(searchString);

        if (!validation)
            throw new Error(INVALID_ARGUMENTS);

        try {
            await Mongoose.connect(this.connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            filteredCustomers = await CustomersContext.find({
                customerName: {
                    $regex: searchString,
                    $options: "-i"
                }
            });
        } catch (exception) {
            LogManager.error(exception);

            throw exception;
        } finally {
            await Mongoose.disconnect();
        }

        return filteredCustomers;
    }

    public async addNewCustomer(customerRecord: ICustomer): Promise<boolean> {
        let status: boolean = false;

        const validation = customerRecord !== null &&
            customerRecord.customerId && customerRecord.customerName &&
            customerRecord.creditLimit >= MIN_CREDIT;

        if (!validation) {
            throw new Error(INVALID_ARGUMENTS);
        }

        try {
            await Mongoose.connect(this.connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            const addedRecord = await CustomersContext.create(customerRecord);

            status = addedRecord !== null && addedRecord._id !== null;
        } catch (exception) {
            LogManager.error(exception);

            throw exception;
        } finally {
            await Mongoose.disconnect();
        }

        return status;
    }
}

export {
    CustomerService
};