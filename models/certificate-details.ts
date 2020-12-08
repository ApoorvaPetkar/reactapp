class CertificateDetails {
    constructor(public keyFile: string, public certFile: string,
        public passphrase: string) { }
};

export {
    CertificateDetails
};