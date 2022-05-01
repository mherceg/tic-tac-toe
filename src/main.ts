import Game, { Opponent, Move, Player } from "./model";
import { IStorage } from "./storage/interface";


const main = async(storage: IStorage) => {
    let game = new Game(4, Opponent.easy);
    console.log(game.move(new Move(1, 1, Player.X)));
    console.log(game.moves);
    // console.log(game.move(new Move()));
    // console.log(game.move(new Move()));
    // console.log(game.move(new Move()));
    // console.log(game.move(new Move()));
    // console.log(game.move(new Move()));
}

export default main;