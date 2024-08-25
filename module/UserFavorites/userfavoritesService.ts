import { UserFavoritesModel} from './userfavoritesModel';
import {BaseService} from "../../services/api/baseService";
import {Utils} from "../../utils/utils";

export class UserFavoritesService extends BaseService {
    constructor() {
        const userfavoritesModel = new UserFavoritesModel();
        super( userfavoritesModel);
    }

    protected async create(data: any = {}) {
        try {
             let exists = await this.model.GetOne({user_id:data?.user_id,restaurant_id:data?.restaurant_id})

            if(exists){
                const deleted = this.model.HardDelete(exists?._id)
                return Utils.getResponse(true, "The restaurant has been removed from your favorites.", null, 400, 1001);
            }

            data['createdAt'] = new Date().toString();
            const sanitizeData = this.model.sanitize(data)
            const inserteedId = await this.model.Add(sanitizeData)
            let record: any = await this.model.GetById(inserteedId);

            return Utils.getResponse(true, "The restaurant has been added to your favorites.", record, 200, 1001);
        } catch (error) {
            console.log(error, 'error in service add')
            return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
        }
    };
}