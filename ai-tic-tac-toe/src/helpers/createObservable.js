export default function createObservable() {
    const observers = [];

    function subscribe(observerFunction) {
        if(!observerFunction || typeof observerFunction !== 'function') throw 'Invalid param';

        observers.push(observerFunction);
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command);
        }
    }

    function getObservers() {
        return observers;
    }

    return {
        getObservers,
        subscribe,
        notifyAll,
    }
}
