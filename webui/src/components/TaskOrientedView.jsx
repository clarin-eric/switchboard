// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
//
// File: TaskOrientedView.jsx
// Time-stamp: <2019-02-28 16:31:37 (zinn)>
// -------------------------------------------

import React from 'react';
import Tool from './Tool.jsx';
import AlertAllowPopupWindows from './AlertAllowPopupWindows.jsx';

import { SegmentedControl } from 'segmented-control-react';

import { TOOLTYPE_QUANTITATIVE_TOOLS,
         TOOLTYPE_ALL_TOOLS,
         TOOLTYPE_QUALITATIVE_TOOLS,
         TOOL_AUTH_ALL_TOOLS,
         TOOL_AUTH_REQUIRED,
         TOOLORDER_BY_TOOL_TASK, TOOLORDER_BY_TOOL_NAME
       } from './../back-end/util';

const toolTypeSegments = [
        { name: 'Quantitative Analysis Tools' },
        { name: 'All Tools' },
        { name: 'Qualitative Analysis Tools' }
];

const toolAuthSegments = [
        { name: 'Only Tools Without Authentication' },
        { name: 'All Tools' }
];

const toolOrderSegments = [
        { name: 'Sort by Task' },
        { name: 'Order Alphabetically' }
 ];

export default class TaskOrientedView extends React.Component {

    constructor(props) {
        super(props);
        this.handleToolAuthChange  = this.handleToolAuthChange.bind(this);
        this.handleToolTypeChange  = this.handleToolTypeChange.bind(this);
        this.handleToolOrderChange = this.handleToolOrderChange.bind(this);
        this.groupTools = this.groupTools.bind(this);
        this.wsSieve = this.wsSieve.bind(this);
        this.authSieve = this.authSieve.bind(this);

        this.state = {
            toolAuth:  TOOL_AUTH_ALL_TOOLS,
            toolType:  TOOLTYPE_ALL_TOOLS,
            toolOrder: TOOLORDER_BY_TOOL_TASK,
            showAlertAllowPopupWindows: false
        };
    }

    authSieve(tool) {
        var result = true;

        switch (this.state.toolAuth) {
        case TOOL_AUTH_REQUIRED:
            result = ( tool.authentication == "no" ? true : false )
            break;
        default:
            result = true;
            break;
        }
        return result;
    }

    handleToolAuthChange(index) {
        console.log(`TaskOrientedView/handleToolAuthChange: selected index for inclusion: ${index}`);
        this.setState( {toolAuth: index} );
    }

    handleToolTypeChange(index) {
        console.log(`TaskOrientedView/handleToolTypeChange: selected index for inclusion: ${index}`);
        this.setState( {toolType: index} );
    }

    handleToolOrderChange(index) {
        console.log(`TaskOrientedView/handleToolOrderChange: selected index for ordering: ${index}`);
        this.setState( {toolOrder: index} );
    }

    groupTools( tools ){

        var toolGroups = {};

        for (var i = 0; i<tools.length; i++) {
            const entry = tools[i];

            // defines the registry entries visible to the outside
            const toolInfo = [ {
                name            : entry.name,
                logo            : entry.logo,
                description     : entry.description,
                homepage        : entry.homepage,
                url             : entry.url,
                location        : entry.location,
                authentication  : entry.authentication,
                id              : entry.id,
                email           : entry.contact.email,
                parameters      : entry.parameters,
                langEncoding    : entry.langEncoding,
                output          : entry.output,
                softwareType    : entry.softwareType,
                requestType     : entry.requestType,
                mapping         : entry.mapping,
            } ];

            if (entry.task in toolGroups) {
                toolGroups[ entry.task ] = toolGroups[ entry.task ].concat( toolInfo );
            } else {
                toolGroups[ entry.task ] = [].concat( toolInfo );
            }
        }

        var toolGroupsSorted = {};

        // now, sort tasks alphabetically
        var keys = [];
        for (var key in toolGroups) {
            if (toolGroups.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        keys.sort();

        for (i in keys) {
            var key = keys[i];
            toolGroupsSorted[ key ] = toolGroups[key];
        }

        return toolGroupsSorted;
    }

    render() {
        const tools = this.props.tools;

        // filter out all web services
        const onlyTools = tools.filter( this.wsSieve );
        const toolsAfterFilter = onlyTools.filter( this.authSieve );

        toolsAfterFilter.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

        const toolsPerTask = this.groupTools(toolsAfterFilter);
        var toolsPerAlphabet = {}
        if ( toolsAfterFilter.length ) {
            toolsPerAlphabet["Alphabetical Order"] = toolsAfterFilter;
        }

        const resource = this.props.resource;

        console.log('TaskOrientedView/re-rendering', this.state, toolsAfterFilter);
        return (
                <div className="task-oriented-view-container">
                  { (toolsAfterFilter.length || tools.length ) ?
                  <div>
                    <h3 id="toolHeading"> Tools </h3>
                    <table width="800px">
                      <tbody>
                        <tr>

                    { /*
                          <td>
                            <SegmentedControl
                              segments={toolTypeSegments}
                              selected={this.state.toolType}
                              variant="dark"
                              onChangeSegment={this.handleToolTypeChange}
                              />
                          </td>
                      */
                    }
                          <td>
                            <SegmentedControl
                              segments={toolOrderSegments}
                              selected={this.state.toolOrder}
                              variant="dark"
                              onChangeSegment={this.handleToolOrderChange}
                              />
                          </td>

                          <td>
                            <SegmentedControl
                              segments={toolAuthSegments}
                              selected={this.state.toolAuth}
                              variant="dark"
                              onChangeSegment={this.handleToolAuthChange}
                              />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    </div>
                    : null }

            {this.state.showAlertAllowPopupWindows ?
             <AlertAllowPopupWindows onCloseProp={ () => this.setState( {showAlertAllowPopupWindows: false} ) } />
             : null }

            { this.state.toolOrder == TOOLORDER_BY_TOOL_TASK ?
              <div>
              {
                  Object.keys(toolsPerTask).map((task, index) =>
                                                      <h3 className="taskHead" key={task}>{task}
                                                      <hr />
                                                      <Tool key={index}
                                                            resource={resource}
                                                            items={toolsPerTask[task]}
                                                            cb={ () => this.setState( {showAlertAllowPopupWindows: true} ) }
                                                            />
                                                      </h3>
                                               )
              }
              </div> :
              <div>
              {
                  Object.keys(toolsPerAlphabet).map((task, index) =>
                                                      <h3 className="taskHead" key={task}>{task}
                                                      <hr />
                                                      <Tool key={index}
                                                            resource={resource}
                                                            items={toolsPerAlphabet[task]}
                                                            cb={ () => this.setState( {showAlertAllowPopupWindows: true} ) }
                                                            />
                                                      </h3>
                                               )
              }

              </div>
            }
            </div>
            )
    }
}

