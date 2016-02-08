(function(){
  var ref$, createClass, div, isEqualToObject;
  ref$ = require('react'), createClass = ref$.createClass, div = ref$.DOM.div;
  isEqualToObject = require('prelude-extension').isEqualToObject;
  module.exports = createClass({
    getDefaultProps: function(){
      return {};
    },
    render: function(){
      return div({
        className: "option-wrapper " + (!!this.props.highlight ? 'highlight' : ''),
        onClick: this.props.onClick,
        onMouseMove: this.props.onMouseMove,
        onMouseOut: this.props.onMouseOut,
        onMouseOver: this.props.onMouseOver
      }, this.props.renderItem(this.props.item));
    },
    shouldComponentUpdate: function(nextProps){
      var ref$, ref1$, ref2$;
      return !isEqualToObject(nextProps != null ? nextProps.uid : void 8, (ref$ = this.props) != null ? ref$.uid : void 8) || (nextProps != null ? nextProps.highlight : void 8) !== ((ref1$ = this.props) != null ? ref1$.highlight : void 8) || (nextProps != null ? nextProps.selectable : void 8) !== ((ref2$ = this.props) != null ? ref2$.selectable : void 8);
    }
  });
}).call(this);
