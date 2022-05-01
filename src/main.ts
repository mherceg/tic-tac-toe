import Game from "./model";
import { IStorage } from "./storage/interface";


const main = async(storage: IStorage) => {
    new Game(4);
}

export default main;