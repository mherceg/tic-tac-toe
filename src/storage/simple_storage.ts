import model from "../model";
import { IStorage } from "./interface";


export default class SimpleStorage implements IStorage{
    games: model[];

}