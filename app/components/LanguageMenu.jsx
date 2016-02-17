import React from 'react';
import ReactSelectize from 'react-selectize';
import LaneActions from '../actions/LaneActions';

// var MultiSelect = ReactSelectize.MultiSelect;
var SimpleSelect = ReactSelectize.SimpleSelect;
export default class LanguageMenu extends React.Component {

    constructor(props) {
	super(props);
    }

    render() {

	const { onLanguageSelection, ...props } = this.props;
	
	// mapping language names with ISO 639-3, will be informed by tool registry entries
	var options = [
	    { label: "Any Language",
	      value: "any"
	    },
	    { label: "Dutch",
	      value: "nld"
	    },
	    { label: "English",
	      value: "eng"
	    },
	    { label: "Danish",
	      value: "dan"
	    },
	    { label: "German",
	      value: "deu"
	    },
	    { label: "Latin",
	      value: "lat"
	    },
	    { label: "French",
	      value: "fra"
	    },
	    { label: "Spanish",
	      value: "spa"
	    },
	    { label: "Italian",
	      value: "ita"
	    },
	    { label: "Turkish",
	      value: "tur"
	    },
	    { label: "Swedish",
	      value: "swe"
	    },
	    { label: "Arabic",
	      value: "ara"
	    },	    
	    { label: "Japanese",
	      value: "jap"
	    }].map(function(language){
                return {label: language.label, value: language.value}
                       });
	
        return <SimpleSelect options = {options}
 	                     placeholder = "Select language"
	                     onValueChange = {this.props.onLanguageSelection}
  	       >
	       </SimpleSelect>
    }
}
