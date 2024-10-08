/**
 * Vault Library Tutorial Can be found from following link
 * https://www.npmjs.com/package/node-vault?source=post_page-----dc108cea0353----------------------
 * @NOTE: Using HashiCorp VaultDB for Centralizing and Securing Configs for Microservices
 *
 * @NOTE : We're keeping vault secrets in environments currently. But a better practice would be providing Vault configs and login tokens from
 * Deployment tool. We prefer Jenkins. This will be impleted later when CI/CD Pipeline wil ltake place. For reference check following Link
 * https://learn.hashicorp.com/tutorials/vault/pattern-approle?in=vault/recommended-patterns
 */
import * as vault from 'node-vault';
import { Application } from '../app';
import { APPCONFIG } from '../interfaces/appconfig';
import { Environment } from '../interfaces/environment';
import { Logger } from '../server/logger';


const jwt = require('jsonwebtoken');
import * as crypto from "crypto"
import pbkdf2 from "pbkdf2";
import * as AWS from "@aws-sdk/client-secrets-manager";
import { Sentry } from "../server/sentry";
import * as AWSCred from "@aws-sdk/credential-providers";
import { SecretsManagerClientConfig } from "@aws-sdk/client-secrets-manager";



export abstract class Vault {

    private static Instance: Vault;
    private static client: vault.client;
    public static conf: Environment;

    //@TODO WHEN FETCHING SALT FROM Application.conf?.ENCRYPTION.salt IT IS GIVING UNDEFINED ERROR MAYBE BECAUSE WE ARE FETCHING THAT BEFORE INTIALIZATION
    private static salt = 'AH0zT?l3ic+HdEArBJMm_//1.i/s89ZF'
    private static iv = 'wNQziAIIu1Lx52YY';

    public static async Init(conf: Environment, engine: 'hashicorp' | 'aws' | 'dotenv'): Promise<APPCONFIG> {
        try {

            let appConfig: any;
            this.conf = conf;
            switch (engine) {
                case 'hashicorp':
                    let vaultConf: vault.VaultOptions = {
                        apiVersion: conf.vault.apiversion,
                        endpoint: conf.vault.protocol + '://' + conf.vault.host,
                        token: conf.vault.login
                    }

                    this.client = vault.default(vaultConf);
                    appConfig = (await this.client.read(`kv/${conf.vault.keyname}`)).data;
                    break;

                case 'aws':
                    let creds: SecretsManagerClientConfig = (global.environment == 'local') ? {
                        credentials: AWSCred.fromIni({ profile: '' })
                    } : { region: '' }
                    let aws = new AWS.SecretsManager(creds);
                    let value: AWS.GetSecretValueCommandOutput = await aws.getSecretValue({
                        SecretId: conf.vault.keyname
                    })

                    // console.log(value.SecretString);
                    if (value.SecretString) appConfig = JSON.parse(value.SecretString);
                    console.log(appConfig);
                    break;

                default:
                    throw new Error("Unsupported Vault Config Type")
            }

            return appConfig as APPCONFIG;

        } catch (error: any) {
            Logger.Console(`Error in Initializing Vault : ${JSON.stringify(error)}`);
            throw error;
        }


    }


    public static async CheckConnection(conf: Environment) {
        try {
            let vaultConf: vault.VaultOptions = {
                apiVersion: conf.vault.apiversion,
                endpoint: conf.vault.protocol + '://' + conf.vault.host,
                token: conf.vault.login,
            };
            this.client = vault.default(vaultConf);
            // console.log(await this.client.health(), 'client for vault');
            let appConfig = await this.client.read(`kv/${conf.vault.keyname}`);
            // let appConfig = await this.client.list('kv/')
            // console.log(appConfig);
            // console.log(appConfig.data);
            return appConfig.data ? true : false;
        } catch (error: any) {
            Logger.Console(`Error in Initializing Vault : ${JSON.stringify(error)}`);
            return error;
        }
    }

    public static async GetVaultData() {
        let appConfig = await this.client.read(`kv/${Vault.conf.vault.keyname}`);
        return appConfig.data as APPCONFIG;
    }

    public static async UpdateVaultData() {
        let appConfig = await this.client.read(`kv/${Vault.conf.vault.keyname}`);
        return appConfig.data as APPCONFIG;
    }

    public static Encrypt(value: string) {
        console.log('jwt String ===> ', value);
        let algorithm = '';

        // generate 16 bytes of random data

        // protected data
        console.log('SALT=> ', Application.conf?.ENCRYPTION.salt);
        console.log('iv=> ', Application.conf?.ENCRYPTION.iv);

        // secret key generate 32 bytes of random data
        let Securitykey = Application.conf?.ENCRYPTION.salt || Vault.salt;
        let iv = Buffer.from(Application.conf?.ENCRYPTION.iv || Vault.iv);
        // the cipher function

        let cipher = crypto.createCipheriv(algorithm, Securitykey, iv);

        // encrypt the message
        // input encoding
        // output encoding
        let encryptedData = cipher.update(value, 'utf-8', 'hex');

        encryptedData += cipher.final('hex');
        // console.log("Encrypted message: " + encryptedData);

        return encryptedData;
    }

    public static async InserAWSVaultData(key: string, data: string) {
        try {
            console.log('Before AWS INITIALIZED');
            let creds: SecretsManagerClientConfig = (global.environment == 'local') ? {
                credentials: AWSCred.fromIni({ profile: 'tfl-secret' })
            } : {}
            let aws = new AWS.SecretsManager(creds);
            console.log('AWS INITIALIZED');
            let result = await aws.createSecret({
                Name: key,
                SecretString: JSON.stringify(data),
            });
            console.log('INSERTED AWS VAULT DATA');
            return result;
        } catch (error: any) {
            Sentry.Error(error, 'ERROR IN INSERTING VAULT');
            console.log(error);
            throw error;
        }
    }

    public static Decrypt(value: string) {
        // the decipher function
        let algorithm = 'aes-256-cbc';

        // generate 16 bytes of random data

        // protected data

        // secret key generate 32 bytes of random data
        // console.log(Application.conf?.ENCRYPTION.salt);
        // console.log(Application.conf?.ENCRYPTION.iv)

        let Securitykey = Application.conf?.ENCRYPTION.salt || Vault.salt;
        let iv = Buffer.from(Application.conf?.ENCRYPTION.iv || Vault.iv);

        let decipher = crypto.createDecipheriv(algorithm, Securitykey, iv);

        let decryptedData = decipher.update(value, 'hex', 'utf-8');

        decryptedData += decipher.final('utf8');
        return decryptedData;
        // console.log("Decrypted message: " + decryptedData);
    }

    public static VerifyHashedPassword(password: string, original: string) {
        //console.log(`Password: ${password},  originalPassword: ${original}`)
        let salt = Application.conf?.ENCRYPTION.salt || Vault.salt;

        let hash = pbkdf2
            .pbkdf2Sync(password, salt, 1, 32, 'sha256')
            .toString('hex');

        return hash === original ? true : false;
    }

    public static hashPassword(password: string) {
        let salt = Application.conf?.ENCRYPTION.salt || Vault.salt;

        let hash = pbkdf2.pbkdf2Sync(password, salt, 1, 32, 'sha256');
        return hash.toString('hex');
    }

}
