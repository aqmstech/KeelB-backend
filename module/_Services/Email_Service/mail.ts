import { Utils } from "../../../utils/utils";
import aws4 from 'aws4'
import axios from 'axios'
import { EmailPayload, MailResponse, AWSCredentrials } from "./mailInterface";





export abstract class Mail {

    public static async sendEmail(recipient: string, subject: string, data: Object, template_name: string, action_type: string): Promise<MailResponse> {

        try {
            const conf: any = await Utils.LoadEnv();
            const { SMTP_ENDPOINT, SMTP_ACCESS_KEY, SMTP_SECRET_KEY, SMTP_PROJECT_NAME, SMTP_SENDER_EMAIL, SMTP_MESSAGE } = conf.SMTP.MAIL_SERVICE;

            const emailPayload: EmailPayload = {
                "msg": SMTP_MESSAGE,
                "data": {
                    "to": recipient,
                    "subject": subject,
                    "data": data,
                    "projectName": SMTP_PROJECT_NAME,
                    "templateName": template_name,
                    "from": SMTP_SENDER_EMAIL,
                },
            };

            const formData = new URLSearchParams();
            formData.append('Action', action_type);
            formData.append('MessageBody', JSON.stringify(emailPayload));

            const awsHeaders = {
                host: new URL(SMTP_ENDPOINT).host,
                'content-type': 'application/x-www-form-urlencoded',
            };

            const awsCredentials: AWSCredentrials = {
                accessKeyId: SMTP_ACCESS_KEY,
                secretAccessKey: SMTP_SECRET_KEY,
            };

            const signedRequest = aws4.sign(
                {
                    host: awsHeaders.host,
                    path: new URL(SMTP_ENDPOINT).pathname,
                    method: 'POST',
                    headers: awsHeaders,
                    body: formData.toString(),
                },
                awsCredentials
            );

            try {

                let response =  await axios.post(SMTP_ENDPOINT, formData, {
                    headers: signedRequest.headers,
                });


                return {
                    "status": 200,
                    "message": "Email Sent"
                };

            } catch (error: any) {
                console.log(error?.response?.data);
                return {
                    "status": error?.response?.status,
                    "message": "Email Sending Failed! CAUSE: " + error?.response?.data?.error
                }
            }

        } catch (error: any) {
            console.log(error?.response?.data);
            return {
                "status": error?.response?.status,
                "message": "Email Sending Failed! CAUSE: " + error?.response?.data?.error
            }
        }
    }

}