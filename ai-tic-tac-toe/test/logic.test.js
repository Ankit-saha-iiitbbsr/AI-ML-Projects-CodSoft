import {expect} from 'chai';
import createLogic from '../src/createLogic.js';
import { PlayerTypes, Symbols, GameStatus, RoundStatus } from '../src/helpers/constants.js';

describe('logic', function() {
    let logic;
    
    
    describe('#setPlayers()', function() {

        beforeEach(function() {
            logic = createLogic();
        });

        it('Should create 2 users of type human', function() {

            logic.setPlayers({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });

            expect(logic.getState().players).to.have.lengthOf(2);
            
            expect(logic.getState().players[0].name).to.equal('player 1');
            expect(logic.getState().players[0].type).to.equal(PlayerTypes.HUMAN);
            expect(logic.getState().players[0].symbol).to.equal(Symbols.X);

            expect(logic.getState().players[1].name).to.equal('player 2');
            expect(logic.getState().players[1].type).to.equal(PlayerTypes.HUMAN);
            expect(logic.getState().players[1].symbol).to.equal(Symbols.O);
        });

        it('Should create a user of type human and a user of type computer', function() {

            logic.setPlayers({ name: 'human', type: PlayerTypes.HUMAN }, { name: 'computer', type: PlayerTypes.COMPUTER });

            expect(logic.getState().players).to.have.lengthOf(2);

            expect(logic.getState().players[0].name).to.equal('human');
            expect(logic.getState().players[0].type).to.equal(PlayerTypes.HUMAN);
            expect(logic.getState().players[0].symbol).to.equal(Symbols.X);

            expect(logic.getState().players[1].name).to.equal('computer');
            expect(logic.getState().players[1].type).to.equal(PlayerTypes.COMPUTER);
            expect(logic.getState().players[1].symbol).to.equal(Symbols.O);
        });

        it('Should create 2 users of type computer', function() {

            logic.setPlayers({ name: 'comp1', type: PlayerTypes.COMPUTER }, { name: 'comp2', type: PlayerTypes.COMPUTER });

            expect(logic.getState().players).to.have.lengthOf(2);

            expect(logic.getState().players[0].name).to.equal('comp1');
            expect(logic.getState().players[0].type).to.equal(PlayerTypes.COMPUTER);
            expect(logic.getState().players[0].symbol).to.equal(Symbols.X);

            expect(logic.getState().players[1].name).to.equal('comp2');
            expect(logic.getState().players[1].type).to.equal(PlayerTypes.COMPUTER);
            expect(logic.getState().players[1].symbol).to.equal(Symbols.O);
        });

        it('Should create users with default names', function() {

            logic.setPlayers({ type: PlayerTypes.HUMAN }, { type: PlayerTypes.HUMAN });

            expect(logic.getState().players).to.have.lengthOf(2);

            expect(logic.getState().players[0].name).to.equal('player 1');
            expect(logic.getState().players[0].type).to.equal(PlayerTypes.HUMAN);
            expect(logic.getState().players[0].symbol).to.equal(Symbols.X);

            expect(logic.getState().players[1].name).to.equal('player 2');
            expect(logic.getState().players[1].type).to.equal(PlayerTypes.HUMAN);
            expect(logic.getState().players[1].symbol).to.equal(Symbols.O);
        });

        it('Should create users with default types', function() {

            logic.setPlayers({ }, { });

            expect(logic.getState().players).to.have.lengthOf(2);

            expect(logic.getState().players[0].name).to.equal('player 1');
            expect(logic.getState().players[0].type).to.equal(PlayerTypes.HUMAN);
            expect(logic.getState().players[0].symbol).to.equal(Symbols.X);

            expect(logic.getState().players[1].name).to.equal('player 2');
            expect(logic.getState().players[1].type).to.equal(PlayerTypes.HUMAN);
            expect(logic.getState().players[1].symbol).to.equal(Symbols.O);
        });

        it('Should throw if no param is passed', function() {
            expect(logic.setPlayers).to.throw();
        });


    });

    describe('#resetGame()', function() {

        beforeEach(function() {
            logic = createLogic();
        });

        it('Should reset the scores e rounds', function() {
            logic.resetGame();

            expect(logic.getState().statusGame).to.equal(GameStatus.RUNNING);
            expect(logic.getState().currentRound.round).to.equal(-1);
            expect(logic.getState().currentRound.currentPlayer).to.equal(-1);
            expect(logic.getState().currentRound.statusRound).to.equal(null);
            expect(logic.getState().scores).to.have.lengthOf(0);

        });
        it('Should restart the scores e rounds after ended the game', function() {
            logic.getState().statusGame = GameStatus.ENDED;
            logic.getState().currentRound.round = 2;
            logic.getState().currentRound.currentPlayer = 1;
            logic.getState().currentRound.statusRound = RoundStatus.DRAW;
    
            logic.getState().scores = [
                {
                    winner: 0, combination: [0, 1, 2],
                },
                {
                    winner: 1, combination: [0, 1, 2],
                },
                {
                    winner: 1, combination: [0, 1, 2],
                },
            ];

            logic.resetGame();

            expect(logic.getState().statusGame).to.equal(GameStatus.RUNNING);
            expect(logic.getState().currentRound.round).to.equal(-1);
            expect(logic.getState().currentRound.currentPlayer).to.equal(-1);
            expect(logic.getState().currentRound.statusRound).to.equal(null);
            expect(logic.getState().scores).to.have.lengthOf(0);

        });

    });

    describe('#checkEndOfGame()', function() {

        beforeEach(function() {
            logic = createLogic();
       
            logic.setPlayers({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
            logic.resetGame();
            logic.startNextRound();
        });

        it('Should end the game if next round is out of the limit of maxRounds', function() {
            logic.getState().currentRound.round = logic.getState().maxRounds - 1;
            const result = logic.checkEndOfGame();

            expect(result).to.equal(true);
            expect(logic.getState().statusGame).to.equal(GameStatus.ENDED);

        });
        it('Should not end the game if next round is out of the limit of maxRounds', function() {
            const result = logic.checkEndOfGame();

            expect(result).to.equal(false);
            expect(logic.getState().statusGame).to.equal(GameStatus.RUNNING);

        })

    });

    describe('#startNextRound()', function() {

        beforeEach(function() {
            logic = createLogic();
       
            logic.setPlayers({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
            logic.resetGame();
        });

        it('Should start the 1º round', function() {
            const result = logic.startNextRound();

            expect(result).to.equal(true);
            expect(logic.getState().board.cells.filter(cell => cell == Symbols.EMPTY)).to.have.lengthOf(9);
            expect(logic.getState().currentRound.round).to.equal(0);
            expect(logic.getState().currentRound.currentPlayer).to.equal(0);
            expect(logic.getState().currentRound.statusRound).to.equal(RoundStatus.PLAYING);

        });
        it('Should start the 2º round', function() {
            const result1 = logic.startNextRound();
            expect(result1).to.equal(true);
            logic.getState().currentRound.statusRound = RoundStatus.WIN;
            const result2 = logic.startNextRound();
            expect(result2).to.equal(true);

            expect(logic.getState().board.cells.filter(cell => cell == Symbols.EMPTY)).to.have.lengthOf(9);
            expect(logic.getState().currentRound.round).to.equal(1);
            expect(logic.getState().currentRound.currentPlayer).to.equal(0);
            expect(logic.getState().currentRound.statusRound).to.equal(RoundStatus.PLAYING);

        });
        it('Should start the 3º round', function() {
            const result1 = logic.startNextRound();
            expect(result1).to.equal(true);
            logic.getState().currentRound.statusRound = RoundStatus.WIN;
            const result2 = logic.startNextRound();
            expect(result2).to.equal(true);
            logic.getState().currentRound.statusRound = RoundStatus.WIN;
            const result3 = logic.startNextRound();
            expect(result3).to.equal(true);

            expect(logic.getState().board.cells.filter(cell => cell == Symbols.EMPTY)).to.have.lengthOf(9);
            expect(logic.getState().currentRound.round).to.equal(2);
            expect(logic.getState().currentRound.currentPlayer).to.equal(0);
            expect(logic.getState().currentRound.statusRound).to.equal(RoundStatus.PLAYING);

        });

        it('Should not start the next round if is out of the limit of maxRounds', function() {
            for(let i = 0; i < logic.getState().maxRounds; i++) {
                const result = logic.startNextRound();
                expect(result).to.equal(true);
                logic.getState().currentRound.statusRound = RoundStatus.WIN;
            }

            const result = logic.startNextRound();
            expect(result).to.not.equal(true);
            expect(logic.getState().currentRound.round).to.equal(logic.getState().maxRounds - 1);
            expect(logic.getState().statusGame).to.equal(GameStatus.RUNNING);

        });

        it('Should not start the next round if the game is ENDED', function() {
            const result1 = logic.startNextRound();
            expect(result1).to.equal(true);
            logic.getState().currentRound.round = logic.getState().maxRounds - 1;
            logic.checkEndOfGame();
            expect(logic.getState().statusGame).to.equal(GameStatus.ENDED)

            const result2 = logic.startNextRound();
            expect(result2).to.not.equal(true);
            expect(logic.getState().statusGame).to.equal(GameStatus.ENDED)
            expect(logic.getState().currentRound.round).to.equal(2);

        });

        it('Should not start the next round without finishing the current', function() {
            const result1 = logic.startNextRound();
            expect(result1).to.equal(true);
            
            const result2 = logic.startNextRound();
            expect(result2).to.not.equal(true);
            expect(logic.getState().currentRound.round).to.equal(0);

        });

    });

    describe('#move()', function() {

        logic = createLogic();
        logic.setPlayers({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
        logic.resetGame();
        logic.startNextRound();

        it('Should move player 1 to empty destination cell', function() {
            logic.getState().currentRound.currentPlayer = 0
            logic.move(0, 0);

            expect(logic.getState().board.cells[0]).to.equal(Symbols.X);
        });
        it('Should move player 2 to empty destination cell', function() {
            logic.getState().currentRound.currentPlayer = 1
            // console.log('CURRENT PLAYER: ', logic.getState().currentRound.currentPlayer)
            logic.move(1, 2);

            expect(logic.getState().board.cells[2]).to.equal(Symbols.O);
        });
        it('Should not move player if it destination cell is not empty', function() {
            logic.getState().currentRound.currentPlayer = 0
            logic.move(0, 2);

            expect(logic.getState().board.cells[2]).to.equal(Symbols.O);
        });
        it('Should not move player if it destination cell does not exists', function() {
            logic.getState().currentRound.currentPlayer = 0
            logic.move(0, 9);

            expect(logic.getState().board.cells[9]).to.equal(undefined);
        });
        it('Should not move player if it is not his current turn', function() {
            logic.getState().currentRound.currentPlayer = 0
            logic.move(1, 1);

            expect(logic.getState().board.cells[1]).to.equal(Symbols.EMPTY);
        });
        it('Should not move player if round status is not PLAYING', function() {
            logic.getState().currentRound.currentPlayer = 0
            logic.getState().currentRound.statusRound = RoundStatus.DRAW
            logic.move(0, 1);

            expect(logic.getState().board.cells[1]).to.equal(Symbols.EMPTY);
        });

        it('Should not move player if game status is not RUNNING', function() {
            logic.getState().currentRound.currentPlayer = 0
            logic.getState().statusGame = GameStatus.ENDED
            logic.move(0, 1);

            expect(logic.getState().board.cells[1]).to.equal(Symbols.EMPTY);
        });

    });

    describe('#checkEndOfRound()', function() {
        beforeEach(function() {
            
            logic = createLogic();

            logic.setPlayers({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
            logic.resetGame();
            logic.startNextRound();

        });

        it('Draw, player 1 turn', function() {
            logic.getState().board.cells[0] = Symbols.X;
            logic.getState().board.cells[1] = Symbols.O;
            logic.getState().board.cells[2] = Symbols.X;
            logic.getState().board.cells[3] = Symbols.X;
            logic.getState().board.cells[4] = Symbols.O;
            logic.getState().board.cells[5] = Symbols.X;
            logic.getState().board.cells[6] = Symbols.O;
            logic.getState().board.cells[7] = Symbols.X;
            logic.getState().board.cells[8] = Symbols.O;

            expect(logic.getState().currentRound.statusRound).to.equal(RoundStatus.PLAYING);
            expect(logic.hasEmptyCells(logic.getState().board.cells)).to.equal(false);

            logic.getState().currentRound.currentPlayer = 0;
            const isEndOfRound = logic.checkEndOfRound();

            expect(isEndOfRound).to.equal(true);
            expect(logic.getState().currentRound.statusRound).to.equal(RoundStatus.DRAW);
            expect(logic.getState().scores.length).to.equal(1);
            expect(logic.getState().scores[0].winner).to.equal('Draw');
            expect(logic.getState().scores[0].combination.length).to.equal(0);
        });
        it('Draw, player 2 turn', function() {
            logic.getState().board.cells[0] = Symbols.X;
            logic.getState().board.cells[1] = Symbols.O;
            logic.getState().board.cells[2] = Symbols.X;
            logic.getState().board.cells[3] = Symbols.X;
            logic.getState().board.cells[4] = Symbols.O;
            logic.getState().board.cells[5] = Symbols.X;
            logic.getState().board.cells[6] = Symbols.O;
            logic.getState().board.cells[7] = Symbols.X;
            logic.getState().board.cells[8] = Symbols.O;

            expect(logic.getState().currentRound.statusRound).to.equal(RoundStatus.PLAYING);
            expect(logic.hasEmptyCells(logic.getState().board.cells)).to.equal(false);
            
            logic.getState().currentRound.currentPlayer = 1;
            const isEndOfRound = logic.checkEndOfRound();

            expect(isEndOfRound).to.equal(true);
            expect(logic.getState().currentRound.statusRound).to.equal(RoundStatus.DRAW);
            expect(logic.getState().scores.length).to.equal(1);
            expect(logic.getState().scores[0].winner).to.equal('Draw');
            expect(logic.getState().scores[0].combination.length).to.equal(0);
        });
        it('Victory', function() {
            expect(logic.getState().currentRound.statusRound).to.equal(RoundStatus.PLAYING);
            logic.getState().board.cells[0] = Symbols.X;
            logic.getState().board.cells[1] = Symbols.X;
            logic.getState().board.cells[2] = Symbols.X;
            logic.getState().board.cells[3] = Symbols.X;
            logic.getState().board.cells[4] = Symbols.O;
            logic.getState().board.cells[5] = Symbols.X;
            logic.getState().board.cells[6] = Symbols.O;
            logic.getState().board.cells[7] = Symbols.X;
            logic.getState().board.cells[8] = Symbols.O;

            logic.getState().currentRound.currentPlayer = 0;
            const isEndOfRound = logic.checkEndOfRound();

            expect(isEndOfRound).to.equal(true);
            expect(logic.getState().currentRound.statusRound).to.equal(RoundStatus.WIN);
            expect(logic.getState().scores.length).to.equal(1);
            expect(logic.getState().scores[0].winner).to.equal(Symbols.X);
            expect(logic.getState().scores[0].combination.length).to.equal(3);
            expect(logic.getState().scores[0].combination[0]).to.equal(0);
            expect(logic.getState().scores[0].combination[1]).to.equal(1);
            expect(logic.getState().scores[0].combination[2]).to.equal(2);
        });
        it('Round stil in progress', function() {
            logic.getState().board.cells[0] = Symbols.X;
            logic.getState().board.cells[1] = Symbols.O;
            logic.getState().board.cells[2] = Symbols.X;
            logic.getState().board.cells[3] = Symbols.X;
            logic.getState().board.cells[4] = Symbols.O;
            logic.getState().board.cells[5] = Symbols.X;
            logic.getState().board.cells[6] = Symbols.O;
            logic.getState().board.cells[7] = Symbols.X;
            logic.getState().board.cells[8] = Symbols.EMPTY;

            expect(logic.getState().currentRound.statusRound).to.equal(RoundStatus.PLAYING);
            expect(logic.hasEmptyCells(logic.getState().board.cells)).to.equal(true);

            logic.getState().currentRound.currentPlayer = 1;
            const isEndOfRound = logic.checkEndOfRound();

            expect(isEndOfRound).to.equal(false);
            expect(logic.getState().currentRound.statusRound).to.equal(RoundStatus.PLAYING);
            expect(logic.getState().scores.length).to.equal(0);
        });
    });

    describe("#switchPlayerTurn()", function() {
        beforeEach(function() {
            
            logic = createLogic();
       
            logic.setPlayers({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
            logic.resetGame();
            logic.startNextRound();
        });

        it('switch player\'s turn', function() {
            expect(logic.getState().currentRound.currentPlayer).to.equal(0);
            const result1 = logic.switchPlayerTurn();
            expect(result1).to.equal(true);
            expect(logic.getState().currentRound.currentPlayer).to.equal(1);
            const result2 = logic.switchPlayerTurn();
            expect(result2).to.equal(true);
            expect(logic.getState().currentRound.currentPlayer).to.equal(0);
        })
        it('Does not switch player when round status is not PLAYING', function() {
            expect(logic.getState().currentRound.currentPlayer).to.equal(0);
            logic.getState().currentRound.statusRound = RoundStatus.WIN; 
            const result = logic.switchPlayerTurn();
            expect(result).to.not.equal(true);
            expect(logic.getState().currentRound.currentPlayer).to.equal(0);
        });

    });

    // // helpers

    describe('#searchWinningCombination()', function() {
        let cells;

        beforeEach(function() {
            logic = createLogic();
            cells = [
                Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
                Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
                Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            ];
        });

        it('Should find winning combination 0 1 2', function() {
            cells[0] = Symbols.X;
            cells[1] = Symbols.X;
            cells[2] = Symbols.X;


            const combination = logic.searchWinningCombination(Symbols.X, cells);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(0);
            expect(combination[1]).to.equal(1);
            expect(combination[2]).to.equal(2);
        });

        it('Should find winning combination 3 4 5', function() {
            cells[3] = Symbols.X;
            cells[4] = Symbols.X;
            cells[5] = Symbols.X;

            const combination = logic.searchWinningCombination(Symbols.X, cells);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(3);
            expect(combination[1]).to.equal(4);
            expect(combination[2]).to.equal(5);
        });

        it('Should find winning combination 6 7 8', function() {
            cells[6] = Symbols.X;
            cells[7] = Symbols.X;
            cells[8] = Symbols.X;

            const combination = logic.searchWinningCombination(Symbols.X, cells);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(6);
            expect(combination[1]).to.equal(7);
            expect(combination[2]).to.equal(8);
        });

        it('Should find winning combination 0 3 6', function() {
            cells[0] = Symbols.O;
            cells[3] = Symbols.O;
            cells[6] = Symbols.O;

            const combination = logic.searchWinningCombination(Symbols.O, cells);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(0);
            expect(combination[1]).to.equal(3);
            expect(combination[2]).to.equal(6);
        });

        it('Should find winning combination 1 4 7', function() {
            cells[1] = Symbols.O;
            cells[4] = Symbols.O;
            cells[7] = Symbols.O;

            const combination = logic.searchWinningCombination(Symbols.O, cells);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(1);
            expect(combination[1]).to.equal(4);
            expect(combination[2]).to.equal(7);
        });

        it('Should find winning combination 2 5 8', function() {
            cells[2] = Symbols.O;
            cells[5] = Symbols.O;
            cells[8] = Symbols.O;

            const combination = logic.searchWinningCombination(Symbols.O, cells);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(2);
            expect(combination[1]).to.equal(5);
            expect(combination[2]).to.equal(8);
        });

        it('Should find winning combination 0 4 8', function() {
            cells[0] = Symbols.X;
            cells[4] = Symbols.X;
            cells[8] = Symbols.X;

            const combination = logic.searchWinningCombination(Symbols.X, cells);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(0);
            expect(combination[1]).to.equal(4);
            expect(combination[2]).to.equal(8);
        });

        it('Should find winning combination 2 4 6', function() {
            cells[2] = Symbols.X;
            cells[4] = Symbols.X;
            cells[6] = Symbols.X;

            const combination = logic.searchWinningCombination(Symbols.X, cells);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(2);
            expect(combination[1]).to.equal(4);
            expect(combination[2]).to.equal(6);
        });


        it('Should not find winning combination when is draw', function() {
            cells = [
                Symbols.X, Symbols.O, Symbols.X, 
                Symbols.X, Symbols.O, Symbols.X, 
                Symbols.O, Symbols.X, Symbols.O, 
            ];

            const combinationX = logic.searchWinningCombination(Symbols.X, cells);
            expect(combinationX).to.equal(undefined);
            
            const combinationO = logic.searchWinningCombination(Symbols.O, cells);
            expect(combinationO).to.equal(undefined);

        });

        it('Should not find winning combination when the board is empty', function() {
            const combinationX = logic.searchWinningCombination(Symbols.X, cells);
            expect(combinationX).to.equal(undefined);
            
            const combinationO = logic.searchWinningCombination(Symbols.O, cells);
            expect(combinationO).to.equal(undefined);
        });
    });

    describe('#hasEmptyCells()', function() {
        let cells;

        beforeEach(function() {
            logic = createLogic();
            cells = [
                Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
                Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
                Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            ];
        });

        it('Does not have empty cells', function() {
            cells = [
                Symbols.X, Symbols.O, Symbols.X, 
                Symbols.X, Symbols.O, Symbols.X, 
                Symbols.O, Symbols.X, Symbols.O, 
            ];

            const hasEmptyCells = logic.hasEmptyCells(cells);

            expect(hasEmptyCells).to.equal(false);
        });
        it('Does have some empty cells', function() {
            cells = [
                Symbols.X, Symbols.O, Symbols.X, 
                Symbols.EMPTY, Symbols.O, Symbols.X, 
                Symbols.O, Symbols.X, Symbols.O, 
            ];

            const hasEmptyCells = logic.hasEmptyCells(cells);

            expect(hasEmptyCells).to.equal(true);
        });
        it('Has all empty cells', function() {
            const hasEmptyCells = logic.hasEmptyCells(cells);

            expect(hasEmptyCells).to.equal(true);
        });
    });
});