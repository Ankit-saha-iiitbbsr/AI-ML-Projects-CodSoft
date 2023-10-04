import { GameStatus, RoundStatus, PlayerTypes, Symbols, WinningCombinations } from './helpers/constants.js';

export function createState(){
    return {
        statusGame: GameStatus.SETUP,
        maxRounds: 3,
        board: {
            boardSize: 3, // 3x3
            cells: [
                Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
                Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
                Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            ],
        },
        currentRound: {
            round: -1,
            currentPlayer: -1,
            statusRound: null,
        },
        scores: [
            // {
            //     winner: null, combination: [0, 1, 2],
            // },
            // {
            //     winner: null, combination: [0, 1, 2],
            // },
            // {
            //     winner: null, combination: [0, 1, 2],
            // },
        ],
        players: [
            { 
                name: '',
                type: null,
                symbol: Symbols.X,
            },
            { 
                name: '',
                type: null,
                symbol: Symbols.O,
            }
        ],
    };

};


export default function createLogic() {

    const state = createState();
    
    function switchPlayerTurn() {
        if(state.currentRound.statusRound !== RoundStatus.PLAYING) return false;

        // switch player
        state.currentRound.currentPlayer = (state.currentRound.currentPlayer + 1) % state.players.length;

        return true;
    }

    function setPlayers(player1, player2) {
        state.players[0].name = player1.name || 'player 1';
        state.players[0].type = player1.type || PlayerTypes.HUMAN;

        state.players[1].name = player2.name || 'player 2';
        state.players[1].type = player2.type || PlayerTypes.HUMAN;

        // console.log('[game] set players');
    }

    function resetGame() {
        state.statusGame = GameStatus.RUNNING;

        state.currentRound.round = -1;
        state.currentRound.currentPlayer = -1;
        state.currentRound.statusRound = null;

        state.scores = [];
    }
    
    function checkEndOfGame() {
        if(state.currentRound.round < state.maxRounds - 1) return false;

        // console.log('[game] End of game')
        state.statusGame = GameStatus.ENDED;
        return true;
    }

    function startNextRound() {
        if(state.statusGame === GameStatus.ENDED) return false;
        if(state.currentRound.round === state.maxRounds - 1) return false;
        if(state.currentRound.statusRound === RoundStatus.PLAYING) return false;

        state.board.cells = [
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        ];

        state.currentRound.round += 1;
        state.currentRound.currentPlayer = 0;
        state.currentRound.statusRound = RoundStatus.PLAYING;
        // console.log('[game] startNextRound');

        return true;
    }

    function move(playerIndex, cellIndex) {
        if(state.currentRound.statusRound !== RoundStatus.PLAYING) return;
        if(state.currentRound.currentPlayer !== playerIndex) return;
        if(state.board.cells[cellIndex] !== Symbols.EMPTY) return;

        // console.log(`[game] move p${playerIndex} to cell ${cellIndex}`)
        state.board.cells[cellIndex] = state.players[playerIndex].symbol;
    }

    function checkEndOfRound() {
        const combination = searchWinningCombination(state.players[state.currentRound.currentPlayer].symbol, state.board.cells);
        const hasEmptyCell = hasEmptyCells(state.board.cells);

        if(!combination && hasEmptyCell) {
            // round não acabou
            state.currentRound.statusRound = RoundStatus.PLAYING;
            return false;
        }

        // fim de round
        state.currentRound.statusRound = combination ? RoundStatus.WIN : RoundStatus.DRAW;
        // console.log(`[game] Status round: ${state.currentRound.statusRound}`);

        //contabiliza scores
        const winner = combination ? state.players[state.currentRound.currentPlayer].symbol : 'Draw';
        state.scores.push({ 
            winner, 
            combination: combination || [] 
        });

        return true;
    }

    // helper
    function searchWinningCombination(symbol, boardCells) {
        return WinningCombinations.find((combination) => 
            combination.every(index => boardCells[index] === symbol)
        );
    }

    // helper
    function hasEmptyCells(boardCells) {
        return boardCells.some(cell => cell === Symbols.EMPTY);
    }

    // helper
    function debugBoard(boardCells) {
        // console.log('[game]');
        // console.log(`${boardCells[0]} | ${boardCells[1]} | ${boardCells[2]}`);
        // console.log(`${boardCells[3]} | ${boardCells[4]} | ${boardCells[5]}`);
        // console.log(`${boardCells[6]} | ${boardCells[7]} | ${boardCells[8]}`);
    }

    function getState() {
        return state;
    }

    return {
        getState,
        setPlayers,
        resetGame,
        checkEndOfGame,
        startNextRound,
        checkEndOfRound,
        switchPlayerTurn,
        move,
    
        //helper functions
        searchWinningCombination,
        hasEmptyCells,
        debugBoard,
    }
}

