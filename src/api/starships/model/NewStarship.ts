import { Starship } from "./Starship";

export interface NewStarship extends Omit<Starship, "id" | "createdAt"> {}