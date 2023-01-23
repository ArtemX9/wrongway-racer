import io from 'socket.io-client';
const socket = io("wss://wrongway-racer-api.spls.ae/");

function ListenerFabric(eventName, handler) {
    const listeners = [];

    socket.on(eventName, handler.bind(null, (args => {
        listeners.forEach(listenerFunction => listenerFunction(args));
    })));

    return {
        addListener: (listenerFunction) => {
            listeners.push(listenerFunction);
        },
        removeListener: (listenerFunction) => {
            const index = listeners.indexOf(listenerFunction);
            if (index === -1) {
                return;
            }

            listeners.splice(index, 1);
        }
    }
}

export const listenForEnemyAppear = new ListenerFabric('newEnemy', function (callback, position) {
    console.debug('newEnemy', position);
    callback(position);
});

export const listenForNewChat = new ListenerFabric('newChat', function (callback, text) {
    console.debug('newChat', text);
    callback(text);
});


export const listenForNewChatJoin = new ListenerFabric('newChatJoin', function (callback, user) {
    console.debug('newChatJoin', user);
    callback(user);
});


export const listenForPlayers = new ListenerFabric('players', function (callback, players) {
    console.debug('players', players);
    callback(players);
});
