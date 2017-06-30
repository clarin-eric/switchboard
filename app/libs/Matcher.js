// The CLARIN Language Resource Switchboard
// 2016-17 Claus Zinn
// 
// File: Matcher.js
// Time-stamp: <2017-06-29 22:29:55 (zinn)>
//
// ----------------------------------------------------------------------------------------

import React, { Component } from 'react';
import uuid from 'node-uuid';
import Registry from '../libs/Registry.js';

export default class Matcher {

    constructor() {
	this.registeredTools = Registry;
    }

    // construct a dictionary to group all tools in terms of the tasks they can perform
    // key: task, value: tools
    groupTools( tools ){
	
	var toolGroups = {};

	for (var i = 0; i<tools.length; i++) {
	    const entry = tools[i];
	    const toolInfo = [ {
		name            : entry.name,
		logo            : entry.logo,
		longDescription : entry.longDescription,
		homepage        : entry.homepage,
		url             : entry.url,
		location        : entry.location,
		authentication  : entry.authentication,
		id              : entry.id,
		email           : entry.contact.email,
		parameter       : entry.parameter,
		lang_encoding   : entry.lang_encoding,
		softwareType    : entry.softwareType,
		postSubmit      : entry.postSubmit,
		mapping         : entry.mapping,
	    } ];

	    if (entry.task in toolGroups) {
		toolGroups[ entry.task ] = toolGroups[ entry.task ].concat( toolInfo );
	    } else {
		toolGroups[ entry.task ] = [].concat( toolInfo );		
	    }
	}
	return toolGroups;
    }

    // return all tools (and web services) of the registry
    // parameter indicates whether web services should be included
    allTools( includeWebServices ) {

	var tools = [];

	// get rid of web services if required
	if (includeWebServices === true) {
	    tools = this.registeredTools;
	} else {
	    tools = this.registeredTools.filter(
		(tool) =>
		    {
			if (! (tool.softwareType == "webService")) {
			    tool.id = uuid.v4();
			    return tool;
			}
		    });
	}
	
	var toolsPerTasks = this.groupTools( tools );

	// should never happen, implies empty tool registry
	// CZ: should be dealt with in the React component (rendering task-oriented list)	
	if (Object.keys(toolsPerTasks).length == 0) {
	    alert("Sorry! The app registry has no tool entries");
	}

	return toolsPerTask;
    }
    
    // multiple filters to be defined, in particular, language code
    findApplicableTools( parameters ) {

	var resourceDescription = parameters[0];
	var includeWebServices = parameters[1];

	// if necessary, filter out web services
	console.log('ToolStore.js/findApplicableTools first and second', resourceDescription, includeWebServices);
	var tools = [];

	// in case web services all excluded, filter out all web services from result list.
	if (includeWebServices === true) {
	    tools = this.registeredTools;
	} else {
	    tools = this.registeredTools.filter(
		(tool) =>
		    {
			if (! (tool.softwareType == "webService")) {
			    tool.id = uuid.v4();
			    return tool;
			}
		    });
	}
	
	// first filter: mimetype
	var mimetypeFilter = tools.filter(
	    (tool) =>
		{
		    var result = tool.mimetypes.indexOf(resourceDescription.mimetype);
		    if (result != -1) {
			// attach id to the tool
			tool.id = uuid.v4();
			return tool;
		    }
		});

	var languageFilter = [];
	
	// second filter: language code 
	if ( (resourceDescription.language == null) || (resourceDescription.language.length == 0)) {
	    console.log('ToolStore/findApplicableTools: empty language', resourceDescription.language); 
	} else {
	    languageFilter = mimetypeFilter.filter(
		(tool) =>
		    {
			var result = tool.languages.indexOf(resourceDescription.language);
			if (result != -1) {
			    // attach id to the tool
			    tool.id = uuid.v4();
			    return tool;
			}
			
			// for tools that are capable for processing any language
			result = tool.languages.indexOf("generic");
			if (result != -1) {
			    // attach id to the tool
			    tool.id = uuid.v4();
			    return tool;
			}
		    });
	}

	// --------------------------------	
	// additional filters coming here..
	// --------------------------------

	// now, for the task-oriented view
	var toolsPerTasks = this.groupTools( languageFilter );

	// CZ: should be dealt with in the React component (rendering task-oriented list)
	if (Object.keys(toolsPerTasks).length == 0) {
	    alert("Sorry! the app registry has no tools applicable to the given resource!");
	}
    }
}
