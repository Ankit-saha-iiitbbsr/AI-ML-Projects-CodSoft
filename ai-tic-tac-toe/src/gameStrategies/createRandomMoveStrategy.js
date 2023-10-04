import { Symbols } from '../helpers/constants.js';

export default function createRandomMoveStrategy () {
    const name = 'RandomMoveStrategy';

    function findBestMove(cells) {
        const avaliabePositions = cells.map((cell, index) => {return cell === Symbols.EMPTY ? index : null}).filter(cell => cell !== null)
        const bestMoveIndex = avaliabePositions[Math.floor(Math.random() * avaliabePositions.length)]
        return bestMoveIndex;
    }
    return {
        name,
        findBestMove,
    }
}
