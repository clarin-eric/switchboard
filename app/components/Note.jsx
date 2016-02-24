import React from 'react';
import LanguageMenu from './LanguageMenu.jsx';
import MimetypeMenu from './MimetypeMenu.jsx';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';        
import NoteStore from '../stores/NoteStore';

export default class Note extends React.Component {
    
    constructor(props) {
	super(props);
	const id = props.note.id;
	
	this.setLanguage = this.setLanguage.bind(this, id);
	this.setMimetype = this.setMimetype.bind(this, id);	
    }

    setLanguage( id, language ) {
	//console.log('Note.jsx/setLanguage', language);	
	var myNote = NoteActions.getNote( id );
	var entireState = NoteStore.getState();
	myNote = entireState.selectedNote[0];
	var laneId = myNote.belongsTo;
	var languageValue = null;	
	if (language === undefined) {
	    //console.log('Note.jsx/setLanguage: language is undefined!');
	} else {
	    languageValue = language.value;
	    //console.log('Note.jsx/setLanguage: language set to', languageValue);	    
	}
	LaneActions.addLanguage({
	    language: languageValue,
	    laneId
	});
    }

    setMimetype( id, mimetype ) {
	//console.log('Note.jsx/setMimetype', mimetype);
	var myNote = NoteActions.getNote( id );
	var entireState = NoteStore.getState();
	myNote = entireState.selectedNote[0];
	var laneId = myNote.belongsTo;
	var mimetypeValue = null;	
	if (mimetype === undefined) {
	    //console.log('Note.jsx/setMimetype: mimetype is undefined!');
	} else {
	    mimetypeValue = mimetype.value;
	    //console.log('Note.jsx/setMimetype: mimetype set to', mimetypeValue);	    
	}	    
	LaneActions.addMimetype({
	    mimetype: mimetypeValue,
	    laneId
	});
    }
    
    render() {

	// show LanguageMenu
	if(this.props.note.task.indexOf("language:") !== -1) {
	    return this.renderLanguageNote();
	}	

	// show MimetypeMenu
	if(this.props.note.task.indexOf("type:") !== -1) {
	    return this.renderMimetypeNote();
	}	

	// defailt rendering (not editable)
	return this.renderNote();
    }
    
    renderNote = () => {
	return (
		<div onClick={this.edit}>
		<span className="note">{this.props.note.task}</span>
	    </div>
	);
    };

    renderLanguageNote = () => {
	return (
 	    <div>
	      <span className="note">language</span>
	      <LanguageMenu onLanguageSelection={this.setLanguage}
	    />	
	    </div>
	);
    };

    renderMimetypeNote = () => {
	const mimetypeWithoutPrefix = this.props.note.task.substring(8, this.props.note.task.length);
	return (
 	    <div>
	      <span className="note">mimetype</span>
    		<MimetypeMenu defaultValue = { {label: mimetypeWithoutPrefix,
						value: mimetypeWithoutPrefix}
					     }
	                    onMimetypeSelection={this.setMimetype} />	
	    </div>
	);
    };
}
