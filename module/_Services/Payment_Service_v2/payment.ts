import axios from "axios";
import { Utils } from "../../../utils/utils";
import { AddPaymentMethodBody, Charge, CreatePaymentIntent, Customer, DeletePaymentMethodDetailBody, GetPaymentMethodBody, GetPaymentMethodDetailBody, PaymentResponse } from "./paymentInterface";

export abstract class Payment {

    public static async createCustomer(customer: Customer): Promise<PaymentResponse> {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "customer";
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;


            try {

                const response = await axios.post(service_url, customer, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });

                if(response.data.data.id) {

                    return {
                        "status": 200,
                        "message": "Customer Created",
                        "response": response.data.data
                    }
                } else {
                    return {
                        "status": 403,
                        "message": "Customer Creation Failed!",
                        "response": {}
                    }    
                }

            } catch (error: any) {
                console.log(error?.response?.data);
                return {
                    "status": error?.response?.status,
                    "message": "Customer Creation Failed! CAUSE: " + error?.response?.data?.error,
                    "response": {}
                }
            }

        } catch (error: any) {
            console.log(error?.response?.data);
            return {
                "status": error?.response?.status,
                "message": "Customer Creation Failed! CAUSE: " + error?.response?.data?.error,
                "response": {}
            }
        }
    }

    public static async addPaymentMethod(body: AddPaymentMethodBody): Promise<PaymentResponse> {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "payment-method";
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;


            try {

                const response = await axios.post(service_url, body, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });

                if(response.data.data._id) {

                    return {
                        "status": 200,
                        "message": "Success",
                        "response": response.data.data
                    }
                } else {
                    return {
                        "status": 403,
                        "message": "Failed",
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
            console.log(error?.response?.data);
            return {
                "status": error?.response?.status,
                "message": "Failed! CAUSE: " + error?.response?.data?.error,
                "response": {}
            }
        }
    }

    public static async getPaymentMethod(body: GetPaymentMethodBody): Promise<PaymentResponse> {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "payment-method" + "?user_id=" + body.user_id;
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;


            try {

                const response = await axios.get(service_url, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });

                if(response.data.data) {

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
            console.log(error?.response?.data);
            return {
                "status": error?.response?.status,
                "message": "Failed! CAUSE: " + error?.response?.data?.error,
                "response": {}
            }
        }
    }

    public static async getPaymentMethodDetail(body: GetPaymentMethodDetailBody): Promise<PaymentResponse> {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "payment-method-details" + "?user_id=" + body.user_id + "&pm_id=" + body.pm_id;
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;


            try {

                const response = await axios.get(service_url, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });

                if(response.data.data) {
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
                if(error?.response?.data?.data.id) {

                    return {
                        "status": 200,
                        "message": "Success",
                        "response": error.response.data.data
                    }
                } else {
                    return {
                        "status": error?.response?.status,
                        "message": "Failed! CAUSE: " + error?.response?.data?.error,
                        "response": {}
                    }
                }
            }

        } catch (error: any) {
            console.log(error?.response?.data);
            return {
                "status": error?.response?.status,
                "message": "Failed! CAUSE: " + error?.response?.data?.error,
                "response": {}
            }
        }
    }

    public static async deletePaymentMethod(body: DeletePaymentMethodDetailBody): Promise<PaymentResponse> {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "payment-method" + "/" + body.pm_id;
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;


            try {

                const response = await axios.delete(service_url, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });

                if(response.data.message) {

                    return {
                        "status": 200,
                        "message": response.data.message,
                        "response": {}
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
            console.log(error?.response?.data);
            return {
                "status": error?.response?.status,
                "message": "Failed! CAUSE: " + error?.response?.data?.error,
                "response": {}
            }
        }
    }

    public static async createPaymentIntent(body: CreatePaymentIntent): Promise<PaymentResponse> {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "payment-intent";
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
                        "message": "Payment Intent Created",
                        "response": response.data.data
                    }
                } else {
                    return {
                        "status": 403,
                        "message": "Payment Intent Creation Failed!",
                        "response": {}
                    }    
                }

            } catch (error: any) {
                console.log(error?.response?.data);
                return {
                    "status": error?.response?.status,
                    "message": "Payment Intent Creation Failed! CAUSE: " + error?.response?.data?.error,
                    "response": {}
                }
            }

        } catch (error: any) {
            console.log(error?.response?.data);
            return {
                "status": error?.response?.status,
                "message": "Payment Intent Creation Failed! CAUSE: " + error?.response?.data?.error,
                "response": {}
            }
        }
    }

    public static async Charge(charge: any) {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "charge";
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;

            try {

                const response = await axios.post(service_url, charge, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });

                if(response.data.data.id) {
                    return {
                        "status": true,
                        "message": "Customer Charged",
                        "data": response.data.data
                    }
                } else {
                    return {
                        "status": false,
                        "message": "Customer Charge Failed!",
                        "data": {}
                    }
                }

            } catch (error: any) {
                console.log(error?.response?.data);
                return {
                    "status": error?.response?.status,
                    "message": "Customer Charge Failed! CAUSE: " + error?.response?.data?.error,
                    "data": {}
                }
            }


        } catch (error: any) {
            console.log(error?.response?.data);
            return {
                "status": error?.response?.status,
                "message": "Customer Charge Failed! CAUSE: " + error?.response?.data?.error,
                "data": {}
            }
        }

    }

}