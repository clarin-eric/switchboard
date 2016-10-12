![JSS logo](https://avatars1.githubusercontent.com/u/9503099?v=3&s=60)

## JSS plugin that adds default px unit to numeric values where needed

This plugin lets you omit the `px` unit from values of style properties.

[Demo](http://jsstyles.github.io/jss-examples/index.html#plugin-jss-px) -
[JSS](https://github.com/jsstyles/jss)

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/jsstyles/jss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


## Usage example

```javascript
import jss from 'jss'
import px from 'jss-px'

jss.use(px())

let sheet = jss.createStyleSheet({
  container: {
    'font-size': 20,
    'z-index': 1,
    'line-height': 1.2
  }
})
```

```javascript
console.log(sheet.toString())
```
```css
.jss-0-0 {
  font-size: 20px;
  z-index: 1;
  line-height: 1.2;
}
```

```javascript
console.log(sheet.classes)
```
```javascript
{ container: "jss-0-0" }
```

## Run tests

```bash
npm i
npm run test
```

## License

MIT
