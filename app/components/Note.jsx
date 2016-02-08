import React from 'react';
import LanguageMenu from './LanguageMenu.jsx';

export default class Note extends React.Component {
    
    constructor(props) {
	super(props);
	
	this.state = {
	    editing: false
	};
    }
    
    render() {

	console.log("Note.jsx/render", this.props, this.props.task)
	
	if(this.props.task == "language: click here") {
	    return this.renderLanguageNote();
	}	
	
	if(this.state.editing) {
	    return this.renderEdit();
	}

	return this.renderNote();
    }
    
    renderEdit = () => {
	return <input type="text"
	autoFocus={true}
	placeholder={this.props.task}
	onBlur={this.finishEdit}
	onKeyPress={this.checkEnter} />;
    };
    
    renderNote = () => {
	const onDelete = this.props.onDelete;

	console.log('Note.jsx', this.props);
	return (
		<div onClick={this.edit}>
		<span className="task">{this.props.task}</span>
		{onDelete ? this.renderDelete() : null }
	    </div>
	);
    };

    renderLanguageNote = () => {
	return (
		<div>
		<span className="task">{this.props.task}</span>
		<LanguageMenu />	
		</div>
	);
    };
    
    renderDelete = () => {
	return <button className="delete-note" onClick={this.props.onDelete}>x</button>;
    };
    
    edit = () => {
	this.setState({
	    editing: true
	});
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
	
	this.setState({
	    editing: false
	});
    };
}
