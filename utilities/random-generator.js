"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomGenerator = void 0;
const DEFAULT_MINIMUM = 1;
const DEFAULT_MAXIMUM = 100000000;
class RandomGenerator {
    static generate(minimum = DEFAULT_MINIMUM, maximum = DEFAULT_MAXIMUM) {
        const generatedNumber = Math.floor(Math.random() * (maximum - minimum) + minimum);
        return generatedNumber;
    }
}
exports.RandomGenerator = RandomGenerator;
//# sourceMappingURL=random-generator.js.map