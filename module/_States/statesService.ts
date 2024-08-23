import { StatesModel } from './statesModel';
import { BaseService } from "../../services/api/baseService";

export class StatesService extends BaseService {
    constructor() {
        const statesModel = new StatesModel();
        super(statesModel);
    }
}