import { DBConfigMongo } from "../configs/database";

export interface SMTP {
    [key: string]: {
        host: string;
        port: number;
        auth: {
            user: string;
            pass: string;
        }
    }
}


export interface AESEncryption {
    algorithm: string,
    salt: string;
    iv: string;
}

export interface Sentry {
    dsn: string;
    security_header_endpoint: string;
    minidumo_endpoint: string;
}

export interface Logging {
    SENTRY: Sentry
}

export interface FCM {
    server_key: string;
    sender_id: string;
}

export interface RabbitMQ {
    host: string;
    port?: number;
    protocol: 'amqp' | 'stomp' | 'amqps';
    user: string;
    password: string;
}

export interface STRIPE{
    secret_key:string
    api_version:string
}

export interface REDIS {
    LivePush: {}
}

export interface AWS {
    s3: AWSCREDS,
    sqs: AWSSQS,
    sns: AWSCREDS,
    ses: AWSCREDS
}

export interface AWSCREDS {
    access_key_id: string;
    secret_access_key: string;
    region: string
}

export interface AWSSQS extends AWSCREDS {
    queues: [
        { name: string, url: string }
    ]
}




export interface DB {
    Mongo: {
        [key: string]: DBConfigMongo
    },
    psql: {},
    solr: {}
}

export interface APIKEYS {

}

export interface TWILIO{
    accountSid:string,
    authToken:string
    apiKey:string
    secretKey:string
}

export interface APPCONFIG {
    ENV: string;
    SMTP: SMTP;
    ENCRYPTION: AESEncryption;
    Logging: Logging;
    FCM: FCM,
    RABBITMQ: RabbitMQ,
    REDIS: REDIS,
    AWS: AWS,
    DB: DB,
    APIKEYS: APIKEYS,
    STRIPE:STRIPE,
    TWILIO:TWILIO
}

