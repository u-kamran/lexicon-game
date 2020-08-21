import React from 'react';

import { useHistory } from "react-router-dom";

import { useSelector } from 'react-redux';
import { selector } from '../interfaces/store';

import { Status } from './common';

/* ----- Validation Results Page ----- */

export default function Results() {
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