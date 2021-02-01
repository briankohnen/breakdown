import React from 'react';
import './checkbox.css';

function Checkbox(props) {

    return (
        <>
        <input type='checkbox' name={props.name} checked={props.checked} onChange={props.onCheckboxChange}></input>
            <label htmlFor={props.name}>{props.name}</label>
        <br></br>
        </>
    )
};

export default Checkbox;