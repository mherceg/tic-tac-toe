import log from "loglevel";
import { IOpponent } from ".";
import { IGame, Move } from "../model";
import { available_moves, my_symbol } from "./utils";


export default class RandomOpponent implements IOpponent{
    move(game: IGame): IGame {

        log.debug("Random opponent making a move");

        let me = my_symbol(game.lastMove);

        let available = available_moves(game);
        let selected = available[Math.floor(Math.random() * available.length)];
        log.debug(`Selected move ${selected}`);
        game.move(new Move(selected[0], selected[1], me), true);

        return game;
    }

}