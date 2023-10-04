export default function createGameStrategyManager() {
    const strategies = [];

    function addStrategy(strategy) {
        strategies.push(strategy)
    }

    function getStrategy(strategyName) {
        return strategies.find(strategy => strategy.name === strategyName);
    }

    return {
        addStrategy,
        getStrategy
    }
}