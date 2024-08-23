# Prerequistes
1. Install Nodejs v9+
2. Mongodb v3.6+

# Note: Use following command for installing global modules.
Example : npm run -g <module_name>

# Global Dependencies that Must be installed inorder to run and compile project successfully
1. typescript
2. yarn
3. nodemon
4. concurrently
5. webpack
6. webpack-cli

# To Run project on local machine use following command
# Note It compile and run project in auto-reload mode by detecing changed
1. npm run dev

# To Transpile Only use following command at the root of the project
1. tsc --watch

# To run the project in auto-reload mode use following mode
1. nodemon ./build/index.js
# If we don't want to auto-reload use following command
1. node ./build/index.js


# Config Loading
1. If vault is enabled it uses following supported vaults for configuration management
   - Hashicorp Vault
   - AWS Secret Manager

2. If Vault is disabled it uses .env.json file for configurations

## Sample Config
{
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
        }


# FUTURE WORKS
1. We may imlement wrapper of rabbitMQ "https://www.npmjs.com/package/rascal" if occur problems with native protocol implementation

# Generate Module
1. Run this command
 "node bin/index.js add ModuleName ts"
 
# Remove Generated Module
 1. Run this command
  "node bin/index.js remove ModuleName ts"





