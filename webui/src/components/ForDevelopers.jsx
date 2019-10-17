import React from 'react';
import PropTypes from 'prop-types';
import { image } from '../actions/utils'

export default class ForDevelopers extends React.Component {
  render() {
    return (
        <React.Fragment>
          <h2 id="developers">How to get your tool listed in the Switchboard</h2>
          Please check the <a href="https://github.com/clarin-eric/switchboard-doc/documentation/ToolDescriptionSpec.md"> Tool Description Spec </a>
          and other related documents in our <a href="https://github.com/clarin-eric/switchboard-doc"> technical documentation repository </a>.
        </React.Fragment>
    );
  }
}

