import { RolesModel} from './rolesModel';
import {BaseService} from "../../services/api/baseService";

export class RolesService extends BaseService {
    constructor() {
        const rolesModel = new RolesModel();
        super( rolesModel);
    }
}