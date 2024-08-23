export interface NotificationResponse {
    status: number;
    message: string;
    data: object | [];
}


export interface NotificationPayload {
    users: Object[];
    template_name: string;
    data: {
        ref_id: number | string;
        notification_type: string | number;
        otp_code?: string | number;
    };
}

export interface NotificationTopicPayload {
    topics: Object[];
    template_name: string;
    data: {
        ref_id: number | string;
        notification_type: string | number;
    };
}

export interface NotificationTopicPayloadCustom {
    topic: string;
    title: string;
    body: string;
    data: {
        ref_id: number | string;
        type: string | number;
        url: string ;
    };
}