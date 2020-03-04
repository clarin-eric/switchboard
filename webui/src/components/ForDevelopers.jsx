import React from 'react';
import PropTypes from 'prop-types';
import { image } from '../actions/utils'

export default class ForDevelopers extends React.Component {
  render() {
    return (
        <React.Fragment>
          <h2 id="developers">How to get your tool listed in the Switchboard</h2>

          Please check the
          <a href="https://github.com/clarin-eric/switchboard-tool-registry#how-to-add-a-tool-to-the-switchboard"> Switchboard Tool Registry </a>
          where you will find step by step documentation for adding a new tool.

          The
          <a href="https://github.com/clarin-eric/switchboard-doc"> technical documentation repository </a>
          also contains a useful
          <a href="https://github.com/clarin-eric/switchboard-doc/blob/master/documentation/ToolDescriptionSpec.md"> description specification </a>
          for the Switchboard tools.
        </React.Fragment>
    );
  }
}

