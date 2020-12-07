"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogManager = void 0;
const tslog_1 = require("tslog");
const LogManager = new tslog_1.Logger({
    displayDateTime: true,
    displayFilePath: "displayAll"
});
exports.LogManager = LogManager;
//# sourceMappingURL=log-manager.js.map