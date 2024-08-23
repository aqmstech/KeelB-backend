import {BaseController} from "../../controllers/api/baseController";
import { VideosService} from "./videosService";
import UserRoles from "../../utils/enums/userRoles";
import {ObjectId} from "mongodb";
import {DEFAULT_ORDER, DESC} from "../../utils/constants";
import {Utils} from "../../utils/utils";

export class VideosController extends BaseController {
    constructor() {
        const videosService = new VideosService()
        super( videosService );
    }

    // async getAll(req: any, res: any) {
    //     return super.getAll(req, res, req.query, req.params.filter || {});
    // };
    async getAll(req: any, res: any, param: any = {}, filter: any = {}) {
        try {
            let order: any = DEFAULT_ORDER;
            param = req.query
            if(req.auth.role == UserRoles.USER){
                filter.status = true
            }else{
                if (param.status !== undefined) {
                    filter.status = param.status == '1' ? true : false
                }
            }

            if (param.is_feature !== undefined) {
                filter.is_feature = param.is_feature == '1' ? true : false
            }

            if (param.duration !== undefined) {
                filter.duration = param.duration;
            }

            if (param.title !== undefined) {
                const escapedTitle = param.title.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
                filter.title = { $regex: new RegExp(`^${escapedTitle}`, 'i') };
            }
            if (param.order_by) {
                order = { [param.order_by]: parseInt(param?.order) || DESC }
            }
            const result = await this.service.getAll(order, param, filter);
            return res.status(result.status_code).send(result.body);
        } catch (error) {
            console.log(error, 'getAll');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };

    async getById(req: any, res: any) {
        return super.getById(req, res);
    };

    // async create(req: any, res: any) {
    //     return super.create(req, res)
    // };

    async create(req: any, res: any) {
        try {
            const result = await this.service.create(req);
            return res.status(result.status_code).send(result.body);
        } catch (error) {
            console.log(error, 'create');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
    };

    async update(req: any, res: any) {
        return super.update(req, res)
    };

    async delete(req: any, res: any) {
        return super.delete(req, res)
    };
}