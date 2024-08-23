
//NOTE : Following Config is inline for basic usage. However we can use vault as per our requirement.

export interface DBConfigMongo {
    auth?: {
        password: string,
        username: string
    },
    dbname: string;
    host: string;
    port: number;
    protocol?: string;
    atlas?: boolean
}

interface DBConfigSQL {
    //Create Config When Required
}

export class DBConfig {

    public static dbconf = {
        "default": {
            dbname: 'afrotierre',
            host: 'localhost',
            port: 27017,
            protocol: 'mongodb'

        } as DBConfigMongo,
        "tfl": {
            dbname: 'afrotierre',
            host: 'localhost',
            port: 27017,
            protocol: 'mongodb'


        } as DBConfigMongo

    }

}