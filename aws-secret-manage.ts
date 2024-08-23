import { SecretsManagerClientConfig } from "@aws-sdk/client-secrets-manager";
import * as AWS from "@aws-sdk/client-secrets-manager";
import * as AWSCred from "@aws-sdk/credential-providers";

async function UpdateConfig(keyname: string) {
    try {

        console.log('INSERTING VAULT DATA')

        let temp = {
            "APIKEYS": {
                "stardusttoken": "",
                "stardusturl": ""
            },
            "AWS": {
                "s3": {
                    "s3": {
                        "access_key_id": "",
                        "region": "us-east-2",
                        "secret_access_key": "",
                        "bucket": "",
                        "folder": ""
                    }
                },
                "ses": {},
                "sns": {},
                "sqs": {}
            },
            "DB": {
                "Mongo": {
                    "default": {
                        "auth": {
                            "password": "",
                            "username": ""
                        },
                        "dbname": "",
                        "host": "",
                        "port": 27017,
                        "protocol": "", // mongodb+srv | mongodb
                        "atlas": false
                    }
                },
                "psql": {},
                "solr": {}
            },
            "ENCRYPTION": {
                "iv": "wNQziAIIu1Lx52YY",
                "salt": "AH0zT?l3ic+HdEArBJMm_//1.i/s89ZF"
            },
            "ENV": "local",
            "FCM": {},
            "Logging": {
                "SENTRY": {
                    "dsn": "",
                    "minidump_endpoint": "",
                    "security_header_endpoint": ""
                }
            },
            "RABBITMQ": {
                "host": "",
                "password": "",
                "port": 5671,
                "protocol": "amqp",
                "user": ""
            },
            "REDIS": {
                "LivePush": {}
            },
            "SALTS": {
                "mobile_salt": "695ddccd984217fe8d79858dc485b67d66489145afa78e8b27c1451b27cc7a2b"
            },
            "SMTP": {
                "GMAIL": {
                    "auth": {
                        "pass": "",
                        "user": ""
                    },
                    "host": "",
                    "port": 2525
                }
            }
        };

        let creds: SecretsManagerClientConfig = {
            credentials: AWSCred.fromIni({ profile: '' })
        }
        let aws = new AWS.SecretsManager(creds);
        console.log('AWS INITIALIZED');
        let result = await aws.updateSecret({
            SecretId: keyname,
            SecretString: JSON.stringify(temp)
        })
        console.log('INSERTED AWS VAULT DATA');
        console.log(JSON.stringify(result, undefined, 4));
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    let keyname = 'APPCONFIG_PRODUCTION';
    await UpdateConfig(keyname);
})();