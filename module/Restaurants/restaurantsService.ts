import { RestaurantsModel} from './restaurantsModel';
import {BaseService} from "../../services/api/baseService";
import {DEFAULT_ORDER, PAGE, PER_PAGE} from "../../utils/constants";
import {Utils} from "../../utils/utils";
import {ObjectId} from "mongodb";
import RestaurantStatus from "../../utils/enums/restaurantStatus";
import {Mail} from "../_Services/Email_Service/mail";
import MailTemplates from "../../utils/enums/mailTemplates";
import {AuthModel} from "../_Auth/authModel";

export class RestaurantsService extends BaseService {
    private authModel: AuthModel
    constructor() {
        const restaurantsModel = new RestaurantsModel();
        const authModel = new AuthModel();
        super( restaurantsModel);
        this.authModel = authModel
    }

    protected async getAll(order = DEFAULT_ORDER, param: any = {}, filter = {},user_id = null) {
        try {
            const page = param.page ? parseInt(param.page) : PAGE
            const perPage = param.per_page ? parseInt(param.per_page) : PER_PAGE
            const withoutPagination = param.withoutPagination ? true : false
            const records: [] = await this.model.List(filter, order, page, perPage, withoutPagination,user_id);
            return Utils.getResponse(true, "Record fetched successfully", records, 200, 1000);
        } catch (error) {
            return Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
        }
    }

    protected async getRestaurantById(id: object,user_id:object) {
        try {
            const record: any = await this.model.GetById(id,user_id);
            if (!record) {
                return Utils.getResponse(false, "Record not found", null, 404, 1004);
            }

            return Utils.getResponse(true, "Record fetched successfully", record, 200, 1000);

        } catch (error) {
            return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
        }
    }

    protected async updateStatus(req: any, res: any) {
        try {
            const id = new ObjectId(req.params.id);
            const data = req.body;

            const exist = await this.model.GetById(id);
            if (!exist) {
                return Utils.getResponse(false, "Record not found", null, 404, 1004);
            }

            const user = await this.authModel.findByQuery({_id:new ObjectId(exist?.user_id)})
            if(user){
                if( req.body.isVerified === RestaurantStatus.ACCEPTED){
                    await Mail.sendSMTPEmail(
                        user.email,
                        "Your Restaurant Submission Status",
                        { status: req.body.isVerified ,
                            reason: req.body.reason ,
                            user: user?.fullName || 'User'},
                        MailTemplates.RESTAURANT_REQUEST_UPDATE,
                        "SendMessage"
                    );
                }else if(req.body.isVerified === RestaurantStatus.REJECTED){
                    await Mail.sendSMTPEmail(
                        user.email,
                        "Your Restaurant Submission Status",
                        { status: req.body.isVerified ,
                            reason: req.body.reason ,
                            user: user?.fullName || 'User'},
                        MailTemplates.RESTAURANT_REQUEST_UPDATE,
                        "SendMessage"
                    );
                }

            }

            await this.model.Update(id, data);
            const record: any = await this.model.GetById(id);

            return Utils.getResponse(true, "Record updated successfully", record, 200, 1002);

        } catch (error) {
            return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
        }
    }

}