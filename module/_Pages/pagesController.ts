import { BaseController } from "../../controllers/api/baseController";
import { PagesService } from "./pagesService";
import {Utils} from "../../utils/utils";

export class PagesController extends BaseController {
    constructor() {
        const pagesService = new PagesService()
        super(pagesService);
    }

    async getAll(req: any, res: any) {
        let filter :any ={}
        let param = req.query
        let orConditions = [];

        if (param.keyword) {
            const keywordRegex = { $regex: new RegExp(param.keyword, 'i') }; // 'i' for case-insensitive
            orConditions.push({ title: keywordRegex });
            orConditions.push({ slug: keywordRegex });
        }

        // If there are any `$or` conditions, add them to the filter
        if (orConditions.length > 0) {
            filter.$or = orConditions;
        }
        return super.getAll(req, res, param, filter || {});
    };

    async getById(req: any, res: any) {
        return super.getById(req, res);
    };

    async getBySlug(req: any, res: any) {
        try {

            const result = await this.service.getBySlug(req.params.slug);
            return res.status(result.status_code).send(result.body);
        } catch (error) {
            console.log(error, 'create');
            const error_result = Utils.getResponse(false, "Something went wrong", error, 500, 1005);
            return res.status(error_result.status_code).send(error_result.body);
        }
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