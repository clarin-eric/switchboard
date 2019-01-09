// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: ShowAllTools.jsx
// Time-stamp: <2018-06-29 20:24:10 (zinn)>
// -------------------------------------------

import React from 'react';

export default class ShowAllTools extends React.Component {
    constructor(props) {
	super(props);
    }

    componentDidMount() {
	this.props.showAllToolsFun();
    }
    
    render() {

	var style = {
	    fontSize: '0.5em',
            margin: 2,
            padding: 2	    
        };

	var transferalInfo = `Transferal from ${this.props.caller}. Please find below a list of all available tools`;
	
	return (
		<h2>
		   <div style={style} >
		     {transferalInfo}
                   </div>
		</h2>	    
	);
    }
}
