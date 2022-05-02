import log from "loglevel";
import { IOpponent } from ".";
import model, { IGame, Move, Player } from "../model";
import { available_moves } from "./utils";


export default class TryToWinOpponent implements IOpponent{
    move(game: IGame): IGame {

        log.debug("Try to win opponent making a move");

        let me = game.last_move == Player.O ? Player.X : Player.O;

        let available = available_moves(game);
        log.trace(`Available moves ${available}`);

        //Try to win
        for (let position of available){
            let m = new Move(position[0], position[1], me);
            if (game.check_winner(m) === me) {
                log.debug(`Winning move found ${m}`);
                game.move(m, true);
                return game;
            }
        }

        //Try not to lose
        for (let position of available){
            let m = new Move(position[0], position[1], game.last_move);
            if (game.check_winner(m) === game.last_move) {
                log.debug(`Losing move found ${m}`);
                m.player = me;
                game.move(m, true);
                return game;
            }
        }

        //Random move
        let selected = available[Math.floor(Math.random() * available.length)];
        log.debug(`Selected move ${selected}`);
        game.move(new Move(selected[0], selected[1], me), true);

        return game;
    }
}