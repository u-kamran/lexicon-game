'use strict';

const promiseWords = require('./words.js');

/* ----- Fulfill the promise when ready ----- */

let words;

promiseWords.then(
    function(data) {
        words = data;
    },
    function(error) {
        throw error;
    }
);

/* ----- Enumeration to represent the game status ----- */

const Status = Object.freeze({
    "InProgress" : 1,
    "Finished" : {
        "Won" : 2,
        "Lost" : 3,
    },
    "Surrender" : 4
});

/* ----- Class that encapsulates game functionality ----- */

const Game = class {
    constructor(difficulty) {
        this.guesses = [];
        this.status = Status.InProgress;
        this.word = this.selectWord(difficulty);
    }

    selectWord(difficulty) {
        if (typeof words === "undefined") {
            /* if the server is loaded before the
               client, then the probability of
               this occurring is quite low */
            throw Error("Unable to select a word");
        }

        let index = Math.floor(Math.random() * 500) + 1;

        return words[difficulty][index];
    }

    getProgress() {
        return this.guesses.length + 1;
    }

    compareWord(guess) {
        console.log(this.word);
        let twos = 0;
        let ones = 0;
        let copy = this.word.slice();

        for (let i = 0; i < guess.length; ++i) {
            let letter = guess.charAt(i);
            if (letter === this.word.charAt(i)) {
                /* letter has the correct value and
                   is also in the correct position */
                twos += 1;
                copy = copy.replace(letter,'');
            }
        }

        for (let i = 0; i < guess.length; ++i) {
            let letter = guess.charAt(i);
            if (copy.includes(letter)) {
                /* letter has the correct value but
                   is not in the correct position */
                ones += 1;
                copy = copy.replace(letter,'');
            }
        }

        let results = {
            "guess" : guess,
            "ones" : ones,
            "twos" : twos
        };
        this.guesses.push(results);

        if (guess === this.word) {
            /* correct word was guessed, game over */
            this.status = Status.Finished.Won;
        }
        else if (this.getProgress() >= 20) {
            /* no more rounds remaining, game over */
            this.status = Status.Finished.Lost;
        }

        let endWord = (this.status > Status.InProgress) ? this.word : "";

        return {
            "result" : results,
            "end" : {
                "status" : this.status,
                "word" : endWord
            }
        };
    }

    surrender() {
        this.status = Status.Surrender;
        return {
            "status": this.status,
            "word": this.word
        };
    }
};

/* ----- Class that encapsulates user details ----- */

const User = class {
    constructor(name, difficulty) {
        this.name = name;
        this.game = new Game(difficulty);
        this.difficulty = difficulty;
        this.identifier = this.generateId(4);
    }

    generateId(length) {
        const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerCase = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";

        let characters = upperCase + lowerCase + numbers;
        let result = "";

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        return result;
    }
};

module.exports = { User, Status };