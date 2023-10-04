import {expect} from 'chai';
import createGameStrategyManager from '../src/gameStrategies/createGameStrategyManager.js';

describe('GameStrategyManager', () => {
    it('Should get an added strategy by the name', ()=> {
        const sut = createGameStrategyManager();
        const validStrategy = { name: 'validStrategy' };

        sut.addStrategy(validStrategy);
        const strategy = sut.getStrategy(validStrategy.name);
        expect(strategy).to.deep.equal(validStrategy);
    })
})