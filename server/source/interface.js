'use strict';

const { User, Status } = require('./gameplay.js');

const { buildSchema } = require('graphql');

let schema = buildSchema(`
    type Query {
        user(identifier: String!): String
        progress(identifier: String!): Int
        history(identifier: String!): [Result!]
    }
    type Mutation {
        initialize(settings: Settings!): String!
        surrender(identifier: String!): End!
        validate(guess: Guess!): Outcome!
    }
    input Settings {
        name: String!
        difficulty: Difficulty!
    }
    enum Difficulty {
        EASY
        MEDIUM
        HARD
    }
    input Guess {
        identifier: String!
        attempt: String!
    }
    type Outcome {
        result: Result!
        end: End!
    }
    type Result {
        guess: String!
        ones: Int!
        twos: Int!
    }
    type End {
        status: Int!
        word: String!
    }
`);

let currentUsers = {};

let resolver = {
    user: ({identifier}) => {
        /* query to get a user given an identifier */
        let playerId = identifier.replace(/[^\w\s]/gi, '');
        if (playerId.length === 4) {
            let player = currentUsers[playerId];
            if (typeof player !== "undefined") {
                return player.name;
            }
        }
    },
    progress: ({identifier}) => {
        /* query to get the progress given an identifier */
        let playerId = identifier.replace(/[^\w\s]/gi, '');
        if (playerId.length === 4) {
            let player = currentUsers[playerId];
            if (typeof player !== "undefined") {
                return player.game.getProgress();
            }
        }
    },
    history: ({identifier}) => {
        /* query to get a list of guesses given an identifier */
        let playerId = identifier.replace(/[^\w\s]/gi, '');
        if (playerId.length === 4) {
            let player = currentUsers[playerId];
            if (typeof player !== "undefined") {
                return player.game.guesses;
            }
        }
    },
    initialize: ({settings}) => {
        /* mutation to define a new user and to start a new game */
        let name = settings.name.replace(/[^\w\s]/gi, '');
        name = (name === '') ? "Guest" : name;
        let newUser = new User(name, settings.difficulty.toLowerCase());
        while (typeof currentUsers[newUser.identifier] !== "undefined") {
            newUser.identifier = newUser.generateId(4);
        }
        currentUsers[newUser.identifier] = newUser;
        return newUser.identifier;
    },
    surrender: ({identifier}) => {
        /* mutation to end the game in advance */
        let playerId = identifier.replace(/[^\w\s]/gi, '');
        if (playerId.length === 4) {
            let player = currentUsers[playerId];
            if (typeof player !== "undefined") {
                return player.game.surrender();
            }
        }
        return {
            "status": 0,
            "word": ""
        };
    },
    validate: ({guess}) => {
        /* mutation to validate the guess and to end the game if required */
        let identifier = guess.identifier.replace(/[^\w\s]/gi, '');
        if (identifier.length === 4) {
            let player = currentUsers[identifier];
            if (typeof player !== "undefined") {
                let attempt = guess.attempt.replace(/[^\w\s]/gi, '');
                if (attempt.length === player.game.word.length) {
                    return player.game.compareWord(attempt.toLowerCase());
                }
            }
        }
        return {
            "result" : {
                "guess" : "",
                "ones" : 0,
                "twos" : 0
            },
            "end" : {
                "status" : 0,
                "word" : ""
            }
        };
    }
};

module.exports = { schema, resolver };