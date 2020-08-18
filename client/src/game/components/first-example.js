import React from 'react';

import { Link } from "react-router-dom";

/* ----- Example Page (for C1) ----- */

export default function FirstExample() {
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