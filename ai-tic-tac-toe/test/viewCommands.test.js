import {expect} from 'chai';
import createViewCommands from '../src/createViewCommands.js';
import { Symbols, RoundStatus } from "../src/helpers/constants.js";

function createViewsSpy() {
    const params = {
        args: {
            showRoundScreen: {
                model: {},
            },
            updateBoardInfo: {
                model: {},
            },
            showEndRoundScreen: {
                model: {},
            },
            showEndGameScreen: {
                model: {},
            },
        },
        calls: {
            showStartScreen: 0,
            updateBoardInfo: 0,
            showRoundScreen: 0,
            showEndRoundScreen: 0,
            showEndGameScreen: 0,
            getUserPreferences: 0,
        },
        returns: {
            getUserPreferences: {
                computerDelay: 3000,
            }
        }
    };

    function showStartScreen() {
        params.calls.showStartScreen++;
    }

    function updateBoardInfo(model) {
        params.args.updateBoardInfo.model = model;
        params.calls.updateBoardInfo++;
    }

    function showRoundScreen(model) {
        params.args.showRoundScreen.model = model;
        params.calls.showRoundScreen++;
    }

    function showEndRoundScreen(model) {
        params.args.showEndRoundScreen.model = model;
        params.calls.showEndRoundScreen++;
    }

    function showEndGameScreen(model) {
        params.args.showEndGameScreen.model = model;
        params.calls.showEndGameScreen++;
    }

    function getUserPreferences() {
        params.calls.getUserPreferences++;
        return params.returns.getUserPreferences;
    }


    return {
        params,
        showStartScreen,
        updateBoardInfo,
        showRoundScreen,
        showEndRoundScreen,
        showEndGameScreen,
        getUserPreferences,
    };
}

describe('ViewComands', function() {
    let viewsSpy;

    describe('SETUP', function() {
        it('Should call showStartScreen', function() {
            viewsSpy = createViewsSpy();
            const sut = createViewCommands(viewsSpy);

            const command = {
                id: 'SETUP',
            };
            sut.SETUP(command);

            expect(viewsSpy.params.calls.showStartScreen).to.equal(1);
        });
    });

    describe('START_ROUND', function() {
        it('Should call updateBoardInfo and showRoundScreen', function() {
            viewsSpy = createViewsSpy();
            const sut = createViewCommands(viewsSpy);

            const command = {
                id: 'START_ROUND',
                state: {
                    currentRound: {
                        round: 0,
                    },
                    maxRounds: 3,
                },
            };
            sut.START_ROUND(command);

            const {state} = command;
            expect(viewsSpy.params.calls.updateBoardInfo).to.equal(1);
            expect(viewsSpy.params.args.updateBoardInfo.model).to.deep.equal(state);
            expect(viewsSpy.params.calls.showRoundScreen).to.equal(1);
            expect(viewsSpy.params.args.showRoundScreen.model).to.deep.equal({
                currentRound: state.currentRound.round + 1,
                maxRounds: state.maxRounds,
            });
        });
    });

    describe('UPDATE_BOARD', function() {
        it('Should call updateBoardInfo', function() {
            viewsSpy = createViewsSpy();
            const sut = createViewCommands(viewsSpy);

            const command = {
                id: 'UPDATE_BOARD',
                state: {
                    currentRound: {
                        round: 0,
                        currentPlayer: 0
                    },
                    maxRounds: 3,
                    players: [
                        {
                            type: 'HUMAN',
                        },
                        {
                            type: 'HUMAN',
                        }
                    ]
                },
            };
            sut.UPDATE_BOARD(command);

            const {state} = command;
            expect(viewsSpy.params.calls.updateBoardInfo).to.equal(1);
            expect(viewsSpy.params.args.updateBoardInfo.model).to.deep.equal(state);
        });

        // TODO DELAY NÃO PODE SER MAIOR QUE 5 SEGUNDOS 
        it('[computer player] Should call updateBoardInfo after a delay', function(done) {
            this.timeout(6000);
            viewsSpy = createViewsSpy();
            const sut = createViewCommands(viewsSpy);

            const command = {
                id: 'UPDATE_BOARD',
                state: {
                    currentRound: {
                        round: 0,
                        currentPlayer: 0
                    },
                    maxRounds: 3,
                    players: [
                        {
                            type: 'HUMAN',
                        },
                        {
                            type: 'COMPUTER',
                        }
                    ]
                },
            };
            sut.UPDATE_BOARD(command);

            const {state} = command;
            expect(viewsSpy.params.calls.getUserPreferences).to.equal(1);
            expect(viewsSpy.params.calls.updateBoardInfo).to.equal(0);
            
            setTimeout(()=> {
                expect(viewsSpy.params.calls.updateBoardInfo).to.equal(1);
                expect(viewsSpy.params.args.updateBoardInfo.model).to.deep.equal(state);
                done();
            }, viewsSpy.getUserPreferences().computerDelay + 500)
        });

        it('[computer player] Should call updateBoardInfo immediately if animations (computerDelay) are disabled in userPreferences', function(done) {
            viewsSpy = createViewsSpy();
            viewsSpy.params.returns.getUserPreferences.computerDelay = 0;
            const sut = createViewCommands(viewsSpy);

            const command = {
                id: 'UPDATE_BOARD',
                state: {
                    currentRound: {
                        round: 0,
                        currentPlayer: 0
                    },
                    maxRounds: 3,
                    players: [
                        {
                            type: 'HUMAN',
                        },
                        {
                            type: 'COMPUTER',
                        }
                    ]
                },
            };
            sut.UPDATE_BOARD(command);

            const {state} = command;
            setTimeout(()=> {
                expect(viewsSpy.params.calls.getUserPreferences).to.equal(1);
                expect(viewsSpy.params.calls.updateBoardInfo).to.equal(1);
                expect(viewsSpy.params.args.updateBoardInfo.model).to.deep.equal(state);
                done()
            }, 0)
        });
    });

    describe('END_ROUND', function() {
        it('Should call updateBoardInfo and showEndRoundScreen', function() {
            viewsSpy = createViewsSpy();
            const sut = createViewCommands(viewsSpy);

            const command = {
                id: 'END_ROUND',
                state: {
                    currentRound: {
                        round: 0,
                        statusRound:  RoundStatus.WIN,
                        currentPlayer: 0,
                    },
                    maxRounds: 3,
                    players: [
                        {
                            name: 'player 1',
                        }
                    ]
                },
            };
            sut.END_ROUND(command);

            const {state} = command;
            expect(viewsSpy.params.calls.updateBoardInfo).to.equal(1);
            expect(viewsSpy.params.args.updateBoardInfo.model).to.deep.equal(state);
            expect(viewsSpy.params.calls.showEndRoundScreen).to.equal(1);
            expect(viewsSpy.params.args.showEndRoundScreen.model).to.deep.equal({
                text: state.currentRound.statusRound == RoundStatus.WIN ? `${state.players[state.currentRound.currentPlayer].name} won!` : 'Draw!',
            });
        });
    });

    describe('END_GAME', function() {
        it('Should call updateBoardInfo and showEndRoundScreen', function() {
            viewsSpy = createViewsSpy();
            const sut = createViewCommands(viewsSpy);

            const command = {
                id: 'END_GAME',
                state: {
                    currentRound: {
                        round: 0,
                        statusRound:  RoundStatus.WIN,
                        currentPlayer: 0,
                    },
                    maxRounds: 3,
                    players: [
                        {
                            name: 'player 1',
                            symbol: Symbols.X,
                        },
                        {
                            name: 'player 2',
                            symbol: Symbols.O,
                        }
                    ],
                    scores: [
                        {
                            winner: Symbols.X, combination: [0, 1, 2],
                        },
                        {
                            winner: Symbols.O, combination: [0, 1, 2],
                        },
                        {
                            winner: 'Draw', combination: [0, 1, 2],
                        },
                    ],
                },
            };
            sut.END_GAME(command);

            const {state} = command;
            expect(viewsSpy.params.calls.showEndGameScreen).to.equal(1);
            expect(viewsSpy.params.args.showEndGameScreen.model).to.deep.equal({
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
            });
        });
    });

});