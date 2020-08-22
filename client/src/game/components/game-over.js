import React from 'react';

import { Link } from "react-router-dom";

import { useSelector } from 'react-redux';
import { selector } from '../interfaces/store';

import { Status } from './common';

/* ----- Game Over Page ----- */

export default function GameOver() {
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