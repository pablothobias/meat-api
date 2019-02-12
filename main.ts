//script principal que starta a aplicacao

import { Server } from './server/server';
import { usersRouter } from './users/users.router';
import { mainRouter } from './main.router';
import { restaurantsRouter } from './restaurants/restaurants.router';
import { reviewsRouter } from './reviews/reviews.router';

const server = new Server();

//método que inicializa as rotas do servidor
server.bootstrap([
    mainRouter,
    usersRouter,
    restaurantsRouter,
    reviewsRouter
]).then((server) => {

    console.log(`Server is listening on: ${server.application.address()}`);
}).catch(error => {

    console.log('Server failed to start');
    console.error(error);
    process.exit(1); //o um indica que a saída foi anormal
})