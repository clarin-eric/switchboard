import React from 'react';
import LanguageMenu from './LanguageMenu.jsx';
import MimetypeMenu from './MimetypeMenu.jsx';
import ResourceActions from '../actions/ResourceActions';        

export default class Note extends React.Component {
    
    constructor(props) {
	super(props);
	const note = props.note;
	const id = note.id;
	
	this.setLanguage = this.setLanguage.bind(this, note);
	this.setMimetype = this.setMimetype.bind(this, note);	
    }

    setLanguage( note, language ) {
	var resourceId = note.belongsTo;
	var languageValue = null;	
	if (language === undefined) {
	    console.log('Note.jsx/setLanguage: language is undefined!');
	} else {
	    languageValue = language.value;
	}
	ResourceActions.updateLanguage({
	    language: languageValue,
	    resourceId
	});
    }

    setMimetype( note, mimetype ) {
	var resourceId = note.belongsTo;
	var mimetypeValue = null;	
	if (mimetype === undefined) {
	    console.log('Note.jsx/setMimetype: mimetype is undefined!');
	} else {
	    mimetypeValue = mimetype.value;
	}	    
	ResourceActions.updateMimetype({
	    mimetype: mimetypeValue,
	    resourceId
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

	// default rendering (not editable)
	return this.renderNote();
    }
    
    renderNote = () => {
	return (
		<div>
		<span className="note">{this.props.note.task}</span>
	    </div>
	);
    };

    renderLanguageNote = () => {
	const languageWithoutPrefix = this.props.note.task.substring(9, this.props.note.task.length-4);
	const languageCode = this.props.note.task.substring(this.props.note.task.length-3, this.props.note.task.length);
	return (
 	    <div>
	      <span className="note">language</span>
	      <LanguageMenu defaultValue = { {label: languageWithoutPrefix,
					      value: languageCode}
					   }
	                    onLanguageSelection={this.setLanguage} />	
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
