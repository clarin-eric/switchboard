// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: UserFAQ.jsx
// Time-stamp: <2019-01-14 10:31:39 (zinn)>
// -------------------------------------------

import React from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import {emailContactCommand} from './../back-end/util';

export default class UserFAQ extends React.Component {
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
      FAQ
      {this.state.showModal ?
        <UserFAQText onClose={this.closeModal}/>
      : null}
    </a>;
  }
}

class UserFAQText extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
  }
  render() {
    return <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} className="userHelpDialog"  width={800} margin={50}>
	    <h2>Frequently Asked Questions</h2>
	  <ul>
	    <li>
	      <em>Q: Is there a way to perform a batch processing of files?</em>
	      <p>
		A: The switchboard is not able to batch processing many documents itself. It can,
		however, invoke a tool capable of batch processing. At the time of writing, there is
		a single tool connected to the switchboard that can batch process documents:
		"WebSty". To invoke WebSty, upload a zip archive of Polish plain text files and
		follow the instructions.
	      </p>	      
	    </li>
	    <li>
	      <em>Q: Is there a way for the switchboard to run tools in a pipeline?</em>
	      <p>
		A: The switchboard is not a workflow engine. It can, however, invoke a tool capable
		of executing pipelines.  The WebLicht workflow engine, for instance, has
		multiple switchboard entries each advertising a complex analysis such as
		constituency parsing or named entity recognition. WebLicht then orchestrates the
		execution of the pipeline that divides the complex analysis in simpler tasks.
	      </p>	      	      
	    </li>
	    <li>
	      <em>Q: Is there a way to give the switchboard two or more resources at once?</em>	    
	      <p>A: At the time of writing, only a single resource can be processed. But we are
		well aware of tools that need two or more inputs (e.g., for aligning speech with
		text).  Please drop us an email so we know that there is considerable interest to
		implement this feature soon!
	      </p>
	    </li>
	    <li>
	      <em>Q: A tool is not working. What should I do? </em>
	      <p>A: Please contact us when a tool does not work as advertised, or when you
		would like to have some tool added to the switchboard.
	      </p>
	    </li>
	    <li>
	      <em>Q: I do not see many well-known tools in the switchboard. Where, for instance, are the NLP tools from Stanford?</em>
	      <p>	      
		A: At the time of writing, the Stanford tools are not <em>directly</em> callable from the
		switchboard. Remember, to connect a tool to the switchboard, the tool developers have to
		perform some integration work (for details, see "For Developers"). However, well-known tools work
		under the hood of WebLicht.  The WebLicht entry for Constituent Parsing, for example,  makes use
		of the Stanford Tokenizer and the Charniak parser. Be assured, the switchboard will
		continue to integrate more tools <em>directly</em> into the switchboard. 
	      </p>	      	      
	    </li>
	    <li>
	      <em>Q: What happens to the research data that is transfered to the switchboard?</em>
	      <p>
		A: The tools that process your resource need to have access to it. For this, your
		research data is uploaded to a temporary file storage onto a CLARIN-based server
		for a limited time. The storage server is secured with a password, so access is restricted to authorized 
		personnel only. All uploaded research data is deleted at regular intervals.
	      </p>
	    </li>
	    <li>
	      <em>Q: What information is collected when visiting the switchboard site?</em>
	      <p> A: The switchboard makes use of cookies and uses Piwik and Google
		Analytics to track user visits.
	      </p>
	    </li>	    
	    <li>
	      <em>Q: Can I use the switchboard to process large files?</em>
	      <p>
		A: It depends on the tool you want the switchboard to call. There are tools that
		only work well and fast for limit file sizes, say less than 5MB. But the
		switchboard makes it easy to call alternative tools for the same input. Use the
		switchboard to find the tools most suitable for your input. And let us know when
		you are not happy with the performance of a tool!
	      </p>
	    </li>
	  </ul>
          <hr />
	  <p>
	    More questions? Please contact the <a href={ emailContactCommand }>Switchboard Team</a>.
	  </p>
        </ModalDialog>
    </ModalContainer>;
  }
}

