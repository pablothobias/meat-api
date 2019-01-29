import * as restify from 'restify';
import * as mongoose from 'mongoose';
import { environment } from '../common/environment';
import { Router } from '../common/router';

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
                    version: '1.0.0'
                });

                this.application.use(restify.plugins.queryParser()); //transforma as querys em json
                this.application.use(restify.plugins.bodyParser()); //transforma o body da request em json

                // ===routes===:
                for (let router of routers) {

                    router.applyRoutes(this.application);
                }

                this.application.listen(environment.server.port, () => {

                    resolve(this.application);
                });
            } catch (error) {

                reject(error);
            }
        });
    }

    bootstrap(routers: Router[] = []): Promise<Server> {

        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this));
    }
}