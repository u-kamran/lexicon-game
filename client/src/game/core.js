import React from 'react';

import { ApolloProvider } from '@apollo/client';
import { client } from './interfaces/client';

import { BrowserRouter, Switch, Route } from "react-router-dom";

import { Provider } from 'react-redux';
import { store } from './interfaces/store';

import StartPage from './components/start';

import FirstExample from './components/first-example';
import SecondExample from './components/second-example';

import Playing from './components/playing';
import History from './components/history';
import Results from './components/results';

import GameOver from './components/game-over';

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

export default Game;