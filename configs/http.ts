export interface HTTPCONF {

    PORT: number;
    AllowCors: boolean;
    GracefullShutdown: boolean
    VAULT: boolean,
    ServiceName: string,
    QUEUE: "aws" | "rmq",
    services?: {
        [key: string]: {
            host: string,
            port: string,
            protocol: string
        }
    }
}
