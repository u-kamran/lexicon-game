import React from 'react';

import { useQuery, useMutation } from '@apollo/client';
import { policy, GraphQL } from '../interfaces/client';

import { Link, useHistory } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { slice, selector } from '../interfaces/store';

import Loading from './loading';

import { generateKey, Status } from './common';

/* ----- Playing Page ----- */

function Letter(props) {
    return (
        <div className="guess-text-container">
            <input className="guess-text-label text text-center" id={props.name} name={props.name} placeholder="" maxLength="1" type="text"/>
        </div>
    );
}

export default function Playing() {
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

    const [submitGuess] = useMutation(
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

    const [surrendered] = useMutation(
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