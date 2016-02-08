import React from 'react';
import LanguageMenu from './LanguageMenu.jsx';
import MimetypeMenu from './MimetypeMenu.jsx';

export default class Editable extends React.Component {

    constructor(props) {
	super(props);
    }

    render() {
	const {value, onEdit, onValueClick, editing, ...props} = this.props;

	return (
		<div {...props}>
		{editing ? this.renderEdit() : this.renderValue()}
	    </div>
	);
    }

    renderEdit = () => {
	return <input type="text"
	        autoFocus={true}
  	        placeholder={this.props.value}
	        onBlur={this.finishEdit}
	        onKeyPress={this.checkEnter} />;
    };
    
    renderValue = () => {
	const onDelete = this.props.onDelete;

	// special treatment for languages
	if (this.props.value === "language: click here") {
	    console.log("Editable/renderValue: LanguageMenu", this.props.value);
	    return (
		    <div>
		    <span className="task" width="2cm">{this.props.task}</span>
		    <LanguageMenu />	
		    </div>
	    );
	}
	
	// special treatment for mimetypes
	if (this.props.value.indexOf("type") > - 1) {
	    console.log("Editable/renderValue: Mimetype", this.props.value);
	    return (
		    <div>
		    <span className="task" width="2cm">{this.props.task}</span>
		    <MimetypeMenu tags = { this.props.value } />
		    </div>
	    );   
	}

	console.log("Editable/renderValue: else", this.props.value);	
	return (
		<div onClick={this.props.onValueClick}>
		<span className="value">{this.props.value}</span>
		{onDelete ? this.renderDelete() : null }
	    </div>
	);

    };
    
    renderDelete = () => {
        console.log('renderDelete', this.props);	
	return <button className="delete" onClick={this.props.onDelete}>x</button>;
    };
    
    checkEnter = (e) => {
	if(e.key === 'Enter') {
	    this.finishEdit(e);
	}
    };
    
    finishEdit = (e) => {
	if(this.props.onEdit) {
	    this.props.onEdit(e.target.value);
	}
    };
}
