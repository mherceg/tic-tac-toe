import Game, { Opponent, Move, Player } from "./model";
import { IStorage } from "./storage/interface";


const main = async(storage: IStorage) => {
    let game = new Game(4, Opponent.medium);
    console.log(game.move(new Move(1, 1, Player.X)));
    console.log(game.moves);
    console.log(game.move(new Move(0, 0, Player.X)));
    console.log(game.moves);
    console.log(game.move(new Move(1, 2, Player.X)));
    console.log(game.moves);
}

export default main;