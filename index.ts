import { LogManager } from "./common";
import { Customer } from "./models";

class MainClass {
    static main(): void {
        const customer = new Customer(1, "Northwind", "Bangalore",
            "info@northwind.com", "080-498349834", "SILVER",
            12000, true, "Simple Remarks");

        LogManager.info(customer.toString());
    }
}

MainClass.main();