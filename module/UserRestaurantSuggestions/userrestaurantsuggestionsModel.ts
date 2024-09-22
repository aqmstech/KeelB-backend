import {BaseModel} from "../../models/baseModel";
import { UserRestaurantSuggestionsInterface} from "./userrestaurantsuggestionsInterface";
import {Utils} from "../../utils/utils";

export class UserRestaurantSuggestionsModel extends BaseModel {
    protected fillables: any = [];

    constructor() {
        super('userrestaurantsuggestions', []);
        this.fillables = [
  {
    "column": "name",
    "type": "string"
  },
  {
    "column": "location",
    "type": "object"
  },
  {
    "column": "address",
    "type": "string"
  },
  {
    "column": "phone",
    "type": "string"
  },
  {
    "column": "user_id",
    "type": "string"
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

    public sanitize(data: any): UserRestaurantSuggestionsInterface {
                const keys = Object.keys(data);
                const columns = this.fillables.map((column: any) => column.column);
                let newData:any = {}
                // Check if all the required keys are present in the data
                for (const key of columns) {
                    if (keys.includes(key)) {
                        newData[key] = data[key];
                    }
                }

                return newData as UserRestaurantSuggestionsInterface;
            }

    public async List(
        filter: any,
        order: Record<string, any>,
        page: number,
        perPage: number,
        withoutPagination: boolean = false,
    ) {
        if (!this.collection) await this.INIT();
        try {
            if (filter && typeof filter === 'string') {
                filter = JSON.parse(filter);
            }

            if (filter) {
                const andFilter: any[] = [];

                Object.keys(filter).forEach(field => {
                    const value = filter[field];
                    let searchParam;

                    if (typeof value === 'string') {
                        const searchRegex = new RegExp(value, 'i');
                        searchParam = { [field]: searchRegex };
                    } else if (typeof value === 'number' || typeof value === 'boolean' || value instanceof Date) {
                        searchParam = { [field]: value };
                    } else {
                        searchParam = { [field]: value };
                    }

                    andFilter.push(searchParam);
                    delete filter[field];
                });

                if (andFilter.length > 0) {
                    filter.$and = andFilter;
                }
            }

            filter.deletedAt = null;

            const pagination = Utils.CalcPagination(page, perPage);
            const total = await this.collection.countDocuments(filter);
            let data = [];

            const pipeline: any[] = [
                {
                    $lookup: {
                        from: 'users', // Assuming the name of the user collection is 'user'
                        localField: 'user_id', // Local field in the current collection
                        foreignField: '_id', // Foreign field in the user collection
                        pipeline: [
                            {$project: {otpInfo: 0, password: 0,isDeleted:0}},
                        ],
                        as: 'user',// Alias for the joined user data,

                    },

                },
                {$unwind: {path: "$user", preserveNullAndEmptyArrays: true}},
                { $match: filter }, // Apply any additional filters
                { $sort: order } // Apply sorting
            ];



            if (!withoutPagination) {
                pipeline.push({ $skip: pagination.skip });
                pipeline.push({ $limit: pagination.limit });
            }

            data = await this.collection.aggregate(pipeline).toArray();

            if (withoutPagination) {
                return data;
            }

            return Utils.Pagination(data, page, perPage, parseInt(total), this?.collectionName || 'data');
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}