import { ObjectId } from "mongodb";
import PaymentMethodTypes from "../../utils/enums/PaymentMethodTypesEnum";
import PaymentStatus from "../../utils/enums/paymentStatus";
import { Utils } from "../../utils/utils";
import { AuthModel } from "../_Auth/authModel";
import {Payment} from "../_Services/Payment_Service_v2/payment";
import {APPLE, GOOGLE} from "../../utils/constants";
import {Mail} from "../_Services/Email_Service/mail";
const StripeSdk = require('stripe');
const stripeCustom = require("../Stripe/stripeCustom");
export class PaymentService {
    private static authModel: AuthModel = new AuthModel();
    // private static donationModel: DonationsModel = new DonationsModel();

    public static async proceedPayment(req: any){
        let {
            donor_name,
            purpose,
            amount,
            payment_method,
            payment_method_type,
            donation_number,
            donation_id
        } = req.body;
        let user_id = req.auth._id

        let user = await this.authModel.GetOne({_id:new ObjectId(req.auth._id)})

        let customer_id = user.additionalFields.stripe_customer_id
        let payment_intent: any;
        let charge: any;
        let response: any = {
            status: true,
            data: null,
            meta_data: {
                user_id: user_id,
                donation_number: donation_number,
                donation_id: donation_id,
                amount: Math.round(amount * 100),
                customer_id: customer_id,
            },
            payment_intent: {
                payment_intent_id: null,
                emp_key: null,
                next_action: false,
                client_secret: null,
                redirect_to_url: null
            }
        }

        if (payment_method_type === PaymentMethodTypes.STRIPE) {
            payment_intent = await this.createPaymentIntent(
                amount,
                donation_number,
                customer_id,
                payment_method,
                payment_method_type,
                user_id,
                donation_id,
            );

            if (payment_intent.status === false && payment_intent.data.next_action === false) {
                response.payment_intent = payment_intent.data
                response.data = payment_intent?.message
                return response;
            }else if(payment_intent.status === true && payment_intent.data.next_action === true){
                response.payment_intent = payment_intent.data
                response.data = "success"
                return response;
            }

         charge = payment_intent
        } else {
            let data = {
                token_id: payment_method,
                amount: Math.round(amount * 100),
            };

            charge = await Payment.Charge(data);

        }

        if (charge.status === true) {
            charge.data = "success";
        } else {
            charge.status = false;
            charge.data = charge.data.response?.data?.error;
        }


        response.status = charge.status
        response.data = charge.data
        return response;

    }

    public static async createPaymentIntent(
        amount: number,
        order_id: string,
        customer_id: string,
        card_id:string,
        type:string,
        user:string,
        donation_id:any
    ) {
        const conf: any = await Utils.LoadEnv();
        // const stripe_key = "sk_test_51MBy9xFfelZEUdQKmWNIamqxYvjavkH31PKyU65nNspBexGwo3E0yT7rWhczSsDR47RE8oGK8pZ5azhy5j1sd1Wq00F6g0bUlv"
        // const stripesd = new StripeSdk(conf.STRIP.secret_key, { apiVersion: conf.STRIP.api_version });
        const apiUrl = conf.PAYMENT.STRIPE_SERVICE.URL + "payment-intent";
        let data = JSON.stringify({
            amount: Math.round(amount * 100),
            meta_data: {
                user_id: user,
                donation_number: order_id,
                donation_id: donation_id,
                amount: Math.round(amount * 100),
                customer_id: customer_id,
            },
            customer_id: customer_id,
        });

        let config: any = {
            method: "post",
            maxBodyLength: Infinity,
            url: apiUrl,
            headers: {
                "Content-Type": "application/json",
                "x-access-token": conf.PAYMENT.STRIPE_SERVICE.PAYMENT_APP_TOKEN,
            },
            data: data,
        };


        /*Payment Intent*/

        const paymentIntent = await stripeCustom.createCustomIntent({
            amount:  Math.round(amount * 100),
            currency:'usd',
            payment_method_types: ['card'],
            description: null || 'Payment Intent with capture',
            metadata:{
                user_id: user,
                donation_number: order_id,
                donation_id: donation_id,
                amount: Math.round(amount * 100),
                customer_id: customer_id,
            },
            confirm:true,
            customer:customer_id,
            payment_method:card_id,
            return_url: 'https://example.com',
        });

        const {id} = paymentIntent;
        let emp_key = null;

        if(paymentIntent.status === 'succeeded'){
            return {
                status: true,
                message: paymentIntent?.description,
                data: {
                    payment_intent_id: id,
                    emp_key: null,
                    next_action: false,
                    client_secret: paymentIntent?.client_secret,
                    redirect_to_url: paymentIntent?.next_action?.redirect_to_url?.url
                } }
        }else if(paymentIntent.status === 'requires_action'){
            emp_key = await stripeCustom.generateEphemeralKey(customer_id)
            return {
                status: true,
                message: paymentIntent?.description,
                data: {
                    payment_intent_id: id,
                    emp_key: emp_key?.id,
                    next_action: true,
                    client_secret: paymentIntent?.client_secret,
                    redirect_to_url: paymentIntent?.next_action.redirect_to_url.url
                }
            }
        }else{
            return { status: false,
                message: paymentIntent?.description,
                data: {
                    payment_intent_id: id,
                    emp_key: null,
                    next_action: false,
                    client_secret: paymentIntent?.client_secret,
                    redirect_to_url: paymentIntent?.next_action.redirect_to_url.url} }
        }

    }

    public static async handleStripeWebhook(req: any, res: any) {
        try {

            const payload = req.body;
            console.log("Payload From Stripe ==>", payload)

            if (typeof payload == 'object' && (payload.type === 'payment_intent.succeeded' || payload.type === 'charge.succeeded')) {
                let body = payload?.data?.object?.metadata
                body.payment_status = PaymentStatus.PAID
                if (body) {
                    let user_id = body.user_id
                    let user = await this.authModel.GetOne({_id:new ObjectId(user_id)})
                    if (user) {
                        if (body.donation_id) {
                            // let donation: any = await this.donationModel.GetOne({_id:new ObjectId(body.donation_id)});
                            //
                            // if (!donation) {
                            //     return Utils.getResponse(false, "Donation Id is not valid", null, 404);
                            // }


                            // if (body.payment_status == PaymentStatus.PAID) {
                            //     // await this.donationModel.Update(
                            //     //     new ObjectId(body.donation_id),
                            //     //     {status: PaymentStatus.PAID}
                            //     // );
                            //
                            //
                            //     let logo;
                            //     if(donation?.payment_method_type == PaymentMethodTypes.GOOGLE){
                            //         logo =  GOOGLE
                            //     }else if(donation?.payment_method_type == PaymentMethodTypes.GOOGLE){
                            //         logo =  APPLE
                            //     }else{
                            //         logo =  ''
                            //     }
                            //
                            //     await Mail.sendSMTPEmail(
                            //         donation?.email,
                            //         "Donation Receipt",
                            //         {
                            //             donation_id:  donation?.donation_id ,
                            //             date: Utils.getCurrentDateUSFormat() ,
                            //             name: donation?.donor_name ,
                            //             description: donation?.purpose ,
                            //             amount:  donation?.amount ,
                            //             total_amount: donation?.amount ,
                            //             image: logo ,
                            //         },
                            //         "donation_template",
                            //         "SendMessage"
                            //     );
                            //
                            //         // const fcm_data: any = {
                            //         //     sender_id: user._id,
                            //         //     receiver_id: trainer._id,
                            //         //     module: "appointment_request",
                            //         //     module_id: appointment?._id,
                            //         //     title: "Libido Health",
                            //         //     body: `New appointment request from client. Review and respond.`,
                            //         // };
                            //         // await PushNotification.send(fcm_data);
                            //
                            //
                            //
                            // } else if (body.payment_status == PaymentStatus.FAILED) {
                            //     // let donation_id = await this.donationModel.Update(
                            //     //     new ObjectId(body.donation_id),
                            //     //     {status: PaymentStatus.PAID}
                            //     // );
                            //
                            //     // const fcm_data: any = {
                            //     //     sender_id: user._id,
                            //     //     receiver_id: user._id,
                            //     //     module: "appointment_request",
                            //     //     module_id: appointment_id,
                            //     //     title: "Libido Health",
                            //     //     body: `Payment failed. Try again later.`,
                            //     // };
                            //     // await PushNotification.send(fcm_data);
                            // }

                        }

                    }

                }

                let transaction_data = {
                    user_id: new ObjectId(body?.user),
                    module_id: new ObjectId(body?.order_id),
                    transaction_id: payload?.id,
                    module_type: body?.type,
                    status: "succeeded",
                    price: parseInt(payload?.data?.object?.amount || 0) / 100,
                    payload: payload,
                    transaction_type: payload?.data?.object?.payment_method_types,
                    reason: payload?.description,
                }
                // await StripeWebhookModel.Add(transaction_data)
            } else if (typeof payload == 'object' && (payload.type === 'payment_intent.payment_failed' || payload.type === 'charge.failed')) {

                let body = payload?.data?.object?.metadata
                body.payment_status = PaymentStatus.FAILED
                if (body) {
                    // let user_id = body.user_id
                    // let user = await this.authModel.GetOne({_id:new ObjectId(user_id)})
                    // if (user) {
                    //     if (body.donation_id) {
                    //         let donation: any = await this.donationModel.GetOne({_id:new ObjectId(body.donation_id)});
                    //
                    //         if (!donation) {
                    //             return Utils.getResponse(false, "Donation Id is not valid", null, 404);
                    //         }
                    //
                    //         if (body.payment_status == PaymentStatus.FAILED) {
                    //             await this.donationModel.Update(
                    //                 new ObjectId(body.donation_id),
                    //                 {status: PaymentStatus.FAILED}
                    //             );
                    //
                    //             // const fcm_data: any = {
                    //             //     sender_id: user._id,
                    //             //     receiver_id: trainer._id,
                    //             //     module: "appointment_request",
                    //             //     module_id: appointment?._id,
                    //             //     title: "Libido Health",
                    //             //     body: `New appointment request from client. Review and respond.`,
                    //             // };
                    //             // await PushNotification.send(fcm_data);
                    //
                    //
                    //         }
                    //
                    //     }
                    //
                    //
                    //
                    // }
                }
                // let transaction_data = {
                //     user_id: new ObjectId(body?.user),
                //     module_id: new ObjectId(body?.order_id),
                //     transaction_id: payload?.id,
                //     module_type: body?.type,
                //     status: 'failed',
                //     price: parseInt(payload?.data?.object?.amount || 0) / 100,
                //     payload: payload,
                //     transaction_type: payload?.data?.object?.payment_method_types,
                //     reason: payload?.data?.object?.last_payment_error?.message || payload?.data?.object?.description,
                // }
                // await StripeWebhookModel.Add(transaction_data)
            }

            return res.status(200).send({success: true});
        } catch (error: any) {
            console.error('Failed to process webhook:', error);
            return res.status(500).send({success: false, error: error.message});
        }
    }
}