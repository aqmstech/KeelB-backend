import {DEFAULT_ORDER, DESC, PAGE, PER_PAGE} from '../../utils/constants';
import {Utils} from '../../utils/utils';

export class BaseService {
    protected model: any;
    protected validator: any;

    constructor(model: any) {
        this.model = model;
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

    protected async create(data: any = {}) {
        try {
            data['createdAt'] = new Date().toString();
            const sanitizeData = this.model.sanitize(data)
            const inserteedId = await this.model.Add(sanitizeData)
            let record: any = await this.model.GetById(inserteedId);

            return Utils.getResponse(true, "Record has been added successfully", record, 200, 1001);
        } catch (error) {
            console.log(error, 'error in service add')
            return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
        }
    };


    protected async getById(id: object) {
        try {
            const record: any = await this.model.GetById(id);
            if (!record) {
                return Utils.getResponse(false, "Record not found", null, 404, 1004);
            }

            return Utils.getResponse(true, "Record fetched successfully", record, 200, 1000);

        } catch (error) {
            return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
        }
    }

    protected async update(id: object, data: any = {}) {
        try {
            const exist = await this.model.GetById(id);
            if (!exist) {
                return Utils.getResponse(false, "Record not found", null, 404, 1004);
            }

            await this.model.Update(id, data);
            const record: any = await this.model.GetById(id);

            return Utils.getResponse(true, "Record updated successfully", record, 200, 1002);

        } catch (error) {
            return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
        }
    }

    protected async delete(id: object) {
        try {
            const record = await this.model.GetById(id);

            if (!record) {
                return Utils.getResponse(false, "Record not found", null, 404, 1004);
            }
            await this.model.Delete(id);
            return Utils.getResponse(true, "Record deleted successfully", null, 200, 1003);

        } catch (error) {
            return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
        }
    }
}

