import React from 'react';
import ReactSelectize from 'react-selectize';
import LaneActions from '../actions/LaneActions';

var MultiSelect = ReactSelectize.MultiSelect;

export default class LanguageMenu extends React.Component {

    constructor(props) {
	super(props);
	this.addLanguageCode = this.addLanguageCode.bind(this);		
	this.selectedLanguages = [];
    }

    addLanguageCode( laneId, languageCode ) {
	LaneActions.addLanguageCode({
	    languageCode: languageCode,
	    laneId
	});
	console.log('DropArea/addLanguageCode', laneId, languageCode);
    }
    
    render() {
	var options = ["Any Language", "Dutch", "English", "Danish", "German", "Latin", "French", "Spanish", "Italian", "Turkish", "Swedish", "Japanese", "Arabic"].map(function(language){
                return {label: language, value: language}
                   });
        return <MultiSelect options = {options}
	                    placeholder = "Select language(s)"
	                    onValuesChange = { function(selectedLanguages){
                                console.log("LanguageMenu/onValuesChange", selectedLanguages, this);
				this.setState({selectedLanguages: selectedLanguages});
				this.selectedLanguages = selectedLanguages;
			    }.bind(this)}>
	       </MultiSelect>
    }
}
