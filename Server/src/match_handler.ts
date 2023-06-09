export const moduleName = "sussy-gunner";
export const tickRate = 5;

interface State {
    presences: { [userId: string]: nkruntime.Presence | null }
}

export const matchInit = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, params: { [key: string]: string }): { state: nkruntime.MatchState, tickRate: number, label: string } {
    logger.debug('Lobby match created');

    const state: State = {
        presences: {}
    }

    return {
        state,
        tickRate,
        label: ''
    };
};

export const matchJoinAttempt = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presence: nkruntime.Presence, metadata: { [key: string]: any }): { state: nkruntime.MatchState, accept: boolean, rejectMessage?: string | undefined } | null {
    logger.debug('%q attempted to join Lobby match', ctx.userId);

    return {
        state,
        accept: true
    };
}

export const matchJoin = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presences: nkruntime.Presence[]): { state: nkruntime.MatchState } | null {
    presences.forEach(function (presence) {
        state.presences[presence.userId] = presence;
        logger.debug('%q joined Lobby match', presence.userId);
    });

    return {
        state
    };
}

export const matchLeave = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, presences: nkruntime.Presence[]): { state: nkruntime.MatchState } | null {
    presences.forEach(function (presence) {
        delete (state.presences[presence.userId]);
        logger.debug('%q left Lobby match', presence.userId);
    });

    return {
        state
    };
}

export const matchLoop = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, messages: nkruntime.MatchMessage[]): { state: nkruntime.MatchState } | null {
    logger.debug('Lobby match loop executed');

    Object.keys(state.presences).forEach(function (key) {
        const presence = state.presences[key];
        logger.info('Presence %v name $v', presence.userId, presence.username);
    });

    messages.forEach(function (message) {
        logger.info('Received %v from %v', message.data, message.sender.userId);
        const currentUserId = message.sender.userId;
        const otherPresences = omit(state.presences, currentUserId);
        if (otherPresences != null) {
            const payload: string = JSON.parse(message.data);
            // @ts-ignore
            dispatcher.broadcastMessage(message.opCode, , otherPresences, message.sender);
        }
    })

    return {
        state
    };
}

export const matchTerminate = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, graceSeconds: number): { state: nkruntime.MatchState } | null {
    logger.debug('Lobby match terminated');

    const message = `Server shutting down in ${graceSeconds} seconds.`;
    dispatcher.broadcastMessage(2, message, null, null);

    return {
        state
    };
}

export const matchSignal = function (ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, dispatcher: nkruntime.MatchDispatcher, tick: number, state: nkruntime.MatchState, data: string): { state: nkruntime.MatchState, data?: string } | null {
    logger.debug('Lobby match signal received: ' + data);

    return {
        state,
        data: "Lobby match signal received: " + data
    };
}

// @ts-ignore
function omit(obj, omitKey) {
    return Object.keys(obj).reduce((result, key) => {
        if (key !== omitKey) {
            // @ts-ignore
            result[key] = obj[key];
        }
        return result;
    }, {});
}
