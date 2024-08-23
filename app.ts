import {DBConfig} from './configs/database';
import {LoggerConf} from './configs/logger';
import {HTTPServer} from './server/http';
import {Logger} from './server/logger';
import {APPCONFIG} from './interfaces/appconfig';
import {Environment} from './interfaces/environment';
import {Vault} from './databases/vault';
import {Sentry} from './server/sentry';
import * as ip from 'ip';
import {Utils} from './utils/utils';
import {RMQ} from './server/queues/rabbitmq';
import {DefaultDatabase} from './databases/database';
import {SQS} from './server/queues/sqs';
import {CronJobs} from './crons/cron';


// // Instead of:
// import sourceMapSupport from 'source-map-support'
// sourceMapSupport.install()

declare global {
    namespace NodeJS {
        interface Global {
            __rootdir__: string;
            servicename: string;
            ip: string;
            environment: string;
            defaultDB: boolean;
            logger: string;
            delayStart: number;
            __baseURL: string;
            __authURL: string;
            __faqURL: string;
            __templateURL: string;
        }
    }
}
global.__rootdir__ = process.cwd();

export class Application {
    public static conf: APPCONFIG;
    public static started: boolean = false;

    private httpServer!: HTTPServer;

    public async INIT(env: Environment, test: boolean = false, testDB: any = {}) {
        global.ip = ip.address();
        process.on('unhandledRejection', ex => {
            Logger.Log('Unhandled Rejection !!!!!', 'critical');
            Logger.Log(ex, 'critical');
            let err: any = ex;
            Sentry.Error(err as any, 'unhandledRejection in auth');
        });

        process.on('uncaughtException', ex => {
            console.log('Unhandled Exception', ex);
            Logger.Log('Uncaught Exception !!!!!', 'critical');
            Logger.Log(ex, 'critical');
            Sentry.Error(ex as any, 'uncaughtException in auth');
        });

        if (env.config.GracefullShutdown) {
            process.on('SIGINT', async code => {
                try {
                    if (!Application.started) process.exit(1);
                    await RMQ.Dispose();
                    HTTPServer.StopServer();
                } catch (error) {
                    Logger.Log(error, 'critical');
                    Sentry.Error(error as any, 'problem in SIGTERM EVENT occurs in LEAGUE service');
                    process.exit(1);
                }
            });

            process.on('SIGTERM', async () => {
                try {
                    if (!Application.started) process.exit(1);
                    await RMQ.Dispose();
                    HTTPServer.StopServer();
                    process.exit(1);
                } catch (error) {
                    Logger.Log(error, 'critical');
                    let err: any = error;
                    Sentry.Error(err as any, 'problem in SIGTERM EVENT occurs in LEAGUE service');
                    process.exit(1);
                }
            });
        }

        try {
            Logger.CreateLogger(LoggerConf.colors);
            global.servicename = env.config.ServiceName;
            global.environment = env.env;
            global.logger = env.logger;
            global.defaultDB = env.defaultDB;
            global.delayStart = env.delayStart;

            if (!env.config.ServiceName) throw new Error('Unknown Service Name');
            if (!env.config.PORT) throw new Error('Server Port Not Defined');

            if (env.config.VAULT) {
                if (!env.vault.host) throw new Error('Vault HOST Not Defined');
                if (!env.vault.port) throw new Error('Vault PORT Not Defined');
                if (!env.vault.keyname) throw new Error('Vault KeyName Not Defined');
                if (!env.vault.protocol) throw new Error('Vault Protocol Not Defined');
                if (!env.vault.login) throw new Error('Vault Login Not Defined');
            }

            if (!env.config.VAULT) {
                Application.conf = await Utils.LoadEnv();
                console.log('conf : ', Application.conf.DB);

                if (global.defaultDB) {
                    await DefaultDatabase.Connect(test ? testDB : Application.conf.DB.Mongo['default']);
                    CronJobs();
                }

                await Promise.all([]);
            } else {
                Application.conf = await Vault.Init(env as Environment, env.vault.configType);

                if (global.logger == 'sentry')
                    Sentry.INIT({
                        dsn: Application.conf.Logging.SENTRY.dsn,
                        environment: global.environment,
                        serverName: global.servicename,
                    });
                if (global.defaultDB) await DefaultDatabase.Connect(test ? testDB : DBConfig.dbconf.default);
            }

            if (global.delayStart) await Utils.Sleep(global.delayStart);

            global.__templateURL = env.config.services
                ? env.config.services['product'].protocol + '://' + env.config.services['product'].host + (env.config.services['product'].port ? ':' + env.config.services['product'].port : '')
                : '';

            if (env.config.QUEUE == 'rmq') await RMQ.INIT(Application.conf.RABBITMQ);
            if (env.config.QUEUE == 'aws') {
                Application.conf.AWS.sqs.queues.map(async (queue) => {
                    SQS.Queues[queue.name] = new SQS(Application.conf.AWS.sqs, queue.name, queue.url);
                });
            }

            this.httpServer = HTTPServer.INIT(env.config, test);
            Object.seal(this.httpServer);
            Logger.Console('Server Started : ', 'info');
            Application.started = true;
        } catch (error: any) {
            Logger.Console(error, 'error');
            Logger.Console('error in Initializing Application');
            Sentry.Error(error, `APP INIT ERROR ${env.config.ServiceName}`);
        }
    }
}

//sigint changes in index.ts & http.ts // left in team and matches
