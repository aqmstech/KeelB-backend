import { RestaurantTypeModel} from './restauranttypeModel';
import {BaseService} from "../../services/api/baseService";

export class RestaurantTypeService extends BaseService {
    constructor() {
        const restauranttypeModel = new RestaurantTypeModel();
        super( restauranttypeModel);
    }
}