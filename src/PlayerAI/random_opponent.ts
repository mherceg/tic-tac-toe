import log from "loglevel";
import { IOpponent } from ".";
import Game, { IGame, Move } from "../model";
import { Player } from "../model";
import { available_moves } from "./utils";


export default class RandomOpponent implements IOpponent{
    move(game: IGame): IGame {

        log.debug("Random opponent making a move");

        let me = game.last_move == Player.O ? Player.X : Player.O;

        let available = available_moves(game);
        log.trace(`Available moves ${available}`);
        let selected = available[Math.floor(Math.random() * available.length)];
        log.debug(`Selected move ${selected}`);
        game.move(new Move(selected[0], selected[1], me), true);

        return game;
    }

}