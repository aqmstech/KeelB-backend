import { CategoriesModel} from './categoriesModel';
import {BaseService} from "../../services/api/baseService";

export class CategoriesService extends BaseService {
    constructor() {
        const categoriesModel = new CategoriesModel();
        super( categoriesModel);
    }
}