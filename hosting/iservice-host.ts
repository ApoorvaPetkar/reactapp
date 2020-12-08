interface IServiceHost {
    start(): Promise<boolean>;
    stop(): Promise<boolean>;
}

export {
    IServiceHost
};
