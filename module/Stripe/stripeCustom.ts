import {Utils} from "../../utils/utils";

const StripeSdk = require('stripe');


class StripeService {


    async addCustomer(email: string) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        const customer = await stripe.customers.create( email );
        return customer;
    }

    async addCard(customer_id: string, payment_method: string) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        const paymentMethod = await stripe.paymentMethods.attach(payment_method, { customer: customer_id });
        return paymentMethod;
    }

    async removeCard(payment_method: string) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        const paymentMethod = await stripe.paymentMethods.detach(payment_method);
        return paymentMethod;
    }

    async getPaymentMethodInfo(payment_method: string) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        const paymentMethod = await stripe.paymentMethods.retrieve(payment_method);
        return paymentMethod;
    }

    async createPaymentMethod(customer_id: string, payment_method: string) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {token: "tok_visa"}
        });
        return paymentMethod;
    }


    async chargeCard(customer_id: string, payment_method_id: string, amount: number) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method: payment_method_id,
            customer: customer_id
        });
        return await stripe.paymentIntents.confirm(paymentIntent.id, { payment_method: payment_method_id });
    }

    async paymentIntent(connect_account_id: string, amount: number, application_fee_amount: number, customerId: string) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        return await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            customer: customerId,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
            application_fee_amount: Math.round(application_fee_amount * 100),
            transfer_data: {
                destination: connect_account_id,
            },
            confirm: false,
        });
    }

    async createPaymentIntent(customer_id: string, payment_method_id: string, amount: number) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        return await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method: payment_method_id,
            customer: customer_id
        });
    }

    async createCustomIntent(data: object) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        return await stripe.paymentIntents.create(data);
    }

    async removeConnectAccount(account_id: string) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        const deleted = await stripe.accounts.del(account_id);
        return deleted;
    }

    async confirmPaymentIntent(payment_intent: string, payment_method_id: string) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        return await stripe.paymentIntents.confirm(payment_intent, { payment_method: payment_method_id });
    }

    async chargeThroughConnectedAccount(connected_account_id: string, amount: number) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        return await stripe.charges.create({
            amount: Math.round(amount * 100),
            currency: "usd",
            source: connected_account_id
        });
    }

    async generateEphemeralKey(customerId: string) {
        const conf: any = await Utils.LoadEnv();
        const apiVersion = conf.STRIPE.API_VERSION;
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: apiVersion})

        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customerId },
            { apiVersion }
        );
        return ephemeralKey;
    }

    async createAccountLink(user_id: string, country: string) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        const account = await stripe.accounts.create({ type: 'express', country });

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${process.env.ADMIN_URL}/return-connect-account-failure?user_id=${user_id}`,
            return_url: `${process.env.ADMIN_URL}/return-connect-account?user_id=${user_id}&account_id=${account.id}`,
            type: 'account_onboarding',
        });
        return { account, account_link: accountLink };
    }

    async getAccountInfo(account_id: string) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        const account = await stripe.accounts.retrieve(account_id);
        return account;
    }

    async payout(amount: number, connect_account_id: string) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        const transfer = await stripe.transfers.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            destination: connect_account_id
        });
        return transfer;
    }

     async attachPaymentMethodCustomer(pm_id:string,customer_id:string){
         const conf: any = await Utils.LoadEnv();
         const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        return await stripe.paymentMethods.attach(pm_id, {
            customer: customer_id,
        });
    }

    async refund(amount: number, payment_intent: string) {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        const refund = await stripe.refunds.create({
            amount: Math.round(amount * 100),
            payment_intent,
        });
        return refund;
    }

    async getBalance() {
        const conf: any = await Utils.LoadEnv();
        const stripe: any = new StripeSdk(conf.STRIPE.SECRET_KEY, { apiVersion: conf.STRIPE.API_VERSION })
        return await stripe.balance.retrieve();
    }
}

module.exports = new StripeService();
