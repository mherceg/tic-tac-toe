# tic-tac-toe
Please bear in mind this is the author's first node.js project ever

## Installation & running
> npm install
> npm run prod

Admin permissions required to run prod (starts on port 80)

> npm run dev

Running in dev mode produces more logging information and doesn't require admin permissions, you can set the `PORT` environment variable to define port, runs on port `4000` by default.

## API description
### Query
`games` - returns information about all the games

`get_history(id)`- returns the history of moves for a game
### Mutation
`create_game(opponent)`- creates new game. Possible opponents "easy"/"medium"/"hard"/"multiPlayer". Returns game id.

`move(id, x, y, p)`- creates a new move in game with given id. p is "X"/"O". Returns game id.

`opponent_start(id)`- if the game is played against the AI asks the AI to make the first move.
### Subscription
`game_created`- Publishes all newly created games

`join_game(id)`- Publishes all the moves done on game with given id

`results`- Publishes an update each time game has a winner

I wasn't able to run and test subscriptions yet, hopefully a simple setup error I'm unable to debug.

## Project layout
[`graphql.ts`](https://github.com/mherceg/tic-tac-toe/blob/main/src/graphql.ts) - Graphql schema & resolvers

[`storage`](https://github.com/mherceg/tic-tac-toe/tree/main/src/storage) - Storage interface definition and most basic in-memory implementation

[`model`](https://github.com/mherceg/tic-tac-toe/blob/main/src/model/index.ts) - Defines game logic

[`PlayerAi`](https://github.com/mherceg/tic-tac-toe/tree/main/src/PlayerAI) - 3 levels of Player AI, try to beat them all

"Hard player AI" taken from [npm](https://www.npmjs.com/package/tic-tac-toe-minimax-engine)