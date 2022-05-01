import log from "loglevel";
import { mapping } from "../PlayerAI";
import { createAndFillTwoDArray } from "../utils";

export enum Player {
    X = 'X',
    O = 'O'
}

export enum Opponent {
    singlePlayer = 0,
    easy = 1,
    medium = 2,
    hard = 3
}

export class Move{
    player: Player;
    x: number;
    y: number;

    constructor(x: number, y: number, player: Player){
        this.x = x;
        this.y = y;
        this.player = player;
    }
}

export interface IGame {
    last_move: Player,
    size: number,
    winner: Player,
    isFinished: boolean,
    opponent: Opponent,
    moves: Move[],

    // move returns the winner if the player has won in this move, null otherwise
    move(m: Move, automatic: boolean | undefined): Player | null
}

export default class Game implements IGame{
    public id!: number;
    public size: number;
    private elements: Player[][];
    public last_move: Player;
    public winner: Player;
    public isFinished: boolean;
    public moves: Move[];
    opponent: Opponent;

    constructor(id: number, opponent: Opponent = Opponent.singlePlayer, size: number = 3){
        log.info(`New game created with id ${id} and size ${size}`);
        this.id = id;
        this.size = size;
        this.isFinished = false;
        this.moves = [];
        this.opponent = opponent;
        this.elements = createAndFillTwoDArray(size, size, null);
    }

    move(m: Move, automatic: boolean = false): Player {
        if (m.x < 0 || m.y < 0 || m.x >= this.size || m.y >= this.size){
            throw new RangeError(`Coordinates of the move have to be between 0 and ${this.size}`);
        }
        log.debug(m);
        this.moves.push(m);
        this.elements[m.x][m.y] = m.player;
        log.trace(this.elements);
        log.debug(this.moves);
        this.last_move = m.player;
        let winner = this.check_winner(m);
        log.trace(`Winner is ${winner}`);
        if (winner != null){
            this.isFinished = true;
            this.winner = winner;
        } else {
            if (!automatic && this.opponent != Opponent.singlePlayer){
                log.debug("Making an automated move");
                let opponent = new mapping[this.opponent]();
                opponent.move(this);
            }
        }
        return this.winner;
    }

    private check_winner(m: Move): Player | null{
        let DX = [-1, -1, 0, 1, 1, 1, 0, -1];
        let DY = [0, 1, 1, 1, 0, -1, -1, -1];

        for (let dir = 0;  dir < Math.floor(DX.length/2); ++dir){
            let count = 1;
            let x = m.x;
            let y = m.y;
            for (let d of [0, 4]){
                let dx = DX[(dir + d)%DX.length];
                let dy = DY[(dir + d)%DY.length];
                while (x >= 0 && y >= 0 && x < this.size && y < this.size){
                    if (this.elements[x][y] == m.player){
                        count++;
                    } else {
                        break;
                    }
                    x += dx;
                    y += dy;
                }
            }
            log.trace(`Direction ${dir}, count ${count}`);
            if (count == this.size){
                return m.player;
            }
        }

        return null;
    }
    
}