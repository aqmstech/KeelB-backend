import { CuisinesModel} from './cuisinesModel';
import {BaseService} from "../../services/api/baseService";

export class CuisinesService extends BaseService {
    constructor() {
        const cuisinesModel = new CuisinesModel();
        super( cuisinesModel);
    }
}