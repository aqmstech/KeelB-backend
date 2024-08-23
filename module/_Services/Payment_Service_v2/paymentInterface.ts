export interface PaymentResponse {
    status: number;
    message: string;
    response: object
}

export interface Customer {
    email:string
}

export interface AddPaymentMethodBody {
    type:string;
    card: {
        token: string;
    };
    user_id:string;
    customer_id:string;
}

export interface GetPaymentMethodBody {
    user_id:string;
}

export interface GetPaymentMethodDetailBody {
    user_id:string;
    pm_id:string;
}

export interface DeletePaymentMethodDetailBody {
    pm_id:string;
}


export interface Charge{
    "payment_intent_id" : string,
    "payment_method_id" : string
}

export interface CreatePaymentIntent{
    amount: number;
    meta_data: {
        order_id: string;
    };
    description: string;
    customer_id: string;
}

export interface AddPrice {
    amount: number;
    recurring: {
        interval: string;
        interval_count: number;
    };
    product_name: string;
    metadata: {
        product: string;
        image_url: string;
    };
}

export interface GetPrice {
    price_id: string;
}

export interface DeactivatePrice {
    price_id: string;
}

export interface AddSubscription {
    "customer_id": string;
    "price_id": string;
    "payment_method": string;
}

export interface UpdateSubscription {
    "subscription_id": string;
    "price_id": string;
}

export interface CancelSubscription {
    "subscription_id": string;
}