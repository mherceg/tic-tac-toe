import log from "loglevel";

export enum Player {
    X = 'X',
    O = 'O'
}

export enum Opponent {
    singlePlayer,
    easy,
    medium,
    hard
}

export interface IGame {
    // N = number of rows, M = number of columns
    N: number,
    M: number,
    last_move: Player,
    winner: Player,
    isFinished: boolean,
    opponent: Opponent,

    hasWinner(): Player | null,
    // move returns the winner if the player has won in this move, null otherwise
    move(x: number, y:number, player:Player): Player | null
}

export default class Game implements IGame{
    public id!: number;
    private elements: Player[][];
    public N: number;
    public M: number;
    public last_move: Player;
    public winner: Player;
    public isFinished: boolean;
    opponent: Opponent;

    constructor(id: number, N: number = 3, M: number = 3){
        log.info(`New game created with ${id}`);
        this.id = id;
        this.N = N;
        this.M = M;
        this.isFinished = false;
    }

    hasWinner(): Player | null{
        throw new Error("Method not implemented.");
    }
    move(x: number, y: number, player: Player): Player {
        throw new Error("Method not implemented.");
    }

    private check_winner(x:number, y:number): Player | null{
        throw new Error("Method not implemented.");
    }
    
}