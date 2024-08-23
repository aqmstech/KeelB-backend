export interface MailResponse {
    status: number;
    message: string;
}


export interface EmailPayload {
    "msg": string,
    "data":{
        "to": string;
        "subject": string;
        "data": Object;
        "projectName": string;
        "templateName": string;
        "from": string;
    }
}



export interface AWSCredentrials {
    accessKeyId: string,
    secretAccessKey: string
}


