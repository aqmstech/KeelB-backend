import {BaseController} from "../../controllers/api/baseController";
import { CategoriesService} from "./categoriesService";

export class CategoriesController extends BaseController {
    constructor() {
        const categoriesService = new CategoriesService()
        super( categoriesService );
    }

    async getAll(req: any, res: any) {
        let param = req.query
        let filter :any ={}


        if(param.isFeatured !== undefined) {
            filter.isFeatured = param.isFeatured == 1 ? true : false
        }

        if(param.status !== undefined) {
            filter.status = param.status == 1 ? true : false
        }

        if (param.keyword !== undefined) {
            const escapedTitle = param.keyword.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
            filter.name = { $regex: new RegExp(`^${escapedTitle}`, 'i') };
        }
        return super.getAll(req, res, req.query, filter || {});
    };

    async getById(req: any, res: any) {
        return super.getById(req, res);
    };

    async create(req: any, res: any) {
        return super.create(req, res)
    };

    async update(req: any, res: any) {
        return super.update(req, res)
    };

    async delete(req: any, res: any) {
        return super.delete(req, res)
    };
}