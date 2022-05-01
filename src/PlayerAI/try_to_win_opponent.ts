import { IOpponent } from ".";
import model from "../model";


export default class TryToWinOpponent implements IOpponent{
    move(game: model): model {
        throw new Error("Method not implemented.");
    }

}