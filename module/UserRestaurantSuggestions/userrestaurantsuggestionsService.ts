import { UserRestaurantSuggestionsModel} from './userrestaurantsuggestionsModel';
import {BaseService} from "../../services/api/baseService";

export class UserRestaurantSuggestionsService extends BaseService {
    constructor() {
        const userrestaurantsuggestionsModel = new UserRestaurantSuggestionsModel();
        super( userrestaurantsuggestionsModel);
    }
}