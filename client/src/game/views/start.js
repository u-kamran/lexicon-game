import React from 'react';

import { useMutation } from '@apollo/client';

import { GraphQL } from '../interfaces/client';

import { Link, useHistory } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { slice, selector } from '../interfaces/store';

import Loading from './loading'

/* ----- Starting Page of the Game ----- */

export default function StartPage() {
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