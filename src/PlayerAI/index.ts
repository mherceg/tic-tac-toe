import { Opponent, IGame } from "../model";
import RandomOpponent from "./random_opponent";
import TryToWinOpponent from "./try_to_win_opponent";
import UltimateOpponent from "./ultimate_opponent";

export interface IOpponent{
    move(game: IGame): IGame,
}

export let mapping = {
    1: RandomOpponent,
    2: TryToWinOpponent,
    3: UltimateOpponent
}