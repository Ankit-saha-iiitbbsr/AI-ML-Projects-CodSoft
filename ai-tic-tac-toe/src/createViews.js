import { Symbols, PlayerTypes, RoundStatus } from "./helpers/constants.js";

export default function createViews(window, observable) {

    const userPreferences = {
        computerDelay: 3000,
    };

    const nodes = {};

    function buildStartScreen() {
        const template = document.querySelector('[data-template-start-screen]')
        nodes.startScreenEl = template.content.cloneNode(true).children[0];
        nodes.startScreenEl.querySelector('[data-start-screen__form-setup]').addEventListener('submit', handleFormSetupSubmit);
        // TODO refactor SELECT CHANGE
        // nodes.startScreenEl.querySelector('[data-start-screen__game-mode]').addEventListener('change', (e) => {
        //     const values = e.target.value.split(',');
        //     nodes.startScreenEl.querySelector('[data-start-screen__player1] input[name=start-screen__player1-type][type=hidden]').value = values[0];
        //     nodes.startScreenEl.querySelector('[data-start-screen__player2] input[name=start-screen__player2-type][type=hidden]').value = values[1];
        // });
        window.document.body.appendChild(nodes.startScreenEl);
    }

    function buildRoundScreen() {
        const template = document.querySelector('[data-template-round-screen]')
        nodes.roundScreenEl = template.content.cloneNode(true).children[0];
        nodes.roundScreenEl.addEventListener("animationend", () => showBoardScreen() );
        window.document.body.appendChild(nodes.roundScreenEl);
    }

    function buildBoardScreen() {
        const template = document.querySelector('[data-template-board-screen]')
        nodes.boardScreenEl = template.content.cloneNode(true).children[0];
        window.document.body.appendChild(nodes.boardScreenEl);

        nodes.scoreEl = nodes.boardScreenEl.querySelector('[data-board-screen__score]');
        nodes.hintEl = nodes.boardScreenEl.querySelector('[data-board-screen__hint]');
        nodes.boardContainerEl = nodes.boardScreenEl.querySelector('[data-board-screen__board-container]');
        nodes.boardEl =  nodes.boardScreenEl.querySelector('[data-board-screen__board]');
        nodes.cellsEl =  nodes.boardEl.querySelectorAll('[data-board-screen__cell]');

        nodes.cellsEl.forEach(cellEl => {
            cellEl.addEventListener('click', handleCellClick);
        });

        window.addEventListener('resize', handleResize);

    }

    function buildEndRoundScreen() {
        const template = document.querySelector('[data-template-end-round-screen]')
        nodes.endRoundScreenEl = template.content.cloneNode(true).children[0];
        nodes.endRoundScreenEl.addEventListener("animationend", startNextRound);
        window.document.body.appendChild(nodes.endRoundScreenEl);
    }

    function buildEndGameScreen() {
        const template = document.querySelector('[data-template-end-game-screen]')
        nodes.endGameScreenEl = template.content.cloneNode(true).children[0];
        nodes.endGameScoreEl = nodes.endGameScreenEl.querySelector('[data-end-game-screen__score]');
        nodes.endGameScreenEl.querySelector('[data-end-game-screen__restart]').addEventListener('click', () => showStartScreen() );
        window.document.body.appendChild(nodes.endGameScreenEl);
    }

    function buildAll() {
        // console.log('[screen] create all views')
        buildStartScreen();
        buildRoundScreen();
        buildBoardScreen();
        buildEndRoundScreen();
        buildEndGameScreen();
    }


    function showStartScreen(model) {
        // console.log('[screen] SHOW START SCREEN')
        nodes.endGameScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('animating');
        nodes.endRoundScreenEl.classList.remove('screen--show');
        nodes.endRoundScreenEl.classList.remove('animating');
        
        nodes.startScreenEl.classList.add('screen--show');
    }

    function showRoundScreen(model) {
        resetBoard();

        nodes.endRoundScreenEl.classList.remove('screen--show');
        nodes.endGameScreenEl.classList.remove('screen--show');

        nodes.startScreenEl.classList.remove('screen--show');

        nodes.roundScreenEl.querySelector('[data-round-screen__text]').innerText = `Round ${model.currentRound}/${model.maxRounds}`;
        nodes.roundScreenEl.classList.add('screen--show');
        nodes.roundScreenEl.classList.add('animating');

        // updateBoardInfo(model);
    }

    function showBoardScreen(model) {
        // console.log('[screen] show board screen')
        nodes.startScreenEl.classList.remove('screen--show');
        nodes.boardScreenEl.classList.add('screen--show');
        handleResize();

        nodes.roundScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('animating');
        nodes.endRoundScreenEl.classList.remove('screen--show');
        nodes.endRoundScreenEl.classList.remove('animating');
    }

    function showEndRoundScreen(model) {
        // console.log('[screen] showEndRound');
      
        nodes.endRoundScreenEl.querySelector('[data-end-round-screen__text]').innerText = model.text;
      
        nodes.endRoundScreenEl.classList.add('screen--show');
        nodes.endRoundScreenEl.classList.add('animating');

    }

    function showEndGameScreen(model) {
        nodes.endGameScoreEl.innerHTML = '';

        const roundCounterEl = document.createElement('h1');
        roundCounterEl.innerHTML = `Rounds: ${model.round.maxRounds}`;
        nodes.endGameScoreEl.appendChild(roundCounterEl);

        const xScoreEl = document.createElement('h1');
        xScoreEl.innerHTML = `${model.X.name} (${model.X.symbol}): ${model.X.points}`;
        nodes.endGameScoreEl.appendChild(xScoreEl);

        const oScoreEl = document.createElement('h1');
        oScoreEl.innerHTML = `${model.O.name} (${model.O.symbol}): ${model.O.points}`;
        nodes.endGameScoreEl.appendChild(oScoreEl);

        const drawScoreEl = document.createElement('h1');
        drawScoreEl.innerHTML = `${model.draws.name}: ${model.draws.points}`;
        nodes.endGameScoreEl.appendChild(drawScoreEl);

        nodes.endGameScreenEl.classList.add('screen--show');
        nodes.boardScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('animating');
        nodes.endRoundScreenEl.classList.remove('screen--show');
        nodes.endRoundScreenEl.classList.remove('animating');
    }


    function updateBoardInfo(model) {
        // console.log('[screen] set board info');

        const updateScoreModel = {
            round: {
                currentRound: model.currentRound.round + 1,
                maxRounds: model.maxRounds,
            },
            X: {
                name: model.players[0].name,
                symbol: model.players[0].symbol,
                points: model.scores.reduce((acc, val) => (val.winner == Symbols.X ? acc + 1 :  acc), 0 ),
            },
            O: {
                name: model.players[1].name,
                symbol: model.players[1].symbol,
                points: model.scores.reduce((acc, val) => (val.winner == Symbols.O ? acc + 1 :  acc), 0 ),
            },
            draws: {
                name: 'Draws',
                symbol: '',
                points: model.scores.reduce((acc, val) => (val.winner == 'Draw' ? acc + 1 :  acc), 0 ),
            },
        };

        updateScore(updateScoreModel);

        const updateBoardModel = {
            boardCells: model.board.cells,
            winnerCombination: model.scores[model.currentRound.round]?.combination,
        };
        updateBoard(updateBoardModel);

        const updatePlayerTurnModel = {
            isXTurn: model.currentRound.statusRound == RoundStatus.PLAYING && model.players[model.currentRound.currentPlayer].symbol === Symbols.X,
            isOTurn: model.currentRound.statusRound == RoundStatus.PLAYING && model.players[model.currentRound.currentPlayer].symbol === Symbols.O,
            isHumanTurn: model.currentRound.statusRound == RoundStatus.PLAYING && model.players[model.currentRound.currentPlayer].type === PlayerTypes.HUMAN,
            isComputerTurn: model.currentRound.statusRound == RoundStatus.PLAYING && model.players[model.currentRound.currentPlayer].type === PlayerTypes.COMPUTER,
            hintText: model.currentRound.statusRound == RoundStatus.PLAYING ? `${model.players[model.currentRound.currentPlayer].name}: your turn!` : '',
        };
        updatePlayerTurn(updatePlayerTurnModel);
    }

    function updateScore(model) {

        nodes.scoreEl.innerHTML = '';

        const roundCounterEl = document.createElement('h1');
        roundCounterEl.innerHTML = `Round: ${model.round.currentRound}/${model.round.maxRounds}`;
        nodes.scoreEl.appendChild(roundCounterEl);

        const xScoreEl = document.createElement('h1');
        xScoreEl.innerHTML = `${model.X.name} (${model.X.symbol}): ${model.X.points}`;
        nodes.scoreEl.appendChild(xScoreEl);

        const oScoreEl = document.createElement('h1');
        oScoreEl.innerHTML = `${model.O.name} (${model.O.symbol}): ${model.O.points}`;
        nodes.scoreEl.appendChild(oScoreEl);

        const drawScoreEl = document.createElement('h1');
        drawScoreEl.innerHTML = `${model.draws.name}: ${model.draws.points}`;
        nodes.scoreEl.appendChild(drawScoreEl);
    }

    function resetBoard() {
        // console.log('[screen] resetBoard');

        for(let i = 0; i < nodes.cellsEl.length; i++) {
            nodes.cellsEl[i].classList.add('board__cell--empty');
            nodes.cellsEl[i].classList.remove('board__cell--X');
            nodes.cellsEl[i].classList.remove('board__cell--O');
            nodes.cellsEl[i].classList.remove('board__cell--highlight');
        }
    }

    function updateBoard(model) {
        resetBoard();

        // console.log('[screen] updateBoard');

        for(let i = 0; i < model.boardCells.length; i++) {
            if(model.boardCells[i] == Symbols.EMPTY) {
                nodes.cellsEl[i].classList.add('board__cell--empty');
            } else {
                nodes.cellsEl[i].classList.remove('board__cell--empty');
                nodes.cellsEl[i].classList.add(`board__cell--${model.boardCells[i]}`);
            }   
            
            // nodes.cellsEl[i].classList.remove('board__cell--highlight');
        }

        if(model.winnerCombination) {
            model.winnerCombination.forEach(cellIndex => {
                nodes.cellsEl[cellIndex].classList.add('board__cell--highlight');
            });
            // console.log('[screen] winning combination', model.winnerCombination)
        }
    }
    
    function updatePlayerTurn(model) {
        // console.log('[screen] updatePlayerTurn ');

        nodes.boardEl.classList.toggle('turn--X', model.isXTurn);
        nodes.boardEl.classList.toggle('turn--O', model.isOTurn);

        nodes.hintEl.innerHTML = model.hintText;

        nodes.boardEl.classList.toggle('board--human-turn', model.isHumanTurn);
        nodes.boardEl.classList.toggle('board--computer-turn', model.isComputerTurn);
        
        // if(model.isRoundEnded) {
        //     nodes.boardEl.classList.remove('board--human-turn');
        // }
    }

    function move(playerIndex, cellIndex) {
        // console.log('[screen] move');

        observable.notifyAll({ 
            id: 'MOVE', 
            playerIndex,
            cellIndex,
        });
    }

    function setup(player1, player2, preferencesComputerDelay) {
        userPreferences.computerDelay = preferencesComputerDelay;
        // console.log('[screen] set players');
        observable.notifyAll({ 
            id: 'SETUP', 
            player1, 
            player2,
            // preferences: {
            //     computerDelay: preferencesComputerDelay,
            // },
        });
    }

    function startNextRound() {
        // console.log('[screen] start next round')
        observable.notifyAll({
            id: 'START_NEXT_ROUND'
        });
    }

    // helpers

    function handleFormSetupSubmit(e) {
        e.preventDefault();

        const preferencesComputerDelay = +nodes.startScreenEl.querySelector('[data-start-screen__preferences-computer-delay]').value;

        const values = nodes.startScreenEl.querySelector('[data-start-screen__game-mode]').value.split(',');

        const player1 = {
            name: nodes.startScreenEl.querySelector('[data-start-screen__player1-name]').value || 'player 1',
            type: values[0],
        };

        const player2 = {
            name: nodes.startScreenEl.querySelector('[data-start-screen__player2-name]').value || 'player 2',
            type: values[1],
        };

        setup(player1, player2, preferencesComputerDelay);
    }

    function handleCellClick(e) {
        // TODO refactor use data-current-player
        const currentPlayerIndex = nodes.boardEl.classList.contains('turn--X') ? 0 : 1;
        const cellIndex = e.target.dataset?.boardScreen__cell;

        move(currentPlayerIndex, cellIndex);
    }

    function handleResize(e) {
        const side = Math.min(nodes.boardContainerEl.offsetWidth, nodes.boardContainerEl.offsetHeight);

        nodes.boardEl.style.width = side + 'px';
        nodes.boardEl.style.height = side + 'px';
    }

    function getUserPreferences() {
        return userPreferences;
    }

    return {
        buildStartScreen,
        buildRoundScreen,
        buildBoardScreen,
        buildEndRoundScreen,
        buildEndGameScreen,
        buildAll,

        showStartScreen,
        showRoundScreen,
        showBoardScreen,
        showEndRoundScreen,
        showEndGameScreen,

        setup,
        resetBoard,
        updateBoardInfo,
        updateBoard,
        updateScore,
        move,
        updatePlayerTurn,
        startNextRound,

        handleFormSetupSubmit,
        handleCellClick,
        handleResize,
        getUserPreferences,
    }
}