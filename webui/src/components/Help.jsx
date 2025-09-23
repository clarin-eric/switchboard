import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import FAQ from './FAQ';
import ForDevelopers from './ForDevelopers';
import {image} from '../actions/utils'
import {clientPath} from '../constants';

export default class Help extends React.Component {
  render() {
    return (
        <div className="container">
        <div className="row">
        <div className="col-md-10 col-md-offset-1">
          <UserHelp/>
          <FAQ/>
          <ForDevelopers/>

          <hr/>
          <p> For any questions please <a href={'mailto:'+this.props.contact}>contact the Switchboard team</a>. </p>
        </div>
        </div>
        </div>
    );
  }
}

class UserHelp extends React.Component {
  render() {
    return (
        <React.Fragment>
          <h2 id="help">How to use the Language Resource Switchboard</h2>
          <p>The Switchboard helps you to find and start tools that can process your research data.
            You have three options to enter your resource (in the <Link to={clientPath.input}>Upload</Link> page):
          </p>
            <ul>
              <li>Drag your data from your file manager to drop area in the Upload File tab.
                  Or you can click on the drop area to select a file to be uploaded. </li>
              <li>Paste any URL that refers to your resource into the input box in the Submit URL tab.
                  For example, you can input a shared link from your B2DROP account. </li>
              <li>Type any (plain) text into the input area in the Submit Text tab.
                  For longer texts, please save it to the file, and use the first upload method.</li>
            </ul>

          <p>
              <b>Note:</b> When the Switchboard is invoked from an external repository (e.g. the Virtual Language Observatory
              or B2DROP), the "file drop" happens automatically.
          </p>

          <p>
            Once your research data has been uploaded, an information pane appears with basic information about the file.
            Please verify the <em>mediatype</em> and <em>language</em>, and correct it when necessary.
            The list of tools is automatically displayed.
          </p>

          <p>
            You can now click on any tool to get additional information about it.
            If you have found a tool you would like to try, use the <em>Start Tool</em> button to open the selected tool in a new browser tab.
          </p>

          <h3>Troubleshooting</h3>
            <p>
              When the Switchboard is called from external repositories (e.g. the Virtual Language Observatory
              or B2DROP) please note that the resource may not be accessible to the Switchboard. This can happen for various reasons:
            </p>
            <ul>
              <li>either the resource is behind an authentication wall, </li>
              <li>or the resource link points to another web page, and not to the resource itself.</li>
            </ul>
            <p>
              In these cases, try downloading the resource from the resource provider, then use the
              file drop mechanism from the <Link to={clientPath.input}>Upload</Link> page.
            </p>
        </React.Fragment>
    );
  }
}

