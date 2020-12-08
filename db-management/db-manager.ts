import { CustomerSchema } from "../db-schemas";
import { Mongoose } from "./connection-manager";
import { CustomerDocument } from "./customer-document";

const CustomersContext = Mongoose.model<CustomerDocument>("customers",
    new Mongoose.Schema(CustomerSchema));

export {
    CustomersContext
};
