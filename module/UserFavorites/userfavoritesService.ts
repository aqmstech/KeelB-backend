import { UserFavoritesModel} from './userfavoritesModel';
import {BaseService} from "../../services/api/baseService";

export class UserFavoritesService extends BaseService {
    constructor() {
        const userfavoritesModel = new UserFavoritesModel();
        super( userfavoritesModel);
    }
}