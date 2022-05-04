import { IGame, Player } from "../model";
import { createAndFillTwoDArray } from "../utils";

class point{
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        
    }
}

//Inneficient implementation, O(size^2) time & space complexity. Make sure to improve if using larger boards.
export function available_moves(game: IGame): [number, number][] {

    let available = createAndFillTwoDArray(game.size, game.size, true);

    for (let m of game.moves){
        available[m.x][m.y] = false;
    }
    let ret : [number, number][] = new Array<[number, number]>();
    for (let i = 0; i < game.size; ++i){
        for (let j = 0; j < game.size; ++j){
            if (available[i][j]){
                ret.push([i,j]);
            }
        }
    }
    return ret;
}

export function my_symbol(last_move: Player) : Player{
    return last_move == Player.O ? Player.X : Player.O;
}