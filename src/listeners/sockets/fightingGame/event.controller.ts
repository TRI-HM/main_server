enum FightingGameEvent {
    REGISTER = 'fight-game:register',
    READY = 'fight-game:game:ready',
    START = 'fight-game:game:start',
    END = 'fight-game:game:end',
    RESTART = 'fight-game:game:restart',
    SCORE = 'fight-game:game:player:score',
    STAND_BY = 'fight-game:game:stand-by',
}

export default FightingGameEvent;