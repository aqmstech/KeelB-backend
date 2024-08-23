import { HTTPCONF } from "../configs/http";

export interface Environment {
    env: string;
    defaultDB: boolean;
    logger: 'sentry',
    delayStart: number;
    config: HTTPCONF,
    vault: {
        configType: "aws" | "hashicorp";
        keyname: string;
        protocol?: string,
        host?: string
        port?: number;
        login?: string;
        apiversion?: string;
    }
}