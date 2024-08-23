import axios from "axios"
import { Utils } from "../../../utils/utils"
import { NotificationResponse, NotificationPayload, NotificationTopicPayload, NotificationTopicPayloadCustom } from "./notificationInterface";
import NotificationEndpoints from "../../../utils/enums/notificationEndPoints";
const {JWT} = require('google-auth-library');


export abstract class Notification {

    public static async sendNotification(users: Object[], template_name: string, reference_id: number | string, notification_type: string | number, otp_code: string | number = ''): Promise<NotificationResponse> {

        try {
            const conf: any = await Utils.LoadEnv();

            const notification_payload: NotificationPayload = {
                users,
                template_name,
                data: {
                    ref_id: reference_id,
                    notification_type,
                    otp_code
                },
            };

            try {
                const service_url = conf.NOTIFICATION.FIREBASE.SERVICE_URL + "" + NotificationEndpoints.SEND_NOTIFICATION;

                await axios.post(service_url, notification_payload, {
                    headers: {
                        'x-access-token': conf.NOTIFICATION.FIREBASE.APP_TOKEN,
                        'Content-Type': 'application/json',
                    }
                });


                return {
                    "status": 200,
                    "message": "Notification Sent",
                    "data": {}
                }
            } catch (error: any) {
                console.log(error?.response?.data);
                return {
                    "status": error?.response?.status,
                    "message": "Notification Sending Failed! CAUSE: " + error?.response?.data?.error,
                    "data": {}
                }
            }

        } catch (error: any) {
            console.log(error?.response?.data);
            return {
                "status": error?.response?.status,
                "message": "Notification Sending Failed! CAUSE: " + error?.response?.data?.error,
                "data": {}
            }
        }

    }

    public static async getNotifications(req: any) {

        try {
            console.log(req,"req")
            const conf: any = await Utils.LoadEnv();
            let user_id = req?.auth._id
            let params = req?.query

            try {
                const service_url = conf.NOTIFICATION.FIREBASE.SERVICE_URL + "" + NotificationEndpoints.GET_NOTIFICATION + "?user_id=" + user_id;

                const response = await axios.get(service_url, {
                    params,
                    headers: {
                        'x-access-token': conf.NOTIFICATION.FIREBASE.APP_TOKEN,
                        'Content-Type': 'application/json',
                    }
                });
                console.log(response.data,"response.data")
                if(response.data.data) {
                    return {
                        status_code:  200,
                        body: {
                            status: true,
                            message: "Notification Fetched",
                            data: response.data.data
                        }
                    }
                }
            } catch (error: any) {
                console.log(error?.response?.data);
                return {
                    status_code:  500,
                    body: {
                    status: false,
                    message: "Notification Fetching Failed! CAUSE: " + error?.response?.data?.error,
                    data: []
                   }

                }
            }

        } catch (error: any) {
            console.log(error?.response?.data);
            return {
                status_code:  500,
                body: {
                    status: false,
                    message: "Notification Fetching Failed! CAUSE: " + error?.response?.data?.error,
                    data: []
                }
            }
        }

    }

    public static async Patch(data:any,endPoint:string){
        const conf: any = await Utils.LoadEnv();
        const service_url = conf.NOTIFICATION.FIREBASE.SERVICE_URL + endPoint + "?user_id=" + data.user_id;
        console.log(service_url,'service_url')
        const headers = {
            'x-access-token': conf.NOTIFICATION.FIREBASE.APP_TOKEN,
            'Content-Type': 'application/json',
        }
        try{
            let response = await axios.patch(`${service_url}`, data,{headers})
            console.log(response,'response')
            if(response.data) {
                return {
                    status_code:  200,
                    body: {
                        status: response.data.status,
                        message: response.data.message,
                        data: null
                    }
                }
            }
        }
        catch(error:any){
            console.log(error?.response);
            return {
                status_code:  500,
                body: {
                    status: false,
                    message: "Something went wrong! CAUSE: " + error?.response?.data?.error,
                    data: []
                }
            }
        }
    }

    public static async sendNotificationTopic(topics: Object[], template_name: string, reference_id: number | string, notification_type: string | number): Promise<NotificationResponse> {

        try {
            const conf: any = await Utils.LoadEnv();

            const notification_payload: NotificationTopicPayload = {
                topics,
                template_name,
                data: {
                    ref_id: reference_id,
                    notification_type
                },
            };

            try {
                const service_url = conf.NOTIFICATION.FIREBASE.SERVICE_URL + "" + NotificationEndpoints.SEND_NOTIFICATION;

                await axios.post(service_url, notification_payload, {
                    headers: {
                        'x-access-token': conf.NOTIFICATION.FIREBASE.APP_TOKEN,
                        'Content-Type': 'application/json',
                    }
                });


                return {
                    "status": 200,
                    "message": "Notification Sent",
                    "data": {}
                }
            } catch (error: any) {
                console.log(error?.response?.data);
                return {
                    "status": error?.response?.status,
                    "message": "Notification Sending Failed! CAUSE: " + error?.response?.data?.error,
                    "data": {}
                }
            }

        } catch (error: any) {
            console.log(error?.response?.data);
            return {
                "status": error?.response?.status,
                "message": "Notification Sending Failed! CAUSE: " + error?.response?.data?.error,
                "data": {}
            }
        }

    }

    public static async sendNotificationTopicCustom(notification: NotificationTopicPayloadCustom): Promise<NotificationResponse> {

        try {
            const PROJECT_ID = 'lee-charles';
            const HOST = 'fcm.googleapis.com';
            const PATH = 'https://'+ HOST +'/v1/projects/' + PROJECT_ID + '/messages:send';
            const access_token: any = await this.getAccessToken();


            const data = JSON.stringify({
                "message": {
                    "topic": notification.topic,
                    "notification": {
                        "title": notification.title,
                        "body": notification.body
                    },
                    "data": notification.data,
                    "android": {
                        "notification": {
                            "sound":"default",
                            "click_action": "FLUTTER_NOTIFICATION_CLICK"
                        }
                    },
                    "apns": {
                        "payload": {
                            "aps": {
                                "sound":"default",
                                "category" : "FLUTTER_NOTIFICATION_CLICK"
                            }
                        }
                    }
                }
            })

            try {

              await axios.post(PATH, data, {
                    headers: {
                         Authorization: `Bearer ${access_token}`,
                        'Content-Type': 'application/json',
                    }
                });

                return {
                    "status": 200,
                    "message": "Notification Sent",
                    "data": {}
                }
            } catch (error: any) {
                console.log(error,"err in service");
                return {
                    "status": error?.response?.status,
                    "message": "Notification Sending Failed! CAUSE: " + error?.response?.data?.error,
                    "data": {}
                }
            }

        } catch (error: any) {
            console.log(error,"err in service");
            return {
                "status": error?.response?.status,
                "message": "Notification Sending Failed! CAUSE: " + error?.response?.data?.error,
                "data": {}
            }
        }

    }

    public static async getAccessToken() {
        const key: any = await Utils.Loadfile(`\\assets/lee-charles-235953a34a2a.json`);
        const PROJECT_ID = 'lee-charles';
        const HOST = 'fcm.googleapis.com';
        const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
        const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
        const SCOPES = [MESSAGING_SCOPE];
        return new Promise(function(resolve, reject) {

            const jwtClient = new JWT(
                key.client_email,
                null,
                key.private_key,
                SCOPES,
                null
            );
            jwtClient.authorize(function(err:any, tokens:any) {
                if (err) {
                    reject(err);
                    return;
                }
                console.log(tokens.access_token,"tokens.access_token")
                resolve(tokens.access_token);
            });
        });
    }

}