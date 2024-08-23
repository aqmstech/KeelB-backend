import { BaseController } from "../../controllers/api/baseController";
import { FaqsService } from "./faqsService";
import {DEFAULT_ORDER, DESC} from "../../utils/constants";
import {Utils} from "../../utils/utils";

export class FaqsController extends BaseController {
    constructor() {
        const faqsService = new FaqsService()
        super(faqsService);
    }

    async getAll(req: any, res: any) {
        try {
            let order: any = DEFAULT_ORDER;
            let param = req.query
            let filter:any = {}
            let orConditions = [];

            if (param.question !== undefined) {
                const escapedTitle = param.question.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
                filter.question = { $regex: new RegExp(`^${escapedTitle}`, 'i') };
            }

            if (param.answer !== undefined) {
                const escapedTitle = param.answer.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
                filter.answer = { $regex: new RegExp(`^${escapedTitle}`, 'i') };
            }

            if (param.keyword) {
                const keywordRegex = { $regex: new RegExp(param.keyword, 'i') }; // 'i' for case-insensitive
                orConditions.push({ question: keywordRegex });
                orConditions.push({ answer: keywordRegex });
            }

            // If there are any `$or` conditions, add them to the filter
            if (orConditions.length > 0) {
                filter.$or = orConditions;
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