import axios from "axios";
import { Utils } from "../../../utils/utils";
import { Charge, Customer, PaymentResponse } from "./paymentInterface";

export abstract class Payment {

    public static async createCustomer(customer: Customer, payment_endpoint: string): Promise<PaymentResponse> {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "" + payment_endpoint;
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;


            try {

                const response = await axios.post(service_url, customer, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });

                console.log(response);

                return {
                    "status": 200,
                    "message": "Customer Created"
                }

            } catch (error: any) {
                console.log(error?.response?.data);
                return {
                    "status": error?.response?.status,
                    "message": "Customer Creation Failed! CAUSE: " + error?.response?.data?.error
                }
            }

        } catch (error: any) {
            console.log(error?.response?.data);
            return {
                "status": error?.response?.status,
                "message": "Customer Creation Failed! CAUSE: " + error?.response?.data?.error
            }
        }
    }

    public static async Charge(charge: Charge, payment_endpoint: string) {

        try {

            const conf: any = await Utils.LoadEnv();
            const service_url = conf.PAYMENT.STRIPE_SERVICE.URL + "" + payment_endpoint;
            const app_token = conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN;

            try {

                const response = await axios.post(service_url, charge, {
                    headers: {
                        'x-access-token': app_token,
                        'Content-Type': 'application/json',
                    }
                });

                console.log(response);

                return {
                    "status": 200,
                    "message": "Customer Charged"
                }

            } catch (error: any) {
                console.log(error?.response?.data);
                return {
                    "status": error?.response?.status,
                    "message": "Customer Charge Failed! CAUSE: " + error?.response?.data?.error
                }
            }


        } catch (error: any) {
            console.log(error?.response?.data);
            return {
                "status": error?.response?.status,
                "message": "Customer Charge Failed! CAUSE: " + error?.response?.data?.error
            }
        }

    }

}