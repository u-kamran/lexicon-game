import React from 'react';

/* ----- Error Page ----- */

export default function Error(props) {
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