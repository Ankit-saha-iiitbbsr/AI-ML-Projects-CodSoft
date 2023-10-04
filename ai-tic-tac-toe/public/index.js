import createObservable from '../src/helpers/createObservable.js';
import createCommandExecutor from '../src/helpers/createCommandExecutor.js';

import createViews from "../src/createViews.js";
import createLogic from '../src/createLogic.js';

import createViewCommands from '../src/createViewCommands.js';
import createLogicCommands from '../src/createLogicCommands.js';

// domain
const logic = createLogic();

const gameObservable = createObservable();
const logicCommands = createLogicCommands(logic, gameObservable);
// controller
const gameController = createCommandExecutor(logicCommands);


const screenObservable = createObservable();
// view
const views = createViews(window, screenObservable);
const viewCommands = createViewCommands(views);
// presenter
const gamePresenter = createCommandExecutor(viewCommands);


// observers subscribe
gameObservable.subscribe(gamePresenter.executeCommand);
screenObservable.subscribe(gameController.executeCommand);

//init game
views.buildAll();
gamePresenter.executeCommand({id: "SETUP"});