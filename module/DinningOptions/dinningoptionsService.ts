import { DinningOptionsModel} from './dinningoptionsModel';
import {BaseService} from "../../services/api/baseService";

export class DinningOptionsService extends BaseService {
    constructor() {
        const dinningoptionsModel = new DinningOptionsModel();
        super( dinningoptionsModel);
    }
}