import React from 'react';

import { ApolloProvider } from '@apollo/client';
import { useQuery } from '@apollo/client';

import { client, policy, GraphQL } from './interfaces/client';

import { BrowserRouter, Switch, Route, Link, useHistory } from "react-router-dom";

import { Provider, useSelector, useDispatch } from 'react-redux';
import { slice, selector, store } from './interfaces/store';

import StartPage from './components/start';

import FirstExample from './components/first-example';
import SecondExample from './components/second-example';

import Playing from './components/playing';

import { generateKey, Status } from './components/common';

import './core.css';

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
                                        <Playing/>
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

export default Game;