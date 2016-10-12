# React Center Component

[![npm](https://img.shields.io/npm/v/react-center-component.svg?style=flat-square)](https://www.npmjs.com/package/react-center-component)

This is a higher order component decorator. It centers a component with respect to the window.

It listens for when its children are mounted, then it measures the size of 
these children on the dom. Then it updates the children with appropriate
top and left offsets.

Components that are wrapped with this decorator recieve two properties
topOffset and leftOffset, they are null before the component has mounted.

When the window is resized, this component will reupdate its children. This process
is debounced by 100ms to reduce CPU strain.

# Usage

```javascript
// ES7

import React from 'react';
import centerComponent from 'react-center-component';

@centerComponent
export class ModalDialog extends React.Component {
  static propTypes = {
    topOffset: React.PropTypes.number,
    leftOffset: React.PropTypes.number
  }
  render = () => {
    const {topOffset, leftOffset} = this.props;

    const dialogStyle = {
      position: 'absolute',
      width: 100,
      height: 100,
      top: this.props.topOffset,
      left: this.props.leftOffset
    }

    return (
      <div style={dialogStyle}>
        Centered
      </div>
    )
  }
}
```

```javascript
// ES5

var React = require('react');
var centerComponent = require('react-center-component');

var Component = React.createClass({
  ...
});
var CenteredComponent = centerComponent(Component);
```