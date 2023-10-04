import { Symbols } from '../helpers/constants.js';
import { WinningCombinations } from '../helpers/constants.js';

export default function createMinimaxStrategy () {
    const name = 'MinimaxStrategy';

    let maximizingPlayerSymbol;
    let minimizingPlayerSymbol;

    function findBestMove(board, currentPlayerSymbol) {
        maximizingPlayerSymbol = currentPlayerSymbol;
        minimizingPlayerSymbol = getOpponentPlayerSymbol(currentPlayerSymbol);
        let bestVal = -1000;

        const positionsScores = getAvaliablePositions(board)
            .map(cellIndex => {
                board[cellIndex] = maximizingPlayerSymbol;
                const value = minimax(board, 0, false);
                bestVal = Math.max(bestVal, value);
                board[cellIndex] = Symbols.EMPTY;
                return { index: cellIndex, score: value };
            })
            .filter((position) => position.score === bestVal)
            .map(obj => ({ obj, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ obj }) => obj)

        return positionsScores[0]?.index;
    }

    function minimax(board, depth, isMaximizingPlayer) {
        
        let score = evaluate(board);
        
        // If Maximizer has won the game
        // return his/her evaluated score
        if (score === 10)
            return score - depth;
        
        // If Minimizer has won the game
        // return his/her evaluated score
        if (score === -10)
            return score - depth;
        
        // If there are no more moves and
        // no winner then it is a tie
        if (isMovesLeft(board) === false)
            return 0;

        
        if(isMaximizingPlayer) {
            let bestVal = -1000;
            const avaliablePositions = getAvaliablePositions(board);
            avaliablePositions.forEach(cellIndex => {
                board[cellIndex] = maximizingPlayerSymbol;
                const value = minimax(board, depth+1, false);
                bestVal = Math.max(bestVal, value);
                board[cellIndex] = Symbols.EMPTY;
            });
            return bestVal;
        } 
        else { // is minimizing player
            let bestVal = +1000;
            const avaliablePositions = getAvaliablePositions(board);
            avaliablePositions.forEach(cellIndex => {
                board[cellIndex] = minimizingPlayerSymbol;
                const value = minimax(board, depth+1, true);
                bestVal = Math.min(bestVal, value);
                board[cellIndex] = Symbols.EMPTY;
            });
            return bestVal;
        }
    }

    function evaluate(board) {
        for(let i = 0; i < WinningCombinations.length; i++) {
            const [ first, second, third ] = WinningCombinations[i];
            if (board[first] === board[second] && board[second] === board[third]) {
                if (board[first] === maximizingPlayerSymbol) {
                    return +10;
                } else if (board[first] === minimizingPlayerSymbol) {
                    return -10;
                }
            }
        }

        // Else if none of them have won then return 0
        return 0;
            
    }

    function getOpponentPlayerSymbol(currentPlayerSymbol) {
        return (currentPlayerSymbol === Symbols.X) ? Symbols.O : Symbols.X;
    }

    function getAvaliablePositions(board) {
        return board.map((cell, index) => {return cell === Symbols.EMPTY ? index : null}).filter(cell => cell !== null)
    }

    function isMovesLeft(board) {
        return board.some(cell => cell === Symbols.EMPTY);
    }

    return {
        name,
        findBestMove,
    }
}
