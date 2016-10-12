## React JSS

The benefit of using react-jss instead of using [JSS](https://github.com/jsstyles/jss) directly is lazy evaluation and auto mount/unmount. It will compile your styles to CSS only when a component using them is mounted for the first time. Through ref counting, it will unmount styles when they are not in use by any of mounted component.

You need this module if you build a big application where leaving all styles in the DOM or compiling all styles at once might have performance impact or you are going to hit [IE limits](http://blogs.msdn.com/b/ieinternals/archive/2011/05/14/10164546.aspx).

### Usage

You can use it as a [higher-order component](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750) to inject [JSS](https://github.com/jsstyles/jss). It can act both as a simple wrapping function and as a [ES7 decorator](https://github.com/wycats/javascript-decorators).

React JSS wraps your React component and injects `this.props.sheet`, which is just a regular [JSS style sheet](https://github.com/jsstyles/jss), as a prop into your component. This is a common pattern that is used for composition in React instead of mixins, and works equally well with old-style `createClass` classes, as well as the ES6 classes.

Because JSS class names are namespaced by default, you will need to reach into `this.props.sheet.classes` to get their real names. For example, if you define a `button` class in your JSS stylesheet, its real name will be available as `this.props.sheet.classes.button`.

React JSS is compatible with live reloading using [React Hot Loader](https://github.com/gaearon/react-hot-loader).

### Installation

```
npm install --save react-jss
```

### Reusable components

You should use a local jss instance if you create components which will be used by external projects to avoid conflicts with their jss setup.

#### ES5
// jss.js
```javascript
// Create a new instance of jss.
var jss = require('jss').create()
// Now all plugins are used by this instance only.
jss.use(require('jss-vendor-prefixer'))

// Pass your jss instance to react-jss
var useSheet = require('react-jss')(jss)

exports.jss = jss
exports.useSheet = useSheet
```

#### ES6
```javascript
import {create} from 'jss'
import reactJss from 'react-jss'
import vendorPrefixer from 'jss-vendor-prefixer'

export let jss = create()
export let useSheet = reactJss(jss)

jss.use(vendorPrefixer())
```

### Examples

#### ES5

```javascript
var React = require('react')
var useSheet = require('react-jss')

// You can use jss directly too!
var jss = require('jss')
var vendorPrefixer = require('jss-vendor-prefixer')
jss.use(vendorPrefixer())

var styles = {
  button: {
    'background-color': 'yellow'
  },
  label: {
    'font-weight': 'bold'
  }
}

var Button = React.createClass({
  render: function () {
    var classes = this.props.sheet.classes

    return (
      <div className={classes.button}>
        <span className={classes.label}>
          {this.props.children}
        </span>
      </div>
    )
  }
})

module.exports = useSheet(Button, styles)
```

#### ES6

```javascript
import React, { Component } from 'react'
import useSheet from 'react-jss'

// You can use jss directly too!
import jss from 'jss'
import vendorPrefixer from 'jss-vendor-prefixer'
jss.use(vendorPrefixer())

const styles = {
  button: {
    'background-color': 'yellow'
  },
  label: {
    'font-weight': 'bold'
  }
}

class Button extends Component {
  render() {
    const { classes } = this.props.sheet

    return (
      <div className={classes.button}>
        <span className={classes.label}>
          {this.props.children}
        </span>
      </div>
    )
  }
}

export default useSheet(Button, styles)
```

#### ES7 with [decorators](https://github.com/wycats/javascript-decorators) (using [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy))

```javascript
import React, { Component } from 'react'
import useSheet from 'react-jss'

// You can use jss directly too!
import jss from 'jss'
import vendorPrefixer from 'jss-vendor-prefixer'
jss.use(vendorPrefixer())

const styles = {
  button: {
    'background-color': 'yellow'
  },
  label: {
    'font-weight': 'bold'
  }
}

@useSheet(styles)
export default class Button extends Component {
  render() {
    const { classes } = this.props.sheet

    return (
      <div className={classes.button}>
        <span className={classes.label}>
          {this.props.children}
        </span>
      </div>
    )
  }
}
```

### Do you have a `classSet` helper?

We used to support a `classSet` helper in 0.x, but React is removing `React.addons.classSet` soon, and so are we. There are many alternative userland solutions, such as Jed Watson's excellent [classnames](https://github.com/JedWatson/classnames) library, so we suggest you use it instead.

It's easy to use with generated class names. If you're writing in ES6, you can use computed property names in the object literal:

```javascript
import classSet from 'classnames'

  // ...

  render() {
    const { classes } = this.props.sheet
    return (
      <div className={classSet({
        [classes.normal]: true,
        [classes.active]: this.state.active
      })}>
        {this.props.children}
      </div>
    )
  )
```

If you're still writing in ES5 ([you should consider Babel though!](https://babeljs.io/)), you can just supply an array:

```javascript
 var classSet = require('classnames')

  // ...

 render: function () {
    var classes = this.props.sheet.classes
    return (
      <div className={classSet(
        classes.normal,
        this.state.active && classes.active
      )}>
        {this.props.children}
      </div>
    )
  }
```

Either way, you can see now that there is no real need for a dedicated `classSet` helper in this project.

### API

React JSS has two overloads.
If you are using ES5 or ES6, use this overload:

```js
// ES5 and ES6
useSheet: (ReactClass, rules[, options]) => ReactClass
```

It lets you pass your React component class as the first parameter.

There is also another signature designed specifically to be used with [ES7 decorators](https://github.com/wycats/javascript-decorators). It activates if pass the styles as the first parameter instead of the component:

```js
// ES7
useSheet: (rules, [, options]) => (ReactClass) => ReactClass
```

This overload returns a partial function, to which you then should pass your React component class. This is only useful because [ES7 decorators](https://github.com/wycats/javascript-decorators) expect such signature. If you use ES5 or ES6, just ignore it and use the first overload instead.

In both overloads, `rules` and `options` are the arguments to the `jss.createStyleSheet` call inside.
If you're not sure which overload to use, go with the first one.

### License

MIT
