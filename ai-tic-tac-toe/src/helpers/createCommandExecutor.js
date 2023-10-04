export default function createCommandExecutor(commands) {

    function executeCommand(command) {
        if(!command || !command.id || !commands[command.id]) throw 'Invalid command';

        const commandId = command.id;
        commands[commandId](command);
    }

    return {
        executeCommand,
    }

}
