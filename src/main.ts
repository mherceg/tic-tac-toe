import log from "loglevel";
import Game, { Opponent, Move, Player } from "./model";
import { IStorage } from "./storage/interface";
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { subscriptions } from "./utils";
import { PubSub } from "graphql-subscriptions";

var cors = require('cors')
const { gql } = require('apollo-server');
const pubsub = new PubSub();

const typeDefs = gql`
    type Query {
        game_ids: [ID]
        games: [Game]
        get_history(id: String): [Move]
    }
    type Mutation {
        create_game(opponent: String): String
        move(id: String, x: Int, y: Int, p: String): String
        opponent_start(id: String): String
    }
    type Subscription {
        game_created: String
        join_game: Move
        results: String
    }
    type Game {
        id: String
        size: Int
        opponent: String
        lastMove: String
        isFinished: Boolean
        moves: [Move]
        elements: [[String]]
    }
    type Move {
        x: Int
        y: Int
        player: String
    }
`;

const main = async(storage: IStorage, port: number) => {

    let game = new Game(storage.get_id(), Opponent.medium);
    storage.add_game(game);
    console.log(game.move(new Move(1, 1, Player.X)));
    console.log(game.moves);
    // console.log(game.move(new Move(0, 0, Player.X)));
    // console.log(game.moves);
    // console.log(game.move(new Move(1, 2, Player.X)));
    // console.log(game.moves);

    const resolvers = {
        Query: {
            game_ids(){
                log.info("Requested game ids");
                return storage.games.keys();
            },
            games(){
                log.info("Games requested");
                log.trace(storage.games);
                return storage.games.values();
            },
            get_history(parent, args){
                log.info(`History requested for id ${id}`);
                var id = args["id"];
                let game = storage.get_game(id);
                return game.moves;
            }
        },
        Mutation: {
            create_game(parent, args){
                var opponent = args["opponent"];
                log.debug(`Creating game ${opponent}`);
                var opp = Opponent.multiPlayer;
                if (opponent == "easy" || opponent == "1") {
                    opp = Opponent.easy;
                } else if (opponent == "medium" || opponent == "2") {
                    opp = Opponent.medium;
                } else if (opponent == "hard" || opponent == "3"){
                    opp = Opponent.hard;
                }
                let game = new Game(storage.get_id(), opp);
                storage.add_game(game);
                pubsub.publish("GAMES", {game_created: game.id});
                return game.id;
            },
            move(parent, args){
                var id = args["id"];
                var x = args["x"];
                var y = args["y"];
                var p = args["p"];
                var game = storage.get_game(id);
                var player: Player;
                if (p === "X"){
                    player = Player.X;
                } else if (p === "O"){
                    player = Player.O;
                }
                game.move(new Move(x, y, player));
                return id;
            },
            opponent_start(parent, args){
                var id = args["id"];
                log.info(`Opponent start requested for ${id}`);
                var game = storage.get_game(id);
                game.opponent_start();
            }
        },
        Subscription: {
            game_created: {
                subscribe: () => {
                    log.info("Subscribed to games");
                    return pubsub.asyncIterator(subscriptions.GAMES());
                }
            },
            join_game: {
                subscribe: (parent, args) => {
                    let id = args.get('id');
                    log.info(`Subscribed to game ${id}`)
                    return pubsub.asyncIterator(subscriptions.JOIN_GAME(id));
                }
            },
            results: {
                subscribe: () => {
                    log.info("subscribed to results");
                    return pubsub.asyncIterator(subscriptions.RESULTS());
                }
            }
        }
    }

    var app = express();
    app.use(cors());
    app.set("port", port);
    const httpServer = createServer(app);
    // app.use('/graphql', graphqlHTTP({
    //     schema: schema,
    //     rootValue: rootValue,
    //     graphiql: true,
    // }));
    // app.listen(port);
    // log.info(`Running a GraphQL API server at http://localhost:${port}/graphql`);
    const schema = makeExecutableSchema({typeDefs, resolvers});
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
        console.log(
            `Server is now running on http://localhost:${port}${server.graphqlPath}`,
        );
    });
}

export default main;
