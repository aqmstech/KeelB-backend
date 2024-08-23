import { PagesModel } from './pagesModel';
import { BaseService } from "../../services/api/baseService";
import {Utils} from "../../utils/utils";

export class PagesService extends BaseService {
    constructor() {
        const pagesModel = new PagesModel();
        super(pagesModel);
    }
    protected async getBySlug(slug: string) {
        try {
            const record: any = await this.model.GetOne({slug});
            if (!record) {
                return Utils.getResponse(false, "Record not found", null, 404, 1004);
            }

            return Utils.getResponse(true, "Record fetched successfully", record, 200, 1000);

        } catch (error) {
            return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
        }
    }
}