import * as fs from 'fs';

import * as restify from 'restify';
import * as mongoose from 'mongoose';

import { environment } from '../common/environment';
import { Router } from '../common/router';
import { mergePatchBodyParser } from './merge-patch.parser';
import { handleError } from './error.handler';

import { tokenParser } from '../security/token.parser';

export class Server {

    application: restify.Server;

    initializeDb(): mongoose.MongooseThenable {
        //para usar a promise no mongoose
        (<any>mongoose).Promise = global.Promise;
        //url da constante do banco  e opcoes de conxoes mongoose
        return mongoose.connect(environment.db.url, {
            useMongoClient: true
        });
    }

    initRoutes(routers: Router[]): Promise<any> {

        return new Promise((resolve, reject) => {

            try {

                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0',
                    certificate: fs.readFileSync('./security/keys/cert.pem'),
                    key: fs.readFileSync('./security/keys/key.pem')

                });

                this.application.use(restify.plugins.queryParser()); //transforma as querys em json
                this.application.use(restify.plugins.bodyParser()); //transforma o body da request em json
                this.application.use(mergePatchBodyParser); //usar o content type diferente no método patch
                this.application.use(tokenParser); //para transformar o token no padrão jwt "Bearer TOKEN"

                // ===routes===:
                for (let router of routers) {

                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, () => {

                    resolve(this.application);
                });

                this.application.on('restifyError', handleError);

            } catch (error) {

                reject(error);
            }
        });
    }

    bootstrap(routers: Router[] = []): Promise<Server> {

        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this));
    }

    shutdown() {

        return mongoose.disconnect().then(() => this.application.close());
    }
}