'use strict';

const fs = require('fs');

/* ----- Asynchronously load the words from json files ----- */

let easyWords;

fs.readFile('./source/data/easy.json', (error, data) => {
    if (error) throw error;
    easyWords = JSON.parse(data);
});

let mediumWords;

fs.readFile('./source/data/medium.json', (error, data) => {
    if (error) throw error;
    mediumWords = JSON.parse(data);
});

let hardWords;

fs.readFile('./source/data/hard.json', (error, data) => {
    if (error) throw error;
    hardWords = JSON.parse(data);
});

/* ----- Check whether the words have been read yet ----- */

const pendingWords = function() {
    if (typeof easyWords === "undefined"
        || typeof mediumWords === "undefined"
        || typeof hardWords === "undefined") {
        return true;
    }
    return false;
};

/* ----- Package the words into a dictionary if ready ----- */

const prepareWords = function(callback) {
    let attempts = 0;
    let intervalId = setInterval(function() {
        if (pendingWords()) {
            attempts += 1;
            if (attempts >= 3) {
                clearInterval(intervalId);
                callback(Error("Failed to load words"));
            }
        }
        else {
            clearInterval(intervalId);
            callback(undefined, {
                "easy" : easyWords,
                "medium" : mediumWords,
                "hard" : hardWords
            });
        }
    }, 250);
};

/* ----- Generate a promise that can then be exported ----- */

const promiseWords = new Promise((resolve, reject) => {
    const callback = function(error, data) {
        if (error) {
            reject(error);
        }
        resolve(data);
    };
    prepareWords(callback);
});

module.exports = promiseWords;