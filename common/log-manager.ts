import { Logger } from "tslog";

const LogManager = new Logger({
    displayDateTime: true,
    displayFilePath: "displayAll"
});

export {
    LogManager
};