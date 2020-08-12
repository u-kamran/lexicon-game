import React from 'react';

import { ApolloProvider } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client';

import { client, policy, GraphQL } from './interfaces/client';

import { BrowserRouter, Switch, Route, Link, useHistory } from "react-router-dom";

import { Provider, useSelector, useDispatch } from 'react-redux';
import { slice, selector, store } from './interfaces/store';

import loadingGIF from './views/images/loading.gif';

import './core.css';

/* ----- Gameplay Status ----- */

const Status = Object.freeze({
    "InProgress" : 1,
    "Finished" : {
        "Won" : 2,
        "Lost" : 3,
    },
    "Surrender" : 4
});

/* ----- Top-Level React Component ----- */

function Game() {
    return (
        <Provider store={store}>
            <ApolloProvider client={client}>
                <BrowserRouter>
                    <div className="background fill">
                        <div className="game flex flex-row flex-main-center flex-cross-center ">
                            <div className="card blur-effect flex flex-column flex-main-center flex-cross-center">
                                <Switch>
                                    <Route exact path="/">
                                        <StartPage/>
                                    </Route>
                                    <Route path="/first-example">
                                        <FirstExample/>
                                    </Route>
                                    <Route path="/second-example">
                                        <SecondExample/>
                                    </Route>
                                    <Route path="/playing">
                                        <ActiveGame/>
                                    </Route>
                                    <Route path="/history">
                                        <History/>
                                    </Route>
                                    <Route path="/game-over">
                                        <GameOver/>
                                    </Route>
                                    <Route path="/results">
                                        <Results/>
                                    </Route>
                                </Switch>
                            </div>
                        </div>
                    </div>
                </BrowserRouter>
            </ApolloProvider>
        </Provider>
    );
}

/* ----- Starting Page of the Game ----- */

function StartPage() {
    const reduxLoadingPage = useSelector(selector.loadingPage);

    const dispatch = useDispatch();
    const routerHistory = useHistory();

    const [initGame, { data }] = useMutation(
        GraphQL.Mutation.Initialize,
        {
            onCompleted({initialize}) {
                dispatch(slice.actions.updateIdentifier(initialize))
                dispatch(slice.actions.incrementProgress());
                dispatch(slice.actions.deactivateLoading());
                routerHistory.push("/playing")
            }
        }
    );

    const initializeGame = function() {
        let name = document.getElementById("user-name").value.replace(/[^\w\s]/gi, '');
    
        let easy = document.getElementById("radio-easy").checked;
        let medium = document.getElementById("radio-medium").checked;
        let hard = document.getElementById("radio-hard").checked;
    
        let difficulty = easy ? "EASY" : medium ? "MEDIUM" : "HARD";
        let letters = easy ? 4 : medium ? 5 : 6;
    
        let data = {
            variables: {
                "settings": {
                    "name": name,
                    "difficulty": difficulty
                }
            }
        };

        dispatch(slice.actions.updateName(name));
        dispatch(slice.actions.updateLetters(letters));
        dispatch(slice.actions.activateLoading());
        
        initGame(data);
    };

    if (reduxLoadingPage) return (<Loading/>);

    return (
        <React.Fragment>
            <div className="title text text-center">Lexicon</div>
            <div className="intro text text-justify">
                The goal of this game is to guess the unknown word. Consider it a mix between Hangman and Mastermind, 
                and arguably closest in game mechanics to Jotto.
            </div>
            <div className="intro text text-justify">
                The rules of the game are as follows:
            </div>
            <div className="rules text text-justify">
                1. Players are allowed to make 20 guesses in total, corresponding to the number of rounds of the game. If the unknown
                word is not correctly identified by the last round, the game is lost.
            </div>
            <div className="rules text text-justify">
                2. After each guess, the number of letters that match only the value but not the position of the corresponding letters
                in the unknown word will be shown to the player, denoted as <span className="emphasize">C1</span>.
                <span> <Link className="example-link" to="/first-example">Example</Link></span>
            </div>
            <div className="rules text text-justify">
                3. After each guess, the number of letters that match both the value and the position of the corresponding letters
                in the unknown word will be shown to the player, denoted as <span className="emphasize">C2</span>.
                <span> <Link className="example-link" to="/second-example">Example</Link></span>
            </div>
            <form className="flex flex-column flex-main-center flex-cross-left">
                <div className="flex flex-row flex-main-start flex-cross-center">
                    <div className="form-label text text-center">
                        Name:
                    </div>
                    <div className="form-field-text">
                        <input id="user-name" className="text-label text text-center" name="name" placeholder="Name" type="text"/>
                    </div>
                </div>
                <div className="flex flex-row flex-main-start flex-cross-center">
                    <div className="form-label text text-center">
                        Difficulty:
                    </div>
                    <div className="form-field-radio">
                        <input id="radio-easy" type="radio" name="difficulty" value="easy"/>
                        <label className="radio-label text text-center" htmlFor="easy">Easy</label>
                        <input id="radio-medium" type="radio" name="difficulty" value="medium" defaultChecked={true}/>
                        <label className="radio-label text text-center" htmlFor="medium">Medium</label>
                        <input id="radio-hard" type="radio" name="difficulty" value="hard"/>
                        <label className="radio-label text text-center" htmlFor="hard">Hard</label>
                    </div>
                </div>
                <div className="flex flex-row flex-main-center flex-cross-center">
                    <div className="start-button">
                        <input className="button-label text text-center" name="start" value="S T A R T   G A M E" type="button" onClick={initializeGame}/>
                    </div>
                </div>
            </form>
        </React.Fragment>
    );
}

/* ----- Example Page (for C1) ----- */

function FirstExample() {
    return (
        <React.Fragment>
            <div className="intro text text-justify">
                Consider the following word that is unknown to the player:
            </div>
            <div className="example-word text text-center">
                S<span className="emphasize-letter">W</span>IM
            </div>
            <div className="intro text text-justify">
                Now presume that the player makes the following guess:
            </div>
            <div className="example-word text text-center">
                <span className="emphasize-letter">W</span>AVE
            </div>
            <div className="intro text text-justify">
                Notice that both the unknown word and the guess contain the letter 'W'. The correct alphanumeric value was provided, but
                the position of the letter in the guess is incorrect.
            </div>
            <div className="intro text text-justify">
                Therefore, the value shown for C1 will be <span className="emphasize-letter">1</span>.
            </div>
            <form className="flex flex-column flex-main-center flex-cross-center">
                <div className="return-button">
                    <Link to="/">
                        <input className="button-label text text-center" name="return" value="R E T U R N   B A C K" type="button"/>
                    </Link>
                </div>
            </form>
        </React.Fragment>
    );
}

/* ----- Example Page (for C2) ----- */

function SecondExample() {
    return (
        <React.Fragment>
            <div className="intro text text-justify">
                Consider the following word that is unknown to the player:
            </div>
            <div className="example-word text text-center">
                <span className="emphasize-letter">S</span>W<span className="emphasize-letter">I</span>M
            </div>
            <div className="intro text text-justify">
                Now presume that the player makes the following guess:
            </div>
            <div className="example-word text text-center">
                <span className="emphasize-letter">S</span>L<span className="emphasize-letter">I</span>P
            </div>
            <div className="intro text text-justify">
                Both the unknown word and the guess contain the letters 'S' and 'I'. The correct alphanumeric values were provided, and
                the positions of the letters in the guess are also correct.
            </div>
            <div className="intro text text-justify">
                Therefore, the value shown for C2 will be <span className="emphasize-letter">2</span>.
            </div>
            <form className="flex flex-column flex-main-center flex-cross-center">
                <div className="return-button">
                    <Link to="/">
                        <input className="button-label text text-center" name="return" value="R E T U R N   B A C K" type="button"/>
                    </Link>
                </div>
            </form>
        </React.Fragment>
    );
}

/* ----- Function to Generate Unique Keys ----- */

const generateKey = function(prefix, i, j = "") {
    let suffix = prefix + "-" + i.toString();
    if (j !== "") {
        suffix += "-" + j.toString();
    }
    return suffix;
}

/* ----- Core Gameplay Page ----- */

function Letter(props) {
    return (
        <div className="guess-text-container">
            <input className="guess-text-label text text-center" id={props.name} name={props.name} placeholder="" maxLength="1" type="text"/>
        </div>
    );
}

function ActiveGame() {
    const reduxName = useSelector(selector.name);
    const reduxProgress = useSelector(selector.progress);
    const reduxIdentifier = useSelector(selector.identifier);
    const reduxLoadingPage = useSelector(selector.loadingPage);
    const reduxLetters = useSelector(selector.letters);

    const dispatch = useDispatch();
    const routerHistory = useHistory();

    const resultUser = useQuery(GraphQL.Query.User, policy(reduxIdentifier));

    const resultProgress = useQuery(GraphQL.Query.Progress, policy(reduxIdentifier));

    if (resultUser.data) {
        dispatch(slice.actions.updateName(resultUser.data.user));
    }

    if (resultProgress.data) {
        dispatch(slice.actions.updateProgress(resultProgress.data.progress));
    }

    const [submitGuess, resultValidate] = useMutation(
        GraphQL.Mutation.Validate,
        {
            onCompleted({validate}) {
                dispatch(slice.actions.updateGuess(validate.result))
                dispatch(slice.actions.updateStatus(validate.end.status))
                dispatch(slice.actions.updateWord(validate.end.word))
                dispatch(slice.actions.incrementProgress());
                dispatch(slice.actions.deactivateLoading());
                routerHistory.push("/results")
            }
        }
    );

    const submittingGuess = function() {
        let guessedWord = ""

        for (var i = 0; i < reduxLetters; i++) {
            let letterKey = generateKey("letter", i+1);
            guessedWord += document.getElementById(letterKey).value.replace(/[^\w\s]/gi, '');
        }

        let guessData = {
            variables: {
                "guess": {
                    "identifier": reduxIdentifier,
                    "attempt": guessedWord
                }
            }
        };

        dispatch(slice.actions.updateGuess(guessedWord));
        dispatch(slice.actions.activateLoading());
        
        submitGuess(guessData);
    };

    const [surrendered, resultSurrender] = useMutation(
        GraphQL.Mutation.Surrender,
        {
            onCompleted({surrender}) {
                dispatch(slice.actions.updateStatus(surrender.status))
                dispatch(slice.actions.updateWord(surrender.word))
                dispatch(slice.actions.deactivateLoading());
                routerHistory.push("/game-over");
            }
        }
    );

    const surrenderGame = function() {
        const surrenderVariables = {
            variables: {
                "identifier" : reduxIdentifier
            }
        };

        dispatch(slice.actions.updateStatus(Status.Surrender));
        dispatch(slice.actions.activateLoading());

        surrendered(surrenderVariables);
    };

    if (reduxLoadingPage) return (<Loading/>);

    const generateInputFields = function(letters) {
        var fields = [];
        for (var i = 0; i < letters; i++) {
            let letterKey = generateKey("letter", i+1);
            fields.push(<Letter key={letterKey} name={letterKey}/>);
        }
        return fields;
    };

    return (
        <div className="game-container flex flex-column flex-main-evenly flex-cross-center">
            <div className="game-details-container flex flex-row flex-main-between flex-cross-center">
                <div className="game-details-label text text-justify">
                    Name: <span className="game-details-value">{reduxName}</span>
                </div>
                <div className="game-details-label text text-justify">
                    Round: <span className="game-details-value">{reduxProgress} of 20</span>
                </div>
            </div>
            <div className="flex flex-column flex-main-center flex-cross-center">
                <div className="game-header-label text text-justify">
                    Guess the unknown word by filling in the letters below:
                </div>
                <form className="flex flex-row flex-main-evenly flex-cross-center">
                    {generateInputFields(reduxLetters)}
                </form>
            </div>
            <form className="flex flex-row flex-main-center flex-cross-center">
                <div className="gameplay-button">
                    <input className="gameplay-button-labels button-label-exit text text-center" name="exit" value="E X I T" type="button" onClick={surrenderGame}/>
                </div>
                <div className="gameplay-button">
                    <Link to="/history">
                        <input className="gameplay-button-labels button-label-history text text-center" name="history" value="H I S T O R Y" type="button"/>
                    </Link>
                </div>
                <div className="gameplay-button">
                    <input className="gameplay-button-labels button-label-submit text text-center" name="submit" value="S U B M I T" type="button" onClick={submittingGuess}/>
                </div>
            </form>
        </div>
    );
}

/* ----- History of Guesses Page ----- */

function History() {
    const reduxIdentifier = useSelector(selector.identifier);
    const reduxHistory = useSelector(selector.history);

    const dispatch = useDispatch();

    const resultHistory = useQuery(GraphQL.Query.History, policy(reduxIdentifier));

    if (resultHistory.data) {
        dispatch(slice.actions.updateHistory(resultHistory.data.history));
    }

    const populateTable = function() {
        var rows = [<Header key={generateKey("t", 21)} value={0}/>];
		for (var i = 1; i < 21; i++) {
            if (i < reduxHistory.length + 1) {
                rows.push(<Data key={generateKey("t", i+21)} value={i} history={reduxHistory[i-1]}/>);
            } else {
                let emptyRow = {
                    guess : "",
                    ones : "",
                    twos : ""
                };
                rows.push(<Data key={generateKey("t", i+21)} value={i} history={emptyRow}/>);
            }
        }
		return rows
    };
    
    return (
        <React.Fragment>
            <table>
                <tbody>
                    {populateTable()}
                </tbody>
            </table>
            <form className="flex flex-column flex-main-center flex-cross-center">
                <div className="return-button">
                    <Link to="/playing">
                        <input className="button-label text text-center" name="return" value="R E T U R N   B A C K" type="button"/>
                    </Link>
                </div>
            </form>
        </React.Fragment>
    );
}

function Header(props) {
    return (
        <tr key={generateKey("t", props.value)}>
            <th className="text text-center" key={generateKey("t", props.value, 0)}>Guess</th>
            <th className="text text-center" key={generateKey("t", props.value, 1)}>C1</th>
            <th className="text text-center" key={generateKey("t", props.value, 2)}>C2</th>
        </tr>
    );
}

function Data(props) {
    return (
        <tr key={generateKey("t", props.value)}>
            <td className="text text-center" key={generateKey("t", props.value, 0)}>{props.history.guess}</td>
            <td className="text text-center" key={generateKey("t", props.value, 1)}>{props.history.ones}</td>
            <td className="text text-center" key={generateKey("t", props.value, 2)}>{props.history.twos}</td>
        </tr>
    );
}

/* ----- Validation Results Page ----- */

function Results() {
    const reduxResult = useSelector(selector.guess);
    const reduxStatus = useSelector(selector.status);

    const routerHistory = useHistory();

    const evaluatingStatus = function() {
        if (reduxStatus <= Status.InProgress) {
            routerHistory.push("/playing");
        } else {
            routerHistory.push("/game-over");
        }
    };

    return (
        <div className="game-container flex flex-column flex-main-evenly flex-cross-center">
            <div className="intro text text-justify">
                The results of your submission are shown below:
            </div>
            <div className="game-details-container flex flex-column flex-main-center flex-cross-center">
                <div className="results-large text text-center">
                    Guess: <span className="game-details-value">{reduxResult.guess}</span>
                </div>
                <div className="game-details-container flex flex-row flex-main-center flex-cross-center">
                    <div className="results-label text text-justify">
                        C1: <span className="game-details-value">{reduxResult.ones}</span>
                    </div>
                    <div className="results-label text text-justify">
                        C2: <span className="game-details-value">{reduxResult.twos}</span>
                    </div>
                </div>
            </div>
            <form className="flex flex-column flex-main-center flex-cross-center">
                <div className="gameplay-button">
                    <input className="gameplay-button-labels button-label-submit text text-center" name="continue" value="C O N T I N U E" type="button" onClick={evaluatingStatus}/>
                </div>
            </form>
        </div>
    );
}

/* ----- Game Over Page ----- */

function GameOver() {
    const reduxStatus = useSelector(selector.status);
    const reduxWord = useSelector(selector.word)
    return (
        <React.Fragment>
            <div className="intro text text-justify">
                {reduxStatus === Status.Finished.Won ? "Congratulations! You guessed the unknown word correctly:" : "Game Over! The unknown word is shown below:"}
            </div>
            <div className="unknown-word text text-center">
                {reduxWord}
            </div>
            <div className="intro text text-justify">
                Care to explore the mysteries of the unknown once more?
            </div>
            <form className="flex flex-column flex-main-center flex-cross-center">
                <div className="return-button">
                    <Link to="/">
                        <input className="button-label text text-center" name="return" value="P L A Y   A G A I N" type="button"/>
                    </Link>
                </div>
            </form>
        </React.Fragment>
    );
}

/* ----- Loading Page ----- */

function Loading() {
    return (
        <React.Fragment>
            <img className="loading-animation" id="loading" alt="loading" src={loadingGIF}/>
        </React.Fragment>
    );
}

/* ----- Error Page ----- */

function Error(props) {
    return (
        <React.Fragment>
            <div className="error-title text text-center">
                Error, please refer to the message below:
            </div>
            <div className="error-message text text-center">
                {props.message}
            </div>
        </React.Fragment>
    );
}

export default Game;