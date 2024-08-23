import axios from "axios";
import { Utils } from "../../../utils/utils";
import { AddPrice, AddSubscription, CancelSubscription, DeactivatePrice, GetPrice, PaymentResponse, UpdateSubscription } from "./paymentInterface";

export abstract class Subscription {

    public static async addPrice(body: AddPrice): Promise<PaymentResponse> {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "subscriptions/price";
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;


            try {

                const response = await axios.post(service_url, body, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });

                if(response.data.data.id) {

                    return {
                        "status": 200,
                        "message": "Price Created",
                        "response": response.data.data
                    }
                } else {
                    return {
                        "status": 403,
                        "message": "Price Creation Failed!",
                        "response": {}
                    }    
                }

            } catch (error: any) {
                return {
                    "status": error?.response?.status,
                    "message": "Price Creation Failed! CAUSE: " + error?.response?.data?.error,
                    "response": {}
                }
            }

        } catch (error: any) {
            return {
                "status": error?.response?.status,
                "message": "Price Creation Failed! CAUSE: " + error?.response?.data?.error,
                "response": {}
            }
        }
    }

    public static async getPrice(body: GetPrice): Promise<PaymentResponse> {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "subscriptions/price/" + body.price_id;
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;


            try {
                const response = await axios.get(service_url, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });
                console.log(response);

                if(response.data.data.id) {

                    return {
                        "status": 200,
                        "message": "Success",
                        "response": response.data.data
                    }
                } else {
                    return {
                        "status": 403,
                        "message": "Failed!",
                        "response": {}
                    }    
                }

            } catch (error: any) {
                return {
                    "status": error?.response?.status,
                    "message": "Failed! CAUSE: " + error?.response?.data?.error,
                    "response": {}
                }
            }

        } catch (error: any) {
            return {
                "status": error?.response?.status,
                "message": "Failed! CAUSE: " + error?.response?.data?.error,
                "response": {}
            }
        }
    }

    public static async deactivatePrice(body: DeactivatePrice): Promise<PaymentResponse> {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "subscriptions/price/" + body.price_id;
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;


            try {
                const response = await axios.delete(service_url, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });

                if(response.data.id) {

                    return {
                        "status": 200,
                        "message": "Success",
                        "response": response.data
                    }
                } else {
                    return {
                        "status": 403,
                        "message": "Failed!",
                        "response": {}
                    }    
                }

            } catch (error: any) {
                return {
                    "status": error?.response?.status,
                    "message": "Failed! CAUSE: " + error?.response?.data?.error,
                    "response": {}
                }
            }

        } catch (error: any) {
            return {
                "status": error?.response?.status,
                "message": "Failed! CAUSE: " + error?.response?.data?.error,
                "response": {}
            }
        }
    }

    public static async addSubscription(body: AddSubscription): Promise<PaymentResponse> {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "subscriptions";
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;


            try {
                const response = await axios.post(service_url, body, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });

                if(response.data.data.id) {

                    return {
                        "status": 200,
                        "message": "Subscription Created",
                        "response": response.data.data
                    }
                } else {
                    return {
                        "status": 403,
                        "message": "Subscription Creation Failed!",
                        "response": {}
                    }    
                }

            } catch (error: any) {
                return {
                    "status": error?.response?.status,
                    "message": "Subscription Creation Failed! CAUSE: " + error?.response?.data?.error,
                    "response": {}
                }
            }

        } catch (error: any) {
            return {
                "status": error?.response?.status,
                "message": "Subscription Creation Failed! CAUSE: " + error?.response?.data?.error,
                "response": {}
            }
        }
    }

    public static async updateSubscription(body: UpdateSubscription): Promise<PaymentResponse> {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "subscriptions";
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;


            try {
                const response = await axios.patch(service_url, body, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });

                if(response.data.data.id) {

                    return {
                        "status": 200,
                        "message": "Subscription Updated",
                        "response": response.data.data
                    }
                } else {
                    return {
                        "status": 403,
                        "message": "Updating Subscription Failed!",
                        "response": {}
                    }    
                }

            } catch (error: any) {
                return {
                    "status": error?.response?.status,
                    "message": "Updating Subscription Failed! CAUSE: " + error?.response?.data?.error,
                    "response": {}
                }
            }

        } catch (error: any) {
            return {
                "status": error?.response?.status,
                "message": "Updating Subscription Failed! CAUSE: " + error?.response?.data?.error,
                "response": {}
            }
        }
    }

    public static async cancelSubscription(body: CancelSubscription): Promise<PaymentResponse> {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "subscriptions/" + body.subscription_id;
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;


            try {
                const response = await axios.delete(service_url, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });

                if(response.data.data.subscription.id) {

                    return {
                        "status": 200,
                        "message": "Subscription Deleted",
                        "response": response.data.data
                    }
                } else {
                    return {
                        "status": 403,
                        "message": "Deleting Subscription Failed!",
                        "response": {}
                    }    
                }

            } catch (error: any) {
                return {
                    "status": error?.response?.status,
                    "message": "Deleting Subscription Failed! CAUSE: " + error?.response?.data?.error,
                    "response": {}
                }
            }

        } catch (error: any) {
            return {
                "status": error?.response?.status,
                "message": "Deleting Subscription Failed! CAUSE: " + error?.response?.data?.error,
                "response": {}
            }
        }
    }

}