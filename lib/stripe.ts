const stripe = require('stripe')('')

export abstract class StripeLibrary{


    public static async CreatePaymentIntent(){

        console.log(stripe)

    }

    public static async AddCustomer(email:string) {
        const customer = await stripe.customers.create({
          email: email
        });
        return customer;
    }

}