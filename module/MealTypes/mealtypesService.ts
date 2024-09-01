import { MealTypesModel} from './mealtypesModel';
import {BaseService} from "../../services/api/baseService";

export class MealTypesService extends BaseService {
    constructor() {
        const mealtypesModel = new MealTypesModel();
        super( mealtypesModel);
    }
}