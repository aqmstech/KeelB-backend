import {BaseModel} from "../../models/baseModel";
import {DonationsInterface} from "./donationsInterface";
import {InternalServerError} from "../../errors/internal-server-error";
import {Utils} from "../../utils/utils";

export class DonationsModel extends BaseModel {
    protected fillables: any = [];

    constructor() {
        super('donations', []);
        this.fillables = [
            {
                "column": "donation_number",
                "type": "string"
            },
            {
                "column": "donor_name",
                "type": "string"
            },
            {
                "column": "email",
                "type": "email"
            },
            {
                "column": "purpose",
                "type": "string"
            },
            {
                "column": "amount",
                "type": "number"
            },
            {
                "column": "user_id",
                "type": "object"
            },
            {
                "column": "payment_method",
                "type": "string"
            },
            {
                "column": "payment_method_type",
                "type": "enum"
            },
            {
                "column": "status?",
                "type": "enum"
            },
            {
                "column": "payload?",
                "type": "object"
            },
            {
                "column": "createdAt",
                "type": "date"
            },
            {
                "column": "updatedAt?",
                "type": "date"
            },
            {
                "column": "deletedAt?",
                "type": "date"
            }
        ]
    }

    public sanitize(data: any): DonationsInterface {
        const keys = Object.keys(data);
        const columns = this.fillables.map((column: any) => column.column);
        let newData: any = {}
        // Check if all the required keys are present in the data
        for (const key of columns) {
            if (keys.includes(key)) {
                newData[key] = data[key];
            }
        }

        return newData as DonationsInterface;
    }

    public async findAllByQuery(query: object) {
        try {
            if (!this.collection) await this.INIT()
            const res = await this.collection.find(query).toArray();
            return res;
        } catch (error) {
            throw new InternalServerError();
        }
    }

    public async List(filter: any, order: {}, page: number, perPage: number, withoutPagination: boolean = false) {
        if (!this.collection) await this.INIT()
        try {
            if (filter && typeof filter === 'string') {
                filter = JSON.parse(filter);
            }

            if (filter) {
                const andFilter: any = [];

                // Iterate through each field in the filter object
                Object.keys(filter).forEach(field => {
                    const value = filter[field];
                    let searchParam;

                    // Determine the type of the value and create the appropriate search parameter
                    if (typeof value === 'string') {
                        // For strings, use case-insensitive regular expression
                        const searchRegex = new RegExp(value, 'i');
                        searchParam = {[field]: searchRegex};
                    } else if (typeof value === 'number' || typeof value === 'boolean' || value instanceof Date) {
                        // For numbers, booleans, and dates, match the exact value
                        searchParam = {[field]: value};
                    } else {
                        // Handle other types if necessary
                        searchParam = {[field]: value};
                    }

                    // Add the search parameter to the andFilter array
                    andFilter.push(searchParam);

                    // Remove the original field from the filter object
                    delete filter[field];
                });

                // Assign the $and array to the filter object
                if (andFilter.length > 0) {
                    filter.$and = andFilter;
                }
            }



            // Lookup stage to join with the user table
            const lookupPipeline: any = [
                {
                    $lookup: {
                        from: 'users', // Assuming the name of the user collection is 'user'
                        localField: 'user_id', // Local field in the current collection
                        foreignField: '_id', // Foreign field in the user collection
                        pipeline: [
                            {$project: {otpInfo: 0, password: 0}},
                        ],
                        as: 'user',// Alias for the joined user data,

                    },

                },
                {$unwind: {path: "$user", preserveNullAndEmptyArrays: true}}
            ];

            const lookupTotalAmountPipeline: any = [
                {
                    $group: {
                        _id: null, // Grouping key (null means no grouping, single result)
                        totalAmount: {$sum: "$amount"} // Field to sum
                    }
                },
            ];

            let aggregationPipeline = [{$match: filter}, ...lookupPipeline];
            let aggregationTotalAmountPipeline = [{$match: filter}, ...lookupTotalAmountPipeline];
            if (withoutPagination) {
                // Execute aggregation without pagination
                const data = await this.collection.aggregate(aggregationPipeline).sort(order).toArray();
                const total_donated_amount = await this.collection.aggregate(aggregationTotalAmountPipeline).sort(order).toArray();
                return {
                    data: data,
                    total_donated_amount: total_donated_amount[0]?.totalAmount
                };
            }

            // Calculate pagination and total count
            let pagination: any = Utils.CalcPagination(page, perPage);
            const total: any = await this.collection.countDocuments(filter);

            // Execute aggregation with pagination
            aggregationPipeline = [...aggregationPipeline, {$sort: order}, {$skip: pagination.skip}, {$limit: pagination.limit}];
            const data = await this.collection.aggregate(aggregationPipeline).toArray();
            const total_donated_amount = await this.collection.aggregate(aggregationTotalAmountPipeline).toArray();
            return Utils.CustomPagination(data, page, perPage, parseInt(total), this?.collectionName || 'data', {total_donated_amount: total_donated_amount[0]?.totalAmount || 0});
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    public async getTotalPaidAmount(filter: any) {
        if (!this.collection) await this.INIT();
        try {
            // Define the match stage to filter documents with status 'paid'
            const matchStage = { $match: filter };

            // Define the group stage to calculate the sum of the 'amount' field
            const groupStage = {
                $group: {
                    _id: null, // Grouping key (null means no grouping, single result)
                    totalPaidAmount: { $sum: "$amount" } // Field to sum
                }
            };

            // Define the aggregation pipeline
            const aggregationPipeline = [matchStage, groupStage];

            // Execute the aggregation pipeline
            const result = await this.collection.aggregate(aggregationPipeline).toArray();

            // Return the total paid amount
            return result[0]?.totalPaidAmount || 0;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }


}