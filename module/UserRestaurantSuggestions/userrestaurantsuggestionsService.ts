import { UserRestaurantSuggestionsModel} from './userrestaurantsuggestionsModel';
import {BaseService} from "../../services/api/baseService";
import {DEFAULT_ORDER, PAGE, PER_PAGE} from "../../utils/constants";
import {Utils} from "../../utils/utils";

export class UserRestaurantSuggestionsService extends BaseService {
    constructor() {
        const userrestaurantsuggestionsModel = new UserRestaurantSuggestionsModel();
        super( userrestaurantsuggestionsModel);
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

}