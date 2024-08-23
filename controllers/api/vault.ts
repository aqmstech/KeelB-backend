const express = require('express');
const routes = express.Router();
import { Application } from '../../app';
import { Vault } from '../../databases/vault';
import { Sentry } from '../../server/sentry';
import * as AWS from '@aws-sdk/client-secrets-manager';
import * as AWSCred from '@aws-sdk/credential-providers';
import { SecretsManagerClientConfig } from '@aws-sdk/client-secrets-manager';

routes.get('/get-vault-data', async (req: any, res: any) => {
  try {
    let data = await Vault.GetVaultData();
    res.status(200).send(data);
  } catch (error) {
    let err: any = error;
    Sentry.Error(err.toString(), 'Error in get vault data');
  }
});

routes.get('/update-vault-data', async (req: any, res: any) => {
  try {
    let data: any = await Vault.UpdateVaultData();
    Application.conf = data;
    res.status(200).send(Application.conf);
  } catch (error) {
    let err: any = error;
    Sentry.Error(err.toString(), 'Error in get updated vault data');
    console.log(error);
  }
});

routes.get('/insert-aws-vault-data', async (req: any, res: any) => {
  try {
    console.log('INSERTING VAULT DATA');

    let temp = {
      APIKEYS: {
      
      },
      AWS: {
        s3: {
          access_key_id: '',
          region: 'us-east-1',
          secret_access_key: '',
        },
        ses: {},
        sns: {},
        sqs: {},
      },
      DB: {
        Mongo: {
          default: {
            auth: {
              password: '',
              username: '',
            },
            dbname: 'local',
            host: '',
            port: 27017,
          }
        },
        psql: {},
        solr: {},
      },
      ENCRYPTION: {
        iv: 'wNQziAIIu1Lx52Y',
        salt: 'AH0zT?l3ic+HdEArBJMm_//1.i/s89ZF',
      },
      ENV: 'local',
      FCM: {},
      Logging: {
        SENTRY: {
          dsn: '',
          minidump_endpoint: '',
          security_header_endpoint: '',
        },
      },
      RABBITMQ: {
        host: '',
        password: '',
        port: 5671,
        protocol: 'amqp',
        user: '',
      },
      REDIS: {
        LivePush: {},
      },
      SALTS: {
        mobile_salt: '695ddccd984217fe8d79858dc485b67d66489145afa78e8b27c1451b27cc7a2b',
      },
      SMTP: {
        GMAIL: {
          auth: {
            pass: '',
            user: '',
          },
          host: '',
          port: 2525,
        }
      },
    };

    let aws = new AWS.SecretsManager({
      credentials: {
        accessKeyId: '',
        secretAccessKey: '',
      },
      region: 'us-east-1',
    });
    console.log('AWS INITIALIZED');
    let result = await aws.createSecret({
      Name: 'APPCONFIG_LOCAL',
      SecretString: JSON.stringify(temp),
    });
    console.log('INSERTED AWS VAULT DATA');
    res.status(200).send(result);
  } catch (error) {
    let err: any = error;
    Sentry.Error(err.toString(), 'Error in get vault data');
    res.status(500).send(err.toString());
  }
});

routes.get('/update-aws-vault-data', async (req: any, res: any) => {
  try {
    console.log('INSERTING VAULT DATA');

    let temp = {
      APIKEYS: {
        stardusttoken: 'rUmGK7ylidTfYppiM1eVaMZrPgWLSG99MYn5gUDc',
        stardusturl: 'https://opzvmjx033.execute-api.us-east-1.amazonaws.com/v1',
      },
      AWS: {
        s3: {
          access_key_id: 'AKIA4FZ7OUV5PNUUR4NM',
          region: 'us-east-2',
          secret_access_key: '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',
          bucket: 'tfl-newproduction',
          folder: 'local',
        },
        ses: {},
        sns: {},
        sqs: {},
      },
      DB: {
        Mongo: {
          marketplace: {
            auth: {
              password: 'Cubix@123#$$',
              username: 'taunt-test-user',
            },
            dbname: 'marketplace',
            host: 'localhost',
            port: 27017,
          },
          taunt: {
            auth: {
              password: 'Cubix@123#$$',
              username: 'taunt-test-user',
            },
            dbname: 'taunt-users',
            host: 'localhost',
            port: 27017,
          },
          uploading: {
            auth: {
              password: 'Cubix@123#$$',
              username: 'taunt-test-user',
            },
            dbname: 'uploading',
            host: 'localhost',
            port: 27017,
          },
        },
        psql: {},
        solr: {},
      },
      ENCRYPTION: {
        iv: 'wNQziAIIu1Lx52YY',
        salt: 'AH0zT?l3ic+HdEArBJMm_//1.i/s89ZF',
      },
      ENV: 'local',
      FCM: {},
      Logging: {
        SENTRY: {
          dsn: 'https://20410c3c97b54b328e4672bae053a3c6@o1008261.ingest.sentry.io/6250800',
          minidump_endpoint: 'https://o1008261.ingest.sentry.io/api/5972038/minidump/?sentry_key=2ab3cf90ae524106bdfdf142a93f7eba',
          security_header_endpoint: 'https://o1008261.ingest.sentry.io/api/5972038/security/?sentry_key=2ab3cf90ae524106bdfdf142a93f7eba',
        },
      },
      RABBITMQ: {
        host: 'localhost',
        password: 'cubix@123',
        port: 5672,
        protocol: 'amqp',
        user: 'tfl',
      },
      REDIS: {
        LivePush: {},
      },
      SALTS: {
        mobile_salt: '695ddccd984217fe8d79858dc485b67d66489145afa78e8b27c1451b27cc7a2b',
      },
      SMTP: {
        GMAIL: {
          auth: {
            pass: '916f9835ce6537',
            user: '68a32b1796f2b2',
          },
          host: 'smtp.mailtrap.io',
          port: 2525,
        },
        MAILCHIMP: {
          auth: {
            pass: '916f9835ce6537',
            user: '68a32b1796f2b2',
          },
          host: 'smtp.mailtrap.io',
          port: 2525,
        },
      },
    };

    let creds: SecretsManagerClientConfig =
      global.environment == 'local' || global.environment == 'staging'
        ? {
            credentials: AWSCred.fromIni({ profile: '' }),
          }
        : {};
    let aws = new AWS.SecretsManager(creds);
    let result = await aws.updateSecret({
      SecretId: 'APPCONFIG_LOCAL',
      SecretString: JSON.stringify(temp),
    });
    res.status(200).send(result);
  } catch (error) {
    let err: any = error;
    Sentry.Error(err.toString(), 'Error in get vault data');
    res.status(500).send(err.toString());
  }
});


export const router = routes;
