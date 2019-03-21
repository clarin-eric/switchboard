// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Resource.jsx
// Time-stamp: <2019-03-18 13:08:02 (zinn)>
// -------------------------------------------

import React from 'react';
import LanguageMenu from './LanguageMenu.jsx';
import MimetypeMenu from './MimetypeMenu.jsx';
import AlertMissingInfo from './AlertMissingInfo.jsx';
import AlertNoTools from './AlertNoTools.jsx';

// access to matcher
import MatcherRemote from '../back-end/MatcherRemote';


export default class Resource extends React.Component {
    constructor(props) {
	super(props);

	this.resource = props.resource;

	this.handleResourcesChange = props.onResourcesChange;
	this.handleToolsChange     = props.onToolsChange;	
	
	this.hideName      = this.hideName.bind(this); 
	this.showTools     = this.showTools.bind(this);
	this.openResource  = this.openResource.bind(this);
	this.setLanguage   = this.setLanguage.bind(this);
	this.setMimetype   = this.setMimetype.bind(this);

	this.state = { showAlertMissingInfo: false,
		       showAlertNoTools: false,
		     };

	console.log('Resource/constructor', this.resource);
    }

    setLanguage( language ) {
	console.log('Resource/setLanguage', this.resource, language, _paq);

	_paq.push(["trackEvent", 'setLanguage', language.label]); 	    	
	this.resource.language = { language : language.label,
				   threeLetterCode: language.value };
	this.handleResourcesChange(this.resource);	
    }

    setMimetype( mimetype ) {
	console.log('Resource/setMimetype', this.resource, mimetype, _paq);	

	_paq.push(["trackEvent", 'setMimetype', this.resource.mimetype]); 	    
	this.resource.mimetype = mimetype.value;
	this.handleResourcesChange(this.resource);		
    }

    showTools() {

	_paq.push(["trackEvent", 'showTools', this.resource.language.label, this.resource.mimetype]); 	    
	console.log('Resource/showTools', this.resource);

	if ( (this.resource.language == null) || (this.resource.mimetype == null)) {
	    this.setState({showAlertMissingInfo: true} );			    
	    return;
	}

	const matcher = new MatcherRemote( true );
	const toolsPromise = matcher.getApplicableTools( this.resource.mimetype, this.resource.language.threeLetterCode );
	const that = this;
	toolsPromise.then(
	    function(resolve) {
		console.log('Resource.jsx/showTools succeeded', resolve);
		if (resolve.length == 0) {
		    that.setState({showAlertNoTools: true} );			    		    
		} else {
		    that.handleToolsChange( resolve );
		}
	    },
	    function(reject) {
		console.log('Resource.jsx/showTools failed', reject);
	    });	    
    }

    openResource() {
	console.log('Resource/openResource', this.resource);
	var win = window.open(this.resource.remoteFilename, '_blank');
	win.focus();	
    }

    hideName( fileName ) {
	/* omit old URL prefixes
	   invoking the switchboard from https://weblicht.sfs.uni-tuebingen.de/clrs-dev/#/ or
	    https://weblicht.sfs.uni-tuebingen.de/clrs/#/
	*/
	
    	var fileNameNoPrefix = fileName.replace('/clrs-dev', '');
	fileNameNoPrefix = fileNameNoPrefix.replace('/clrs', '');
	fileNameNoPrefix = fileNameNoPrefix.replace('/download?input=', '');
	return fileNameNoPrefix.substring(0,40);
    }
    
    render() {
        const {resource, ...props} = this.props;
	this.resource = resource;
	
	const thStyle = {textAlign:'center'};
	const colStyle = {width:'300px'};
	const tableStyle = {
	    borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'solid',
            borderRadius: 4,
            margin: 10,
            padding: 10,
	    marginLeft: 20,
            width: 785,
	    height:160,
	    resize: 'none',
	    transition: 'all 0.5s',
	    display:'inline-block'
	};

	console.log('Resource/render', resource);

	if (resource === undefined)  {
	    return null;
	} else {
	    return (
	     <div className="resources">
		<h3 id="resourceHeading">Input Analysis</h3>
  		<table style={tableStyle} >
		<colgroup>
		  <col style={colStyle}/>
		  <col style={colStyle}/>
		  <col style={colStyle}/>
		</colgroup>
		<thead>
		  <tr>
		    <th style={thStyle}>Resource</th>
		    <th style={thStyle}>MIME type</th>
		    <th style={thStyle}>Language</th>
		  </tr>
		</thead>
		<tbody>
		  <tr className="notes">
		    <td className="note">
  	              <a className="resource-name" href='#' onClick={this.openResource} >
   			<span>
			  <b>File name:</b> {this.hideName( resource.name )}
			</span>
		      </a>		    
		    </td>
		    
		    <td className="note">
    		      <MimetypeMenu defaultValue = { {label: resource.mimetype,
		  				      value: resource.mimetype
						     }
						   }
		onMimetypeSelection={this.setMimetype} />	
		    </td>
		    <td className="note">
		      <LanguageMenu defaultValue = { { label: resource.language.language,
						       value: resource.language.threeLetterCode
						     }
						   }
		onLanguageSelection={this.setLanguage} />	
		    </td>		  
                  </tr>
		  <tr>
		    <td></td>
		    <td></td>
		    <td>
		      <div className="resource-footer">
  		    <button id="showToolsButton" onClick={this.showTools}>Show Tools</button>
		      </div>
		    </td>
		  </tr>
		</tbody>
	      </table>
	      {this.state.showAlertMissingInfo ?
		 <AlertMissingInfo onCloseProp={ () => this.setState( {showAlertMissingInfo: false} ) } /> 
	       : null }
	      {this.state.showAlertNoTools ?
		 <AlertNoTools onCloseProp={ () => this.setState( {showAlertNoTools: false} ) } /> 
		 : null }		    		
	    </div>
	    );
	}
    }
}
