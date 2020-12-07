const DEFAULT_MINIMUM = 1;
const DEFAULT_MAXIMUM = 100000000;

class RandomGenerator {
    public static generate(minimum = DEFAULT_MINIMUM, maximum = DEFAULT_MAXIMUM) {
        const generatedNumber = Math.floor(
            Math.random() * (maximum - minimum) + minimum);

        return generatedNumber;
    }
}

export {
    RandomGenerator
};