import React from 'react';

import { Link } from "react-router-dom";

/* ----- Example Page (for C2) ----- */

export default function SecondExample() {
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