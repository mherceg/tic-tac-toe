import IGame from "../model"

export interface IStorage {
    games: Map<string, IGame>,
    scoreX: number,
    scoreY: number,

    get_id(): string,
    add_game(game: IGame): void,
    get_game(key: string): IGame,
    get_all_games(): IGame[]
}