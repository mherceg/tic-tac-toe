import log from "loglevel";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { subscriptions } from "./utils";
import { PubSub } from "graphql-subscriptions";
import Game, { Move, Opponent, Player } from "./model";
const { gql } = require('apollo-server');
const pubsub = new PubSub();

export function getSchema(storage){
    const typeDefs = gql`
        type Query {
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
            join_game(id: String): Move
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

    const resolvers = {
        Query: {
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
                pubsub.publish(subscriptions.GAMES(), {game_created: game.id});
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
                } else {
                    throw new RangeError("Player must be X or O");
                }
                let previous_moves = game.moves.length;
                game.move(new Move(x, y, player));
                if (game.isFinished){
                    if (game.winner === Player.X){
                        storage.scoreX++;
                    } else {
                        storage.scoreY++;
                    }
                    pubsub.publish(subscriptions.RESULTS(), `Score X:Y ${storage.scoreX}:${storage.scoreY}`);
                }
                for (let i = previous_moves; i < game.moves.length; ++i){
                    pubsub.publish(subscriptions.JOIN_GAME(game.id), game.moves[i]);
                }
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

    return makeExecutableSchema({typeDefs, resolvers});
}