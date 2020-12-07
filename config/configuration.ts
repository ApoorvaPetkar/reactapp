
const DEFAULT_MONGO_SERVER = "localhost";
const DEFAULT_MONGO_PORT = 27017;
const DEFAULT_MONGO_DB = "reacttrainingdb";

class Configuration {
    public static getConfiguration() {
        let connectionString = process.env.MONGO_CONNECTION_STRING;

        if (!connectionString) {
            const mongoServer = process.env.MONGO_SERVER || DEFAULT_MONGO_SERVER;
            const mongoPort = process.env.MONGO_PORT || DEFAULT_MONGO_PORT;
            const mongoDbName = process.env.MONGO_DB || DEFAULT_MONGO_DB;

            connectionString = `mongodb://${mongoServer}:${mongoPort}/${mongoDbName}`;
        }

        const settings = {
            getConnectionString: () => connectionString
        };

        return settings;
    }
}

export {
    Configuration
};
