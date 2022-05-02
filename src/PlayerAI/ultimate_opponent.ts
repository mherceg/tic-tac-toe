import log from "loglevel";
import TicTacToeEngine, { Player as Fplayer } from "tic-tac-toe-minimax-engine";
import { IOpponent } from ".";
import { IGame, Move, Player } from "../model";


export default class UltimateOpponent implements IOpponent{
    move(game: IGame): IGame {
        log.debug("Ultimate opponent making a move");

        let me = game.last_move == Player.O ? Player.X : Player.O;

        const aigame = new TicTacToeEngine(Fplayer.PLAYER_ONE);
        for (let m of game.moves){
            aigame.makeNextMove(m.x, m.y);
        }

        let {x, y} = aigame.getBestMove();
        log.debug(`Selected move ${x}, ${y}`);

        game.move(new Move(x, y, me), true);

        return game;
    }

}