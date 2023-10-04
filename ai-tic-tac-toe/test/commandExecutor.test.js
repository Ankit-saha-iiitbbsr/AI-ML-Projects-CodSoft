import {expect} from 'chai';
import createCommandExecutor from '../src/helpers/createCommandExecutor.js';

describe('commandExecutor', function() {
    describe('#executeCommand()', function() {
        it('Should throw if receive no argument', function() {
            const logicCommandsSpy = {};

            const sut = createCommandExecutor(logicCommandsSpy);

            expect(() => { sut.executeCommand() }).to.throw('Invalid command');
        });

        it('Should throw if receive a command with no id', function() {
            const logicCommandsSpy = {};

            const sut = createCommandExecutor(logicCommandsSpy);

            const invalidCommand = {}; 

            expect(() => { sut.executeCommand(invalidCommand) }).to.throw('Invalid command');
        });

        it('Should throw if receive a command with invalid command id', function() {
            const logicCommandsSpy = {};

            const sut = createCommandExecutor(logicCommandsSpy);

            const inexistentCommand = {
                id: 'invalid_id'
            }; 

            expect(() => { sut.executeCommand(inexistentCommand) }).to.throw('Invalid command');

        });

        it('Should execute a command if it exists', function() {
            let counter = 0;
            const logicCommandsSpy = {
                valid_id: function() {
                    counter++;
                }
            };

            const sut = createCommandExecutor(logicCommandsSpy);

            const validCommand = {
                id: 'valid_id'
            }; 

            sut.executeCommand(validCommand);
            sut.executeCommand(validCommand);
            expect(counter).to.equal(2);

        });
    });
});