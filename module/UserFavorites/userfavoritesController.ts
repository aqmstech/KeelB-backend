import {BaseController} from "../../controllers/api/baseController";
import { UserFavoritesService} from "./userfavoritesService";
import {ObjectId} from "mongodb";

export class UserFavoritesController extends BaseController {
    constructor() {
        const userfavoritesService = new UserFavoritesService()
        super( userfavoritesService );
    }

    async getAll(req: any, res: any) {
        return super.getAll(req, res, req.query, req.params.filter || {});
    };

    async getById(req: any, res: any) {
        return super.getById(req, res);
    };

    async create(req: any, res: any) {
        if(req?.body?.restaurant_id){
            req.body.restaurant_id = new ObjectId(req?.body?.restaurant_id)
        }
        req.body.user_id = new ObjectId(req?.auth?._id)

        return super.create(req, res)
    };

    async update(req: any, res: any) {
        return super.update(req, res)
    };

    async delete(req: any, res: any) {
        return super.delete(req, res)
    };
}