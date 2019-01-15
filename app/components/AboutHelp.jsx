// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: AboutHelp.jsx
// Time-stamp: <2019-01-14 10:31:03 (zinn)>
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
          <ModalDialog onClose={this.props.onClose} className="aboutDialog" width={800} margin={50}>
          <div className="content" id="about">
	  
            <h2>About</h2>
            <p>
              The Language Resource Switchboard (LRS) has been developed 
              within the <a href="http://www.clarin.eu/">CLARIN-PLUS</a> project. It helps 
	      users to find and start tools that can process their research data.
            </p>
            
            <h3>Documentation</h3>
            <ul>
	      <li>Users, please consult "Help" navigation bar. There is also a FAQ, see page footer.</li>
	      <li>Developers, please consult "For Developers" in the footer of the page.</li>	      
            </ul>
	    
            <h3>Publications</h3>
            <ul>
	      <li>Claus Zinn, The Language Resource Switchboard. Computational Linguistics 44(4), pages 631-639, December 2018.</li>
              <li>Claus Zinn. <a href="http://www.ep.liu.se/ecp/147/004/ecp17147004.pdf">A Bridge
              from EUDAT's B2DROP cloud service to CLARIN's Language Resource
              Switchboard </a>Selected papers from the CLARIN Annual Conference 2017, Budapest,
              18-20 September 2017, Linköping University Electronic Press vol. 147, pages 36-45,
              2018.</li>
	      <li>Claus
	      Zinn. <a href="https://www.clarin.eu/sites/default/files/zinn-CLARIN2016_paper_26.pdf">
	      The CLARIN Language Resource Switchboard.</a> CLARIN 2016 Annual Conference,
	      Aix-en-Provence, France, 2016.</li>
              <li>Claus Zinn, Marie Hinrichs, Emanuel Dima, Dieter van
              Uytvanck. <a href="https://office.clarin.eu/v/CE-2015-0684-LR_switchboard_spec.pdf">The
		  Switchboard specification </a>(Milestone 2.2 of the CLARIN-PLUS project).</li>
              <li>Claus
              Zinn. <a href="https://office.clarin.eu/v/CE-2016-0881-CLARINPLUS-D2_5.pdf">D2.5 LR
              Switchboard (software)</a> Deliverable in the CLARIN-PLUS project.</li>
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
	      <li>Rafael Jaworski (integration of Concraft, Nerf, Spejd etc.)</li>		
	      <li>Josef Misutka and Pavel Stranak (UDPipe)</li>		
              <li>Twan Goosen (switchboard integration in the VLO, Use Cases) </li>
	      <li>André Moreira (Use Cases, Dockerization)</li>
              <li>Dieter Van Uytvanck (feedback on specification and usability, Use Cases)</li>
              <li><em>Your Name Here</em> (integration of <em>your</em> tool)</li>
            </ul>
            <p>
              Icons by <a href="http://glyphicons.com/">Glyphicons</a>
              and <a href="https://fontawesome.com/license/free">Font Awesome</a>.
            </p>
	    
    
            <h3 id="licence">Licence</h3>
            <div className="licenceText">
              <p>Copyright (C) 2017- CLARIN ERIC</p>
	      
              <p>
		This program is free software: you can redistribute it and/or modify it under the
		terms of the GNU General Public License as published by the Free Software Foundation,
		either version 3 of the License, or (at your option) any later version.
	      </p>
	      
              <p>
		This program is distributed in the hope that it will be useful, but WITHOUT ANY
		WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
		PARTICULAR PURPOSE. See the GNU General Public License for more details.
	      </p>
	      
              <p>
		You should have received a copy of the GNU General Public License along with this
		program. If not, see <a href="http://www.gnu.org/licenses/">http://www.gnu.org/licenses/</a>.
	      </p>
	      
            </div>
	    
          <h3>Technology and Source Code</h3>
            <ul>
              <li><a href="https://facebook.github.io/react/">ReactJS</a> (version 15.6.2</li>
	      <li><a href="https://nodejs.org/en/">Nodejs</a> (version 8.11.3)</li>
	      <li><a href="https://www.npmjs.com">Javascript package manager npm</a> (version 5.6.0)</li>
	      <li><a href="http://alt.js.org/docs/components/altContainer/">altjs</a> (version 0.18.6)</li>
	      <li><a href="https://webpack.github.io">Webpack Javascript module bundler</a>(version 4.12.0)</li>
	      <li><a href="http://www.json.org">JSON (JavaScript Object Notation)</a></li>
              <li><a href="http://tika.apache.org/">Apache Tika (tika-server-1.16.jar)</a></li>
	      <li><a href="https://www.docker.com/">Docker</a> (for deployment)</li>
          </ul>

            <p>
              The <a href="https://github.com/clarin-eric/LRSwitchboard">LRS GitHub repository</a> provides
	      the source code. It also hosts a <code>package.json</code> file that defines all Javascript dependencies.
	    </p>
          </div>

	  <p>
	    We value your feedback! For any questions or suggestions, please contact the <a href={ emailContactCommand }>Switchboard Team</a>. 
	  </p>
        </ModalDialog>
</ModalContainer>;
  }
}
