import {Utils} from "../../utils/utils";
import {PaymentService} from "./paymentService";

export class PaymentController {

    public static async proceedPayment(req: any, res: any) {
        try {
            const result :any = await PaymentService.proceedPayment(req);
            return res.status(result.status_code).send(result.body);
        } catch (error) {
            console.log(error, 'getAll');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };

    public static async handleStripeWebhook(req: any, res: any) {
        try {
            const result :any = await PaymentService.handleStripeWebhook(req,res);
            return result;
        } catch (error) {
            console.log(error, 'getAll');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };
}