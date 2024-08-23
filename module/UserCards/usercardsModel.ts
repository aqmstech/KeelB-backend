import {BaseModel} from "../../models/baseModel";
import {UserCardsInterface} from "./usercardsInterface";
import {Utils} from "../../utils/utils";
import {AuthModel} from "../_Auth/authModel";
import {ObjectId} from "mongodb";
import {UserdevicesModel} from "../_Userdevices/userdevicesModel";

export class UserCardsModel extends BaseModel {
    protected fillables: any = [];
    private authModel: AuthModel;

    constructor() {
        super('usercards', []);
        this.authModel = new AuthModel()
        this.fillables = [
            {
                "column": "user_id",
                "type": "string"
            },
            {
                "column": "pm_id",
                "type": "string"
            },
            {
                "column": "payment_method",
                "type": "object"
            },
            {
                "column": "createdAt",
                "type": "date"
            },
            {
                "column": "updatedAt",
                "type": "date"
            },
            {
                "column": "deletedAt",
                "type": "date"
            }
        ]
    }

    public sanitize(data: any): UserCardsInterface {
        const keys = Object.keys(data);
        const columns = this.fillables.map((column: any) => column.column);
        let newData: any = {}
        // Check if all the required keys are present in the data
        for (const key of columns) {
            if (keys.includes(key)) {
                newData[key] = data[key];
            }
        }

        return newData as UserCardsInterface;
    }

    public async List(filter: any, order: {}, page: number, perPage: number, withoutPagination: boolean = false) {
        if (!this.collection) await this.INIT()
        try {
            let customer_id: string;

            filter.deletedAt = null;
            console.log(filter, 'filter')
            if (filter.user_id != undefined) {
                let user = await this.authModel.GetOne({_id: filter.user_id})
                customer_id = user?.additionalFields?.stripe_customer_id
                console.log(customer_id, "customer_id")
            }

            let pagination = Utils.CalcPagination(page, perPage)
            const total: any = await this.collection.countDocuments(filter)
            let data = [];
            if (withoutPagination) {
                data = await this.collection.find(filter).sort(order).toArray();
                return data;
            }
            data = await this.collection.find(filter).sort(order).skip(pagination.skip).limit(pagination.limit).toArray();
            return Utils.Pagination(data, page, perPage, parseInt(total), this?.collectionName || 'data');
        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    }
}