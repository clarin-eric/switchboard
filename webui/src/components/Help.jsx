import React from 'react';
import PropTypes from 'prop-types';
import FAQ from './FAQ';
import ForDevelopers from './ForDevelopers';
import { image } from '../actions/utils'

export default class Help extends React.Component {
  render() {
    return (
        <React.Fragment>
          <UserHelp/>
          <FAQ/>
          <ForDevelopers/>

          <hr/>
          <p> For any questions please <a href={'mailto:'+this.props.contact}>contact the Switchboard team</a>. </p>
        </React.Fragment>
    );
  }
}

class UserHelp extends React.Component {
  render() {
    return (
        <React.Fragment>
          <h2 id="help">How to use the Language Resource Switchboard</h2>
          <p>The switchboard helps you to find and start tools that can process your research data.
            You have three options to enter your resource:
          </p>
            <center>
              <img style={{width: '75%', height: '75%'}} src={image("dropResources.png")} />
            </center>
            <ul>
              <li>Drag your data from your file manager to the left-most area. Alternatively, click
                on the area to select a file to be uploaded. </li>
              <li>Paste any URL that refers to your resource into the middle box, say, a shared link from
                your B2DROP account. </li>
              <li>Type any (plain) text into the right-most dotted area. For longer texts, please save it
                to the file, and use the first upload method.</li>
            </ul>

          <p>
            Note. When the switchboard is invoked via the Virtual Language Observatory, or via
            B2DROP, or (in the future) via the Virtual Collection Registry, the "file drop" happens during the
            transferal.
          </p>

          <p>
            Once your research data has been uploaded, ...
          </p>
          <ol>
            <li>an information pane appears with basic information about the file. Please verify
              the mediatype and language, and correct it when necessary.  Then, click on <b>Show Tools</b>.
            </li>
            <li>In the Tools View, click on a tool of interest to get additional information
            about the selected tool. Then use <b>Click to start tool</b> to open the selected
            tool in a new browser tab.
            </li>
          </ol>

          <h3>For transferals from the Virtual Language Observatory</h3>
            <p>
              When the LRS is called from the VLO, please beware. The resource of interest may not be
              accessible to the switchboard because:
            </p>
            <ul>
              <li>it is behind an authentication wall, or</li>
              <li>the resource link points to a viewer application that shows the resource, not to
                the resource itself.</li>
            </ul>
            <p>
              In these cases, try downloading the resource from the resource provider, then use the
              file drop mechanism at <a href="https://switchboard.clarin.eu"> https://switchboard.clarin.eu</a>.
            </p>
        </React.Fragment>
    );
  }
}

