import { AccountdeletionsModel} from './accountdeletionsModel';
import {BaseService} from "../../services/api/baseService";

export class AccountdeletionsService extends BaseService {
    constructor() {
        const accountdeletionsModel = new AccountdeletionsModel();
        super( accountdeletionsModel);
    }
}