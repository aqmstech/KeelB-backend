import { SubregionsModel } from './subregionsModel';
import { BaseService } from "../../services/api/baseService";

export class SubregionsService extends BaseService {
    constructor() {
        const subregionsModel = new SubregionsModel();
        super(subregionsModel);
    }
}