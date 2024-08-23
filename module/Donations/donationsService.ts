import { DonationsModel} from './donationsModel';
import {BaseService} from "../../services/api/baseService";
import {Utils} from "../../utils/utils";
import {PaymentService} from "../Payments/paymentService";
import PaymentStatus from "../../utils/enums/paymentStatus";
import { ObjectId } from 'mongodb';
import {APPLE, DEFAULT_ORDER, GOOGLE, PAGE, PER_PAGE} from "../../utils/constants";
import {Mail} from "../_Services/Email_Service/mail";
import PaymentMethodTypes from "../../utils/enums/PaymentMethodTypesEnum";

export class DonationsService extends BaseService {
    constructor() {
        const donationsModel = new DonationsModel();
        super( donationsModel);
    }

    protected async create(req: any = {}) {
        try {
            let data = req.body
            let donation_number:string = await Utils.generateUniqueFiveDigitNumber()
            req.body.donation_number= donation_number
            data.donation_number = donation_number
            data.status = PaymentStatus.PENDING
            data.user_id = new ObjectId(req.auth._id);
            data.email = req.auth.email;
            data['createdAt'] = new Date().toString();
            const sanitizeData = this.model.sanitize(data)
            console.log(sanitizeData,"sanitizeData")
            const inserteedId = await this.model.Add(sanitizeData)
            let donation: any = await this.model.GetById(inserteedId);
            req.body.donation_id = inserteedId
            const payment: any = await PaymentService.proceedPayment(req);
            const payment_intent = payment.payment_intent
            const meta_data = payment.meta_data
            if (payment.status === true && payment.data === "success") {
                if (payment.payment_intent.next_action === true) {

                    return Utils.getResponse(true, "3D Secure authentication required.", {
                        ...donation,
                        payment_intent,
                        meta_data
                    }, 200);
                }
                await this.model.Update(
                    inserteedId,
                    {status: PaymentStatus.PAID}
                );
                donation = await this.model.GetById(inserteedId);
                let logo;

                if(data.payment_method_type == PaymentMethodTypes.GOOGLE){
                    logo =  GOOGLE
                }else if(data.payment_method_type == PaymentMethodTypes.APPLE){
                    logo =  APPLE
                }else{
                    logo =  ''
                }
                let date = await Utils.getCurrentDateUSFormat()

                await Mail.sendEmail(
                    data.email,
                    "Donation Receipt",
                    {  donation_id:  data.donation_number ,
                        date: date  ,
                        name: data?.donor_name ,
                        description: data?.purpose ,
                        amount:  data?.amount ,
                        total_amount: data?.amount ,
                        image: logo  },
                    "donation_account_template",
                    "SendMessage"
                );

                // await Mail.sendEmail(
                //     data.email,
                //     "Donation Receipt",
                //     {
                //
                //     },
                //     "donation_template",
                //     "SendMessage"
                // );

                return Utils.getResponse(true, "Donation processed successfully.", {
                    ...donation,
                    payment_intent,
                    meta_data
                }, 200);
            }

            await this.model.Update(
                inserteedId,
                {status: PaymentStatus.FAILED}
            );
            donation = await this.model.GetById(inserteedId);
            if(typeof payment?.data == "string"){
                return Utils.getResponse(false, `Payment has been failed: ${payment?.data}`, {...donation,payment_intent,meta_data}, 422);
            }

            return Utils.getResponse(
                false,
                `Payment failed. Try again later`,
                {...donation,payment_intent,meta_data}  || null,
                422
            );
        } catch (error) {
            console.log(error, 'error in service add')
            return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
        }
    };

    protected async getAll(order = DEFAULT_ORDER, param: any = {}, filter = {}) {
        try {
            const page = param.page ? parseInt(param.page) : PAGE
            const perPage = param.per_page ? parseInt(param.per_page) : PER_PAGE
            const withoutPagination = param.withoutPagination ? true : false
            const records: [] = await this.model.List(filter, order, page, perPage, withoutPagination);
            return Utils.getResponse(true, "Record fetched successfully", records, 200, 1000);
        } catch (error) {
            return Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
        }
    }
}