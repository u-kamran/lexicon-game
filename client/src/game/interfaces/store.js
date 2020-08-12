import { createSlice, configureStore } from '@reduxjs/toolkit';

/* ----- Redux Configuration ----- */

export const slice = createSlice({
    name: 'game',
    initialState : {
        name: "",
        identifier : "",
        progress: 0,
        status: 0,
        guess: "",
        word: "",
        loadingPage : false,
        letters : 5,
        history : []
    },
    reducers : {
        updateName : (state, action) => {
            state.name = action.payload;
        },
        updateIdentifier : (state, action) => {
            state.identifier = action.payload;
        },
        incrementProgress : state => {
            state.progress += 1;
        },
        resetProgress : state => {
            state.progress = 0;
        },
        updateProgress : (state, action) => {
            state.progress = action.payload;
        },
        updateStatus : (state, action) => {
            state.status = action.payload;
        },
        updateGuess : (state, action) => {
            state.guess = action.payload;
        },
        updateWord : (state, action) => {
            state.word = action.payload;
        },
        activateLoading : state => {
            state.loadingPage = true;
        },
        deactivateLoading : state => {
            state.loadingPage = false;
        },
        updateLetters : (state, action) => {
            state.letters = action.payload;
        },
        updateHistory : (state, action) => {
            state.history = action.payload;
        }
    }
});

export const selector = {
    name : state => state.game.name,
    identifier : state => state.game.identifier,
    progress : state => state.game.progress,
    status : state => state.game.status,
    guess : state => state.game.guess,
    word : state => state.game.word,
    loadingPage : state => state.game.loadingPage,
    letters : state => state.game.letters,
    history : state => state.game.history
};

export const store = configureStore({
    reducer: {
        game: slice.reducer
    }
});