// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: UserFAQ.jsx
// Time-stamp: <2019-03-19 16:37:25 (zinn)>
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
	      <em>Q: What happens to the research data that is transfered to the Switchboard?</em>
	      <p>
		A: The tools that process your resource need to have access to it. For this, your
		research data is uploaded to a temporary file storage on a CLARIN-based server for
		a limited time. The resource is shared on the basis of a unique URL that is not
		publicly listed and hard to guess. This URL is shared with the tool, which may or
		may not redistribute or store this location. Note that in some cases the URL cannot
		be passed through the tool over a secure (encrypted) channel. All uploaded
		research data is deleted at regular intervals. This procedure is carried out for
		uploaded files, resources provided by reference (pasted URLs and incoming via other
		services) as well as text inserted manually into the input box on the Switchboard
		web page.
	      </p>
	    </li>
	    <li>
	      <em>Q: Can I use the Switchboard with resources containing sensitive or private
	      information, or which are subject to restrictions regarding redistribution?</em>
	      <p>
		A: No. CLARIN does not have full control over the shared resource and therefore cannot
		guarantee its secure transfer, storage or processing. Therefore it is not advised
		to upload files or enter content that contains sensitive or private information, or
		is subject to restrictions regarding redistribution.
	      </p>
	    </li>
	    <li>
	      <em>Q: What information is collected when visiting the Switchboard site?</em>
	      <p> A: The Switchboard makes use of cookies and uses Matomo (Piwik)
		to track user visits.
	      </p>
	    </li>	    	      
	    <li>
	      <em>Q: Is there a way to perform a batch processing of files?</em>
	      <p>
		A: The Switchboard is not able to batch processing many documents itself. It can,
		however, invoke a tool capable of batch processing. At the time of writing, there is
		a single tool connected to the Switchboard that can batch process documents:
		"WebSty". To invoke WebSty, upload a zip archive of Polish plain text files and
		follow the instructions.
	      </p>	      
	    </li>
	    <li>
	      <em>Q: Is there a way for the Switchboard to run tools in a pipeline?</em>
	      <p>
		A: The Switchboard is not a workflow engine. It can, however, invoke a tool capable
		of executing pipelines.  The WebLicht workflow engine, for instance, has
		multiple Switchboard entries each advertising a complex analysis such as
		constituency parsing or named entity recognition. WebLicht then orchestrates the
		execution of the pipeline that divides the complex analysis in simpler tasks.
	      </p>	      	      
	    </li>
	    <li>
	      <em>Q: Is there a way to give the Switchboard two or more resources at once?</em>	    
	      <p>A: At the time of writing, only a single resource can be processed. But we are
		well aware of tools that need two or more inputs (e.g., for aligning speech with
		text).  Please drop us an email so we know that there is considerable interest to
		implement this feature soon!
	      </p>
	    </li>
	    <li>
	      <em>Q: A tool is not working. What should I do? </em>
	      <p>A: Please contact us when a tool does not work as advertised, or when you
		would like to have some tool added to the Switchboard.
	      </p>
	    </li>
	    <li>
	      <em>Q: I do not see many well-known tools in the Switchboard. Where, for instance, are the NLP tools from Stanford?</em>
	      <p>	      
		A: At the time of writing, the Stanford tools are not <em>directly</em> callable from the
		Switchboard. Remember, to connect a tool to the Switchboard, the tool developers have to
		perform some integration work (for details, see "For Developers"). However, well-known tools work
		under the hood of WebLicht.  The WebLicht entry for Constituent Parsing, for example,  makes use
		of the Stanford Tokenizer and the Charniak parser. Be assured, the Switchboard will
		continue to integrate more tools <em>directly</em> into the Switchboard. 
	      </p>	      	      
	    </li>

	    <li>
	      <em>Q: Can I use the Switchboard to process large files?</em>
	      <p>
		A: It depends on the tool you want the Switchboard to call. There are tools that
		only work well and fast for limit file sizes, say less than 5MB. But the
		Switchboard makes it easy to call alternative tools for the same input. Use the
		Switchboard to find the tools most suitable for your input. And let us know when
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

