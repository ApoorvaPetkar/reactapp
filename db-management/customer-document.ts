import { Mongoose } from "./connection-manager";
import { ICustomer } from "../common";

interface CustomerDocument extends ICustomer, Mongoose.Document {
}

export {
    CustomerDocument
};
