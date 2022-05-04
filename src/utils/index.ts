import log from "loglevel"

export function createAndFillTwoDArray(
    rows: number,
    columns: number,
    defaultValue: any
  ): any[][]{
    log.trace(`Creating 2d array of size ${rows}x${columns} filled with ${defaultValue}`);
    if (rows < 0 || columns < 0){
        throw RangeError("Rows and columns must be positive numbers");
    }
    return Array.from({ length:rows }, () => (
        Array.from({ length:columns }, ()=> defaultValue)
     ))
  }

export const subscriptions = {
  GAMES: () => "GAMES",
  JOIN_GAME: (id: string) =>  `JOIN GAME ${id}`,
  RESULTS: () => "RESULTS",
}