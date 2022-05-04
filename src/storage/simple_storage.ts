import { randomUUID } from "crypto";
import Game from "../model";
import model, { IGame } from "../model";
import { IStorage } from "./interface";


export default class SimpleStorage implements IStorage{
    games: Map<string, Game>;
    scoreX: number;
    scoreY: number;

    constructor(){
        this.games = new Map<string, Game>();
        this.scoreX = 0;
        this.scoreY = 0;
    }
    get_game(key: string): Game {
        if (!this.games.has(key)){
            throw new RangeError(`Game with id "${key}" doesn't exist`);
        }
        return this.games.get(key);
    }
    get_all_games(): Game[] {
        return Array.from(this.games.values());
    }

    add_game(game: Game): void {
        if (this.games.has(game.id)){
            throw new RangeError(`Game with id "${game.id}" already exists in storage`);
        }
        this.games.set(game.id, game);
    }

    public get_id(): string{
        var uuid: string;
        do {
            uuid = randomUUID();
        } while (this.games[uuid] !== undefined);
        return uuid;
        
    }

}