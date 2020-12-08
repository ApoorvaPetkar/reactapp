import { ICustomer } from "../../common";

interface ICustomerService {
    getCustomers(): Promise<ICustomer[] | null>;
    getCustomerById(customerId: number): Promise<ICustomer | null>;
    searchCustomers(searchString: string): Promise<ICustomer[] | null>;
    addNewCustomer(customerRecord: ICustomer): Promise<boolean>;
}

export {
    ICustomerService
};