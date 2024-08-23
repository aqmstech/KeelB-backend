import { UserCardsModel} from './usercardsModel';
import {BaseService} from "../../services/api/baseService";
import {DEFAULT_ORDER, PAGE, PER_PAGE} from "../../utils/constants";
import {Utils} from "../../utils/utils";
import { ObjectId } from 'mongodb';
import {AuthModel} from "../_Auth/authModel";
import {UserdevicesModel} from "../_Userdevices/userdevicesModel";
const stripeCustom = require("../Stripe/stripeCustom");

export class UserCardsService extends BaseService {
    private authModel: AuthModel
    constructor() {
        const usercardsModel = new UserCardsModel();
        super( usercardsModel);
        this.authModel = new AuthModel()
    }

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

    protected async create(req: any = {}) {
        try {
            let data = req.body
            data['createdAt'] = new Date().toString();
            const sanitizeData = this.model.sanitize(data)
            sanitizeData.user_id = new ObjectId(req.auth._id)
            let user = await this.authModel.GetOne({_id:new ObjectId(req.auth._id),deletedAt:null})
            let customer_id = user?.additionalFields?.stripe_customer_id

            if(customer_id == null){
                const stripe_customer: any = await stripeCustom.addCustomer({
                    email: user.email,
                });

                if (stripe_customer.id) {
                    this.authModel.Update(new ObjectId(req.auth._id),{'additionalFields.stripe_customer_id':stripe_customer.id})
                    customer_id = stripe_customer.id;
                }

            }
             let pm_exist = await this.model.GetOne({pm_id:data.pm_id,deletedAt:null})
            if(pm_exist){
                return Utils.getResponse(false, "Card already exists with this user", null, 400, 1001);
            }

            let payment_method = await stripeCustom.attachPaymentMethodCustomer(data.pm_id,customer_id);
            // let payment_method =  await stripeCustom.getPaymentMethodInfo(dummy_pm?.id);
            sanitizeData.payment_method = payment_method
            sanitizeData.pm_id = payment_method?.id || data.pm_id
            const inserteedId = await this.model.Add(sanitizeData)
            let record: any = await this.model.GetById(inserteedId);


            return Utils.getResponse(true, "Record has been added successfully", record, 200, 1001);
        } catch (error) {
            console.log(error, 'error in service add')
            return Utils.getResponse(false, `Something went wrong : ${error?.raw?.message}`, null, 500, 1005);
        }
    };

    protected async delete(id: object) {
        try {
            const record = await this.model.GetById(id);
            if (!record) {
                return Utils.getResponse(false, "Record not found", null, 404, 1004);
            }
            await stripeCustom.removeCard(record.pm_id);
            await this.model.Delete(id);
            return Utils.getResponse(true, "Record deleted successfully", null, 200, 1003);

        } catch (error) {
            console.log(error,"error")
            return Utils.getResponse(false, `Something went wrong : ${error?.raw?.message}`, null, 500, 1005);
        }
    }
}