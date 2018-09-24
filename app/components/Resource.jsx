// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Resource.jsx
// Time-stamp: <2018-09-24 12:33:33 (zinn)>
// -------------------------------------------

import AltContainer from 'alt-container';
import React from 'react';
import LanguageMenu from './LanguageMenu.jsx';
import MimetypeMenu from './MimetypeMenu.jsx';
import ResourceActions from '../actions/ResourceActions';        

// access to matcher
import Matcher from '../back-end/Matcher';


export default class Resource extends React.Component {
    constructor(props) {
	super(props);

	const resource = props.resource;
	this.handleToolsPerTaskChange = props.passChangeToParent;
	this.includeWebServices       = props.includeWebServices;

	this.hideName                = this.hideName.bind(this); 
	this.showTools               = this.showTools.bind(this, resource);
	this.openResource              = this.openResource.bind(this, resource);
	this.setLanguage             = this.setLanguage.bind(this, resource);
	this.setMimetype             = this.setMimetype.bind(this, resource);
    }

    setLanguage( resource, language ) {
	//	console.log('Resource/setLanguage', resource, language);
	resource.language = { language : language.label,
			      threeLetterCode: language.value };
	ResourceActions.update(resource);	
    }

    setMimetype( resource, mimetype ) {
	// console.log('Resource/setMimetype', resource, mimetype);	
	resource.mimetype = mimetype.value;
	ResourceActions.update(resource);
    }

    showTools(resource) {

	if (resource.language == null) {
	    alert('CLRS: Please identify the language of the resource!');
	    return;
	}

	if (resource.mimetype == null) {
	    alert('CLRS: Please identify the mimetype of the resource!');
	    return;
	}

	let matcher = new Matcher();
	let toolsPerTask = matcher.findApplicableTools( resource, this.includeWebServices );
	this.handleToolsPerTaskChange( toolsPerTask );
    }

    openResource(resource) {
	console.log('Resource/openResource', resource);
	var win = window.open(resource.remoteFilename, '_blank');
	win.focus();	
    }

    hideName( fileName ) {
	return fileName.replace('/download?input=', '');
    }
    
    render() {
        const {resource, passChangeToParent, ...props} = this.props;
	const thStyle = {textAlign:'center'};
	const colStyle = {width:'300px'};
	return (
            <div {...props}>
		
  	      <table padding="1em 1em" border="1px solid #fff">
		<col style={colStyle}/>
		<col style={colStyle}/>
		<col style={colStyle}/>						    
		<tr>
		  <th style={thStyle}>resource</th>
		  <th style={thStyle}>mimetype</th>
		  <th style={thStyle}>language</th>
		</tr>
		<tr className="notes">
		  <td className="note">
  	            <a className="resource-name" href='#' onClick={this.openResource} >
   		      <span>
			<b>name:</b> {this.hideName( resource.name )}
		      </span>
		    </a>		    
		    <div>
		      <b>size:</b> {resource.size} bytes
		    </div>
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
	      </table>

	        <div className="resource-footer">
  	          <button id="showToolsButton" onClick={this.showTools}>Show Tools</button>
	        </div>
	    </div>
	);
    }
}
