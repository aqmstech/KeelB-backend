import {BaseModel} from "../../models/baseModel";
import {RestaurantsInterface} from "./restaurantsInterface";
import {Utils} from "../../utils/utils";

export class RestaurantsModel extends BaseModel {
    protected fillables: any = [];

    constructor() {
        super('restaurants', []);
        this.fillables = [
            {
                "column": "name",
                "type": "string"
            },
            {
                "column": "cover_image",
                "type": "string"
            },
            {
                "column": "description",
                "type": "string"
            },
            {
                "column": "address",
                "type": "string"
            },
            {
                "column": "user_id",
                "type": "string"
            },
            {
                "column": "min_price",
                "type": "number"
            },
            {
                "column": "max_price",
                "type": "number"
            },
            {
                "column": "avg_rating",
                "type": "number"
            },
            {
                "column": "menu",
                "type": "object"
            },
            {
                "column": "currency_type",
                "type": "string"
            },
            {
                "column": "location",
                "type": "object"
            },
            {
                "column": "cuisines",
                "type": "array"
            },
            {
                "column": "meal_type",
                "type": "array"
            },
            {
                "column": "ambiance",
                "type": "array"
            },
            {
                "column": "categories",
                "type": "array"
            },
            {
                "column": "timings",
                "type": "array"
            },
            {
                "column": "areas",
                "type": "array"
            },
            {
                "column": "types",
                "type": "array"
            },
            {
                "column": "dinning_options",
                "type": "array"
            },
            {
                "column": "accepted_payment_types",
                "type": "enum"
            },
            {
                "column": "service_types",
                "type": "enum"
            },
            {
                "column": "service_time",
                "type": "object"
            },
            {
                "column": "isFeatured",
                "type": "boolean"
            },
            {
                "column": "isVerified",
                "type": "boolean"
            },
            {
                "column": "status",
                "type": "enum"
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

    public sanitize(data: any): RestaurantsInterface {
        const keys = Object.keys(data);
        const columns = this.fillables.map((column: any) => column.column);
        let newData: any = {}
        // Check if all the required keys are present in the data
        for (const key of columns) {
            if (keys.includes(key)) {
                newData[key] = data[key];
            }
        }

        return newData as RestaurantsInterface;
    }

    public async List(
        filter: any,
        order: Record<string, any>,
        page: number,
        perPage: number,
        withoutPagination: boolean = false,
        user_id: any = null
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
                        searchParam = {[field]: searchRegex};
                    } else if (typeof value === 'number' || typeof value === 'boolean' || value instanceof Date) {
                        searchParam = {[field]: value};
                    } else {
                        searchParam = {[field]: value};
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
                        from: 'reviews',
                        let: {restaurantId: '$_id'},
                        pipeline: [
                            {$match: {$expr: {$eq: ['$restaurant_id', '$$restaurantId']}}},
                            {
                                $group: {
                                    _id: null,
                                    avgRating: {$avg: '$rating'},
                                    totalReviews: {$sum: 1}
                                }
                            }
                        ],
                        as: 'reviews'
                    }
                },
                {
                    $lookup: {
                        from: 'userfavorites',
                        let: {restaurantId: '$_id', userId: user_id},
                        pipeline: [
                            {$match: {$expr: {$and: [{$eq: ['$restaurant_id', '$$restaurantId']}, {$eq: ['$user_id', '$$userId']}]}}},
                            {$project: {_id: 0}}
                        ],
                        as: 'user_favorite'
                    }
                },
                {
                    $lookup: {
                        from: 'categories',  // Collection containing detailed category data
                        localField: 'categories', // Field in the restaurant collection
                        foreignField: '_id', // Field in the categories collection
                        as: 'category_details' // Output array field
                    }
                },
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
                {
                    $lookup: {
                        from: 'reviews',
                        let: {restaurantId: '$_id', userId: user_id},
                        pipeline: [
                            {$match: {$expr: {$and: [{$eq: ['$restaurant_id', '$$restaurantId']}, {$eq: ['$user_id', '$$userId']}]}}}
                        ],
                        as: 'user_review'
                    }
                },
                {
                    $addFields: {
                        avg_rating: {$ifNull: [{$arrayElemAt: ['$reviews.avgRating', 0]}, 0]},
                        totalReviews: {$ifNull: [{$arrayElemAt: ['$reviews.totalReviews', 0]}, 0]},
                        isFavourite: {$cond: {if: {$gt: [{$size: '$user_favorite'}, 0]}, then: true, else: false}},
                        isReviewed: {$cond: {if: {$gt: [{$size: '$user_review'}, 0]}, then: true, else: false}}
                    }
                },
                {
                    $project: {
                        reviews: 0, // Exclude the reviews array from the output
                        user_favorite: 0 // Exclude the user_favorite array from the output
                    }
                },
                {$match: filter},
                {$sort: order}
            ];

            if (!withoutPagination) {
                pipeline.push({$skip: pagination.skip});
                pipeline.push({$limit: pagination.limit});
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

    public async GetById(id: object, user_id: any = null) {
        if (!this.collection) await this.INIT();
        try {
            if (this.collection) {
                const pipeline: any[] = [
                    {
                        $match: {
                            _id: id,
                            deletedAt: null
                        }
                    },
                    {
                        $lookup: {
                            from: 'reviews',
                            let: {restaurantId: '$_id'},
                            pipeline: [
                                {$match: {$expr: {$eq: ['$restaurant_id', '$$restaurantId']}}},
                                {
                                    $group: {
                                        _id: null,
                                        avgRating: {$avg: '$rating'},
                                        totalReviews: {$sum: 1}
                                    }
                                }
                            ],
                            as: 'reviews'
                        }
                    },
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
                    {
                        $lookup: {
                            from: 'userfavorites',
                            let: {restaurantId: '$_id', userId: user_id},
                            pipeline: [
                                {$match: {$expr: {$and: [{$eq: ['$restaurant_id', '$$restaurantId']}, {$eq: ['$user_id', '$$userId']}]}}},
                                {$project: {_id: 0}}
                            ],
                            as: 'user_favorite'
                        }
                    },
                    {
                        $lookup: {
                            from: 'categories',  // Collection containing detailed category data
                            localField: 'categories', // Field in the restaurant collection
                            foreignField: '_id', // Field in the categories collection
                            as: 'category_details' // Output array field
                        }
                    },
                    {
                        $addFields: {
                            avg_rating: {$ifNull: [{$arrayElemAt: ['$reviews.avgRating', 0]}, 0]},
                            totalReviews: {$ifNull: [{$arrayElemAt: ['$reviews.totalReviews', 0]}, 0]},
                            isFavourite: {$cond: {if: {$gt: [{$size: '$user_favorite'}, 0]}, then: true, else: false}}
                        }
                    },
                    {
                        $project: {
                            reviews: 0, // Exclude the reviews array from the output
                            user_favorite: 0, // Exclude the user_favorite array from the output
                            // Exclude other fields if necessary
                        }
                    }
                ];

                const data = await this.collection.aggregate(pipeline).toArray();

                // Return the first item from the aggregation result, or null if not found
                return data.length > 0 ? data[0] : null;
            }
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }


}