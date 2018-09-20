// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Resource.jsx
// Time-stamp: <2018-09-20 17:00:58 (zinn)>
// -------------------------------------------

import AltContainer from 'alt-container';
import React from 'react';
import Toggle   from 'react-toggle';
import LanguageMenu from './LanguageMenu.jsx';
import MimetypeMenu from './MimetypeMenu.jsx';
import ResourceActions from '../actions/ResourceActions';        

// access to matcher
import Matcher from '../back-end/Matcher';


export default class Resource extends React.Component {
    constructor(props) {
	super(props);

	const resource = props.resource;
	console.log('Resource/constructor', resource);
	this.handleToolsPerTaskChange = props.passChangeToParent;

	this.hideName                = this.hideName.bind(this); 
	this.showTools               = this.showTools.bind(this, resource);
	this.openResource              = this.openResource.bind(this, resource);
	this.handleWebServicesChange = this.handleChange.bind(this, 'includeWebServices')
	this.setLanguage             = this.setLanguage.bind(this, resource);
	this.setMimetype             = this.setMimetype.bind(this, resource);
	
	this.state = {
	    includeWebServices: false
	};
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

    handleChange (key, event) {
	this.setState({ [key]: event.target.checked }, function () {
	    // console.log('now, the state has changed...:', key, event, this.state.includeWebServices);
	});
	if (event.target.checked === true) {
	    document.getElementById("showToolsButton").innerHTML = 'Show Tools and Web Services';
	} else {
	    document.getElementById("showToolsButton").innerHTML = 'Show Tools';	    
	}
    }
    
    showTools(resource) {

	let includeWebServices = this.state.includeWebServices;
	if (resource.language == null) {
	    alert('CLRS: Please identify the language of the resource!');
	    return;
	}

	if (resource.mimetype == null) {
	    alert('CLRS: Please identify the mimetype of the resource!');
	    return;
	}

	let matcher = new Matcher();
	let toolsPerTask = matcher.findApplicableTools( resource, includeWebServices );
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
	return (
            <div {...props}>
  	      <div className="resource-header">
  	        <a className="resource-name"
	           href='#' onClick={this.openResource}
		   >
	    	   <span>Link to Resource</span>
		</a>
		  <Toggle
	             defaultChecked={false}
	             onChange={this.handleWebServicesChange} />	    
	        <div className="resource-add-note">
  	          <button id="showToolsButton" onClick={this.showTools}>Show Tools</button>
	        </div>
	      </div>
		<ul className="notes">
		<li className="note" key="resourceName" >
		  <div>
   		    <span className="note">name: {this.hideName( resource.name )}</span>
		  </div>		
		</li>
		<li className="note" key="resourceSize" >
		  <div>
		    <span className="note">size: {resource.size} bytes</span>
		  </div>				 
   		</li>
		<li className="note" key="resourceMimetype" >
 		  <div>
		    <span className="note">mimetype</span>
    		    <MimetypeMenu defaultValue = { {label: resource.mimetype,
						    value: resource.mimetype
						   }
						 }
				  onMimetypeSelection={this.setMimetype} />	
		  </div>		
		  </li>		  		  				
		<li className="note" key="resourceLanguage" >
 		  <div>
		    <span className="note">language</span>
		    <LanguageMenu defaultValue = { { label: resource.language.language,
						     value: resource.language.threeLetterCode
						   }
						 }
				  onLanguageSelection={this.setLanguage} />	
		  </div>		  
   		</li>
		</ul>		
	    </div>
	);
    }


}
