import {Session} from "express-session";
import { ITowersGame, IMinesGame } from "../socket/types";


export interface ISession extends Session {
    towers: ITowersGame | undefined;
    mines: IMinesGame | undefined;
}