import { randomUUID } from "crypto";
import Game from "../model";
import model, { IGame } from "../model";
import { IStorage } from "./interface";


export default class SimpleStorage implements IStorage{
    games: Map<string, Game>;

    constructor(){
        this.games = new Map<string, Game>();
    }
    get_game(key: string): Game {
        return this.games[key];
    }
    get_all_games(): Game[] {
        return Array.from(this.games.values());
    }

    add_game(game: Game): void {
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