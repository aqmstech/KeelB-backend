import { AreasModel} from './areasModel';
import {BaseService} from "../../services/api/baseService";

export class AreasService extends BaseService {
    constructor() {
        const areasModel = new AreasModel();
        super( areasModel);
    }
}