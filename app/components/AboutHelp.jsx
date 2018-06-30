// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: AboutHelp.jsx
// Time-stamp: <2018-06-29 20:21:25 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import {emailContactCommand} from './../back-end/util';

export default class AboutHelp extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }
  state = {
    showModal: false,
  }
  openModal = () => {
    this.setState({showModal: true});
  }
  closeModal = () => {
    this.setState({showModal: false});
  }
  render() {
    return <a className={this.props.className} onClick={this.openModal}>
      About
      {this.state.showModal ?
        <AboutHelpText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class AboutHelpText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="devHelpDialog" width={800} top={100}>
          <div className="content" id="about">
	  
            <h2>About</h2>
	    <center><p><small><b><em>Leave Help with ESC</em></b></small></p></center>
            <p>
              The Language Resource Switchboard (LRS) is being developed 
              within the <a href="http://www.clarin.eu/">CLARIN-PLUS</a> project
              as a means to link linguistic resources with the tools that can process them.
	      <em>Tool developers</em>, please contact us in case you want your tool registered with
              the switchboard!
            </p>
            
            <h3>Documentation</h3>
            <ul>
	      <li>Please consult "Help" (for users) and "Developer" in the LRS Navigation bar.</li>
              <li>Tool Metadata, see "Developer"</li>
              <li>Frequently Asked Questions, please ask questions now, so we can add them to the FAQ!</li>
            </ul>
	    
            <h3>Publications</h3>
            <ul>
              <li>Claus Zinn. <a href="https://www.clarin.eu/sites/default/files/zinn-CLARIN2016_paper_26.pdf">The CLARIN Language Resource Switchboard. </a>CLARIN 2016 Annual Conference, Aix-en-Provence, France, 2016</li>
              <li>Claus Zinn, Marie Hinrichs, Emanuel Dima, Dieter van Uytvanck. <a href="https://office.clarin.eu/v/CE-2015-0684-LR_switchboard_spec.pdf">The Switchboard specification </a>(Milestone 2.2 of the CLARIN-PLUS project)</li>
              <li>Claus Zinn. <a href="https://office.clarin.eu/v/CE-2016-0881-CLARINPLUS-D2_5.pdf">D2.5 LR Switchboard (software)</a> Deliverable in the CLARIN-PLUS project.</li>	    
            </ul>
	    
            <h3>Credits</h3>
            <p>
              The following people have contributed to the LRS:
            </p>
            <ul>
              <li>Claus Zinn (main developer, responsible for LRS design, back-end and front-end)</li>
	      <li>Marie Hinrichs, Wei Qui (integration of WebLicht)</li>
              <li>Maarten van Gompel (integration of the CLAM Webservices)</li>
              <li>Bart Jongejan (integration of the CLARIN-DK Tool Box)</li>
	      <li>Wojtek Rauk (integration of MorphoDoTa, WebSty, Morfeusz, Liner2 etc.)</li>		
	      <li>Rafael Jaworski (integration of Concraft, Nerf, Spejd etc)</li>		
	      <li>Josef Misutka and Pavel Stranak (UDPipe)</li>		
              <li>Twan Goosen (integration of the VLO with the switchboard) </li>		
              <li>Dieter Van Uytvanck (feedback on specification and usability)</li>
              <li><em>Your Name Here</em> (integration of <em>your</em> tool)</li>
            </ul>
            <p>
              Icons by <a href="http://glyphicons.com/">Glyphicons</a> and <a href="http://fontawesome.io/icons/">Font Awesome</a>.
            </p>
	    
            <h3 id="sources">Source code</h3>
            <p>
              The <a href="https://github.com/clarin-eric/LRSwitchboard">LRS GitHub repository</a> provides
	      the source code.
            </p>
	    
            <h3 id="licence">Licence</h3>
            <div className="licenceText">
              <p>Copyright (C) 2017- CLARIN ERIC</p>
              <p>This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.</p>
              <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.</p>
              <p>You should have received a copy of the GNU General Public License along with this program. If not, see <a href="http://www.gnu.org/licenses/">http://www.gnu.org/licenses/</a>.</p>
            </div>
	    
            <h3>Technology used</h3>
            <ul>
              <li><a href="https://facebook.github.io/react/">ReactJS</a> (version 15.6.1)</li>
	      <li><a href="https://nodejs.org/en/">Nodejs</a> (version 8.11.1)</li>
	      <li><a href="https://www.npmjs.com">Javascript package manager npm</a> (version 5.6.0)</li>
	      <li><a href="http://alt.js.org/docs/components/altContainer/">altjs</a> (version 0.18.6)</li>
	      <li><a href="https://webpack.github.io">Webpack Javascript module bundler</a>(version 4.12.0)</li>
	      <li><a href="http://www.json.org">JSON (JavaScript Object Notation)</a></li>
              <li><a href="http://tika.apache.org/">Apache Tika (tika-server-1.16.jar)</a></li>
            </ul>
	    
	    <p>
	      The <a href="https://github.com/clarin-eric/LRSwitchboard">LRS GitHub
		repository</a> hosts a <code>package.json</code> file that defines all Javascript dependencies.
	    </p>
          </div>

	  <p>
	    We value your feedback! For any questions or suggestions, please contact the <a href={ emailContactCommand }>Switchboard Team</a>. But please consult the user and developer help beforehand (see top navigation bar).
	  </p>
        </ModalDialog>
</ModalContainer>;
  }
}
