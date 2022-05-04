import log from "loglevel";
import Game, { Opponent, Move, Player } from "./model";
import { IStorage } from "./storage/interface";
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { getSchema } from "./graphql";

var cors = require('cors')

const main = async(storage: IStorage, port: number) => {

    let game = new Game(storage.get_id(), Opponent.medium);
    storage.add_game(game);
    console.log(game.move(new Move(1, 1, Player.X)));
    console.log(game.moves);
    // console.log(game.move(new Move(0, 0, Player.X)));
    // console.log(game.moves);
    // console.log(game.move(new Move(1, 2, Player.X)));
    // console.log(game.moves);

    var app = express();
    app.use(cors());
    app.set("port", port);
    const httpServer = createServer(app);
    const schema = getSchema(storage);
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    const serverCleanup = useServer({ schema }, wsServer);
    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
            async serverWillStart() {
                return {
                async drainServer() {
                    await serverCleanup.dispose();
                },
                };
            },
            },
        ],
    });

    await server.start();
    server.applyMiddleware({ app });
    httpServer.listen(port, () => {
        log.info(
            `Server is now running on http://localhost:${port}${server.graphqlPath}`,
        );
    });
}

export default main;
