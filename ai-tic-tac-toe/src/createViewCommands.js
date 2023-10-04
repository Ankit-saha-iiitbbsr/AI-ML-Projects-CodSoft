import { Symbols, RoundStatus, PlayerTypes } from "./helpers/constants.js";

export default function createViewCommands(views) {

    function SETUP(command) {
        // console.log('[ui] SETUP');
        views.showStartScreen();
    }
    
    function START_ROUND(command) {
        // console.log('[ui] START_ROUND');
        const state = JSON.parse(JSON.stringify({...command.state}))

        // console.log('STARRRRRT', state)
        views.updateBoardInfo(state);

        const modelRoundScreen = {
            currentRound: state.currentRound.round + 1,
            maxRounds: state.maxRounds,
        };
        views.showRoundScreen(modelRoundScreen);
    }

    function UPDATE_BOARD(command) {
        const state = JSON.parse(JSON.stringify({...command.state}))
        // console.log('[UI] UPDATE BOARD', state);

        // Se o player que acabou de mover é um COMPUTER, dá um delay na exibição
        const lastPlayer = (state.currentRound.currentPlayer + 1) % state.players.length;
        if(state.players[lastPlayer].type == PlayerTypes.COMPUTER) {
            const delay = views.getUserPreferences().computerDelay;
            setTimeout(() => {
                // console.log('UPDATEEEEEEE COMPUTER AFTER ', delay)
                views.updateBoardInfo(state);
            }, delay);
        } else {
            views.updateBoardInfo(state);
        }
      
    }

    function END_ROUND(command) {
        // console.log('[ui] END ROUND');
        const state = JSON.parse(JSON.stringify({...command.state}))

        views.updateBoardInfo(state);

        const endRoundScreenModel = {
            text: state.currentRound.statusRound == RoundStatus.WIN ? `${state.players[state.currentRound.currentPlayer].name} won!` : 'Draw!',
        };
        views.showEndRoundScreen(endRoundScreenModel);
    }

    function END_GAME(command) {
        // console.log('[ui] END GAME');
        const state = JSON.parse(JSON.stringify({...command.state}))

        const endGameModel = {
            round: {
                // currentRound: state.currentRound.round + 1,
                maxRounds: state.maxRounds,
            },
            X: {
                name: state.players[0].name,
                symbol: state.players[0].symbol,
                points: state.scores.reduce((acc, val) => (val.winner == Symbols.X ? acc + 1 :  acc), 0 ),
            },
            O: {
                name: state.players[1].name,
                symbol: state.players[1].symbol,
                points: state.scores.reduce((acc, val) => (val.winner == Symbols.O ? acc + 1 :  acc), 0 ),
            },
            draws: {
                name: 'Draws',
                symbol: '',
                points: state.scores.reduce((acc, val) => (val.winner == 'Draw' ? acc + 1 :  acc), 0 ),
            },
        };
        views.showEndGameScreen(endGameModel);
    }

    return {
        SETUP,
        START_ROUND,
        UPDATE_BOARD,
        END_ROUND,
        END_GAME,
    }
}