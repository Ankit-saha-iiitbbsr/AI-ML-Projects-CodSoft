import {expect} from 'chai';
import createViews from '../src/createViews.js';

function createObservableSpy() {
    const params = {
        history: {
            notifyAll: [],
        },
    };

    function notifyAll(command) {
        params.history.notifyAll.push(command);
    }

    return {
        params,
        notifyAll,
    }

}


describe('Views observers', function() {

    let observableSpy;

    describe('#move()', function() {
        it('Should call notifyAll MOVE', function() {
            observableSpy = createObservableSpy();
            const sut = createViews(null, observableSpy);

            const playerIndex = 0;
            const cellIndex = 0;
            sut.move(playerIndex, cellIndex);

            expect(observableSpy.params.history.notifyAll[0].id).to.equal('MOVE');
            expect(observableSpy.params.history.notifyAll[0].playerIndex).to.equal(playerIndex);
            expect(observableSpy.params.history.notifyAll[0].cellIndex).to.equal(cellIndex);
        });
    });

    describe('#setup()', function() {
        it('Should call notifyAll SETUP', function() {
            observableSpy = createObservableSpy();
            const sut = createViews(null, observableSpy);

            const player1 = 'valid_player1';
            const player2 = 'valid_player2';
            sut.setup(player1, player2);

            expect(observableSpy.params.history.notifyAll[0].id).to.equal('SETUP');
            expect(observableSpy.params.history.notifyAll[0].player1).to.equal(player1);
            expect(observableSpy.params.history.notifyAll[0].player2).to.equal(player2);
        });
    });

    describe('#startNextRound()', function() {
        it('Should call notifyAll START_NEXT_ROUND', function() {
            observableSpy = createObservableSpy();
            const sut = createViews(null, observableSpy);

            sut.startNextRound();

            expect(observableSpy.params.history.notifyAll[0].id).to.equal('START_NEXT_ROUND');
        });
    });
});