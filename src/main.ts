import log from "loglevel";
import Game, { Opponent, Move, Player } from "./model";
import { IStorage } from "./storage/interface";

var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
var express = require('express');

// `
//     type Query {
//         game_ids: [ID]
//         games: [Game]
//     },
//     type Mutation {
//         create_game(opponent: String) : Game
//     },
//     type Game {
//         id: String
//         moves: [Move]
//         board: [String]
//         size: Int
//         winner: String
//         opponent: String
//         last_move: String
//         is_finished: Boolean
//     }
// `

var schema = buildSchema(`
    type Query {
        game_ids: [ID]
        games: [Game]
        get_history(id: String): [Move]
    },
    type Mutation {
        create_game(opponent: String): String
        move(id: String, x: Int, y: Int, p: String): String
        opponent_start(id: String): String
    },
    type Game {
        id: String
        size: Int
        opponent: String
        lastMove: String
        isFinished: Boolean
        moves: [Move]
        elements: [[String]]
    },
    type Move {
        x: Int
        y: Int
        player: String
    }
`)

const main = async(storage: IStorage, port: number) => {

    let game = new Game(storage.get_id(), Opponent.medium);
    storage.add_game(game);
    console.log(game.move(new Move(1, 1, Player.X)));
    console.log(game.moves);
    console.log(game.move(new Move(0, 0, Player.X)));
    console.log(game.moves);
    console.log(game.move(new Move(1, 2, Player.X)));
    console.log(game.moves);

    var rootValue = {
        game_ids: () => {
            log.info("Requested game ids");
            return storage.games.keys();
        },
        games: () => {
            log.info("Games requested");
            log.trace(storage.games);
            return storage.games.values();
        },
        get_history: (args) => {
            log.info(`History requested for id ${id}`);
            var id = args["id"];
            let game = storage.get_game(id);
            return game.moves;
        },
        create_game: (args) => {
            log.debug(`Creating game ${opponent}`);
            var opponent = args["opponent"];
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
            return game.id;
        },
        move: (args) => {
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
        opponent_start: (args) => {
            var id = args["id"];
            log.info(`Opponent start requested for ${id}`);
            var game = storage.get_game(id);
            game.opponent_start();
        }
    };

    var app = express();
    app.use('/graphql', graphqlHTTP({
        schema: schema,
        rootValue: rootValue,
        graphiql: true,
    }));
    app.listen(port);
    log.info(`Running a GraphQL API server at http://localhost:${port}/graphql`);

}

export default main;