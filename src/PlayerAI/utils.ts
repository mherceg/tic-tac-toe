import { IGame } from "../model";

export function available_moves(game: IGame): [number, number][] {

    let available = new Set<[number,number]>();

    console.log("size", game.size);
    for (let i = 0; i < game.size; ++i){
        for (let j = 0; j < game.size; ++j){
            available.add([i,j]);
        }
    }
    for (let m of game.moves){
        available.delete([m.x, m.y]);
    }

    return Array.from(available);
}