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
