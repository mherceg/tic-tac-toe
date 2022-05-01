import Game from "../model";

export interface IOpponent{
    move(game: Game): Game,
}