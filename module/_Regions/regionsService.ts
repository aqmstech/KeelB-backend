import { RegionsModel } from './regionsModel';
import { BaseService } from "../../services/api/baseService";

export class RegionsService extends BaseService {
    constructor() {
        const regionsModel = new RegionsModel();
        super(regionsModel);
    }
}