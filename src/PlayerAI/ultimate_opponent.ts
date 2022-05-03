import log from "loglevel";
import TicTacToeEngine, { Player} from "tic-tac-toe-minimax-engine";
import { IOpponent } from ".";
import { IGame, Move } from "../model";
import { my_symbol } from "./utils";


export default class UltimateOpponent implements IOpponent{
    move(game: IGame): IGame {
        log.debug("Ultimate opponent making a move");

        let me = my_symbol(game.lastMove);

        const aigame = new TicTacToeEngine(Player.PLAYER_ONE);
        for (let m of game.moves){
            aigame.makeNextMove(m.x, m.y);
        }

        let {x, y} = aigame.getBestMove();
        log.debug(`Selected move ${x}, ${y}`);

        game.move(new Move(x, y, me), true);

        return game;
    }

}