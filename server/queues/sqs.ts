
import { SQSClient, SQSClientConfig, SendMessageBatchCommand, SendMessageCommand } from "@aws-sdk/client-sqs";
import { AWSCREDS, AWSSQS } from "../../interfaces/appconfig";



export class SQS {

    public static Queues: { [key: string]: SQS };

    private broker: SQSClient;
    private queueName: string;
    private queueURL: string;

    constructor(creds: AWSCREDS, queueName: string, queueURL: string) {

        this.broker = new SQSClient({
            region: creds.region, credentials: {
                accessKeyId: creds.access_key_id,
                secretAccessKey: creds.secret_access_key
            }
        });
        this.queueName = queueName;
        this.queueURL = queueURL;

        SQS.Queues[this.queueName] = this;

    }

    public static GetQueueNames(){
        return Object.keys(this.Queues);
    }


    public async Publish(data: any) {

        try {

            let command = new SendMessageCommand({
                MessageBody: JSON.stringify(data),
                QueueUrl: this.queueURL
            });
            let result = await this.broker.send(command)

        } catch (error: any) {
            console.log(error);
            console.log(`Error in publishing to SQS : QUEUENAME IS ${this.queueName}`);
            throw error;
        }

    }

}