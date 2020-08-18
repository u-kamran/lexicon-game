import React from 'react';

import loadingGIF from './images/loading.gif';

/* ----- Loading Page ----- */

export default function Loading() {
    return (
        <React.Fragment>
            <img className="loading-animation" id="loading" alt="loading" src={loadingGIF}/>
        </React.Fragment>
    );
}