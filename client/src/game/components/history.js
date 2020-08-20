import React from 'react';

import { useQuery } from '@apollo/client';
import { policy, GraphQL } from '../interfaces/client';

import { Link } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { slice, selector } from '../interfaces/store';

import { generateKey } from './common';

/* ----- History of Guesses Page ----- */

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

export default function History() {
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