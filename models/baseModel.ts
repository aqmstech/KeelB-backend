import mongodb, {Db, ObjectId} from "mongodb";
import {DefaultDatabase} from "../databases/database";
import {Utils} from "../utils/utils";


export class BaseModel {
    protected collectionName: string;
    protected relations: any;
    private db: any;
    protected collection: any;

    constructor(collectionName: string, relation = []) {
        this.collectionName = collectionName
        this.relations = relation
        this.INIT()
    }

    protected async INIT() {
        let initializeCollection = new Promise((resolve, reject) => {
            DefaultDatabase.db.subscribe(async (val: any) => {
                this.db = val;
                if (val) {
                    try {
                        this.collection = await this.db.createCollection(this.collectionName);
                        resolve("Collection created");
                    } catch (error) {
                        if (error.code == 48) {
                            this.collection = this.db.collection(this.collectionName);
                            if (this.collection) {
                                console.log(
                                    "Collection loaded: ",
                                    this.collection.collectionName
                                );
                                resolve("Existing collection loaded");
                            }
                            reject("Unknown error in collection");
                        } else {
                            console.log(error);
                            console.log("error in creating Collection: ", this.collectionName);
                            reject("Error in creating collection");
                        }
                    }
                }
            });
        });
        return initializeCollection;
    }

    /**
     * @Note : Follow Function is overide for initializing in Model.
     * Since Workers in node js doesn't share memory hence we initialize it again
     */

    public async INITWorker() {
        if (!this.db) throw new Error('Unable to Initialize model in worker');
        try {
            this.collection = await this.db.collection(this.collectionName);
        } catch (error) {
            throw new Error('Error in Initializing Collection in Worker')
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

            filter.deletedAt = null;

            let pagination = Utils.CalcPagination(page, perPage)
            const total: any = await this.collection.countDocuments(filter)
            let data = [];
            if (withoutPagination) {
                data = await this.collection.find(filter).sort(order).toArray();
                return data;
            }
            data = await this.collection.find(filter).sort(order).skip(pagination.skip).limit(pagination.limit).toArray();
            return Utils.Pagination(data, page, perPage, parseInt(total), this?.collectionName || 'data');
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    public async Add(data: any) {
        if (!this.collection) await this.INIT()
        data.createdAt = new Date();
        data.deletedAt = null;
        try {
            let doc = await this.collection.insertOne(data)
            return doc.insertedId;
        } catch (error) {
            console.log(error, 'model error add')
            throw new Error(error);
        }
    }

    public async FindAndAdd(data: {}) {
        if (!this.collection) await this.INIT()
        try {
            let doc = await this.collection.findOneAndUpdate(data, {$inc: {count: 1}}, {
                upsert: true,
                returnDocument: 'after'
            })
            return doc.value;
        } catch (error) {
            throw new Error(error);
        }
    }

    public async Update(id: object, data: any) {
        if (!this.collection) await this.INIT()
        data.updatedAt = new Date();
        try {
            return await this.collection.updateOne(
                {_id: id},
                {$set: data},
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    public async Upsert(condition: object, data: {}) {
        if (!this.collection) await this.INIT()
        try {
            await this.collection.updateOne(
                condition,
                {$set: data},
                {upsert: true}
            );

            return await this.collection.findOne(condition);
        } catch (error) {
            throw new Error(error);
        }
    }

    public async GetOne(filter: any) {
        if (!this.collection) await this.INIT()
        try {
            filter.deletedAt = null
            return await this.collection.findOne(filter);
        } catch (error) {
            throw new Error(error);
        }
    }

    public async GetById(id: object) {
        if (!this.collection) await this.INIT()
        try {
            if (this.collection) {
                let filter = {_id: id, deletedAt: null}
                return await this.collection.findOne(filter);
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    public async Delete(id: object) {
        if (!this.collection) await this.INIT()
        try {
            const _id = id
            return await this.collection.updateOne(
                {_id: _id},
                {$set: {isDeleted: true, deletedAt: new Date().toISOString()}},
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    public async DeleteMany(filter: object ={}) {
        if (!this.collection) await this.INIT()
        try {
            return await this.collection.deleteMany(
                filter
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    public async HardDelete(id: object) {
        if (!this.collection) await this.INIT()
        try {
            const _id = id
            return await this.collection.deleteOne(
                {_id: _id}
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    public async Count(condition: object) {
        if (!this.collection) await this.INIT()
        try {
            return this.collection.countDocuments(condition);
        } catch (error) {
            throw new Error(error);
        }
    }

    public async Sort(filter: any, sortBy: any) {
        if (!this.collection) await this.INIT()
        try {
            return await this.collection.find(filter).sort(sortBy).toArray();
        } catch (error) {
            throw new Error(error);
        }
    }

    public async CreateMany(data:any) {
        if (!this.collection) await this.INIT()
        try {
            return await this.collection.insertMany(data);
        } catch (error) {
            throw new Error(error);
        }
    }

    public async UpdateMany(filter:any,data:any) {
        if (!this.collection) await this.INIT()
        try {
            return await this.collection.updateMany(filter,{$set:data});
        } catch (error) {
            throw new Error(error);
        }
    }

    private async withTransaction(operation: Function) {
        const session = this.db.startSession();
        session.startTransaction();
        try {
            const result = await operation(session);
            await session.commitTransaction();
            session.endSession();
            return result;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw new Error('Transaction aborted: ' + error.message);
        }
    }

    public async AddWithTransaction(data: {}) {
        try {
            return await this.withTransaction(async (session: any) => {
                const doc = await this.collection.insertOne(data, {session});
                return doc.insertedId;
            });
        } catch (error) {
            throw new Error('Error adding with transaction: ' + error.message);
        }
    }

    public async UpdateWithTransaction(id: object, data: {}) {
        try {
            return await this.withTransaction(async (session: any) => {
                return this.collection.updateOne({_id: id}, {$set: data}, {session});
            });
        } catch (error) {
            throw new Error('Error updating with transaction: ' + error.message);
        }
    }

    public async UpsertWithTransaction(condition: object, data: {}) {
        try {
            return await this.withTransaction(async (session: any) => {
                await this.collection.updateOne(condition, {$set: data}, {upsert: true, session});
                return this.collection.findOne(condition);
            });
        } catch (error) {
            throw new Error('Error upserting with transaction: ' + error.message);
        }
    }

    public async BulkInsertWithTransaction(data: any[]) {
        try {
            return await this.withTransaction(async (session: any) => {
                return this.collection.insertMany(data, {session});
            });
        } catch (error) {
            throw new Error('Error bulk inserting with transaction: ' + error.message);
        }
    }

    public async BulkUpdateWithTransaction(filter: any, updateData: any) {
        try {
            return await this.withTransaction(async (session: any) => {
                return this.collection.updateMany(filter, {$set: updateData}, {session});
            });
        } catch (error) {
            throw new Error('Error bulk updating with transaction: ' + error.message);
        }
    }

    public async BulkDeleteWithTransaction(filter: any) {
        try {
            return await this.withTransaction(async (session: any) => {
                return this.collection.deleteMany(filter, {session});
            });
        } catch (error) {
            throw new Error('Error bulk deleting with transaction: ' + error.message);
        }
    }

    public async Aggregate(pipeline: any[]) {
        try {
            return await this.collection.aggregate(pipeline).toArray();
        } catch (error) {
            throw new Error('Error aggregating: ' + error.message);
        }
    }

    public async CreateIndex(keys: any, options: any = {}) {
        try {
            return await this.collection.createIndex(keys, options);
        } catch (error) {
            throw new Error('Error creating index: ' + error.message);
        }
    }

    public async GetDocumentsCreatedBetween(startDate: Date, endDate: Date, projection: any = {}, options: any = {}) {
        try {
            return await this.collection.find({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }, projection, options).toArray();
        } catch (error) {
            throw new Error('Error retrieving documents created between given dates: ' + error.message);
        }
    }

    public async GetDocumentsCreatedOrModifiedBetween(startDate: Date, endDate: Date, projection: any = {}, options: any = {}) {
        try {
            return await this.collection.find({
                $or: [
                    {createdAt: {$gte: startDate, $lte: endDate}},
                    {updatedAt: {$gte: startDate, $lte: endDate}}
                ]
            }, projection, options).toArray();
        } catch (error) {
            throw new Error('Error retrieving documents created or modified between given dates: ' + error.message);
        }
    }
}