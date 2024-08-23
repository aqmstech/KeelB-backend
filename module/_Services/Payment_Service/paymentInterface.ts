export interface PaymentResponse {
    status: number;
    message: string;
}

export interface Customer {
    email:string
}


export interface Charge{
    "payment_intent_id" : string,
    "payment_method_id" : string
}