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
	    { label: "Arabic",
	      value: "ara"
	    },	    
	    { label: "Bulgarian",
	      value: "bul"
	    },
	    { label: "Czech",
	      value: "ces"
	    },
	    { label: "Danish",
	      value: "dan"
	    },
	    { label: "Dutch",
	      value: "nld"
	    },	    
	    { label: "English",
	      value: "eng"
	    },
	    { label: "Estonian",
	      value: "est"
	    },
	    { label: "French",
	      value: "fra"
	    },
	    { label: "German",
	      value: "deu"
	    },
	    { label: "Greek",
	      value: "ell"
	    },
	    { label: "Hungarian",
	      value: "hun"
	    },
	    { label: "Icelandic",
	      value: "isl"
	    },
	    { label: "Italian",
	      value: "ita"
	    },	    
	    { label: "Japanese",
	      value: "jap"
	    },	    
	    { label: "Latin",
	      value: "lat"
	    },
	    { label: "Macedonian",
	      value: "mkd"
	    },
	    { label: "Polish",
	      value: "pol"
	    },
	    { label: "Persian",
	      value: "fas"
	    },
	    { label: "Portugese",
	      value: "por"
	    },	    
	    { label: "Romanian",
	      value: "ron"
	    },
	    { label: "Russian",
	      value: "rus"
	    },
	    { label: "Slovak",
	      value: "slk"
	    },
	    { label: "Slovenian",
	      value: "slv"
	    },	    
	    { label: "Serbian",
	      value: "srp"
	    },
	    { label: "Spanish",
	      value: "spa"
	    },
	    { label: "Swedish",
	      value: "swe"
	    },	    	    
	    { label: "Turkish",
	      value: "tur"
	    },
	    { label: "Ukrainian",
	      value: "ukr"
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
