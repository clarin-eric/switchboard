(function(){
  var ref$, all, any, camelize, difference, drop, filter, find, findIndex, last, map, reject, isEqualToObject, React, createFactory, div, img, span, ReactSelectize, toString$ = {}.toString;
  ref$ = require('prelude-ls'), all = ref$.all, any = ref$.any, camelize = ref$.camelize, difference = ref$.difference, drop = ref$.drop, filter = ref$.filter, find = ref$.find, findIndex = ref$.findIndex, last = ref$.last, map = ref$.map, reject = ref$.reject;
  isEqualToObject = require('prelude-extension').isEqualToObject;
  React = require('react'), createFactory = React.createFactory, ref$ = React.DOM, div = ref$.div, img = ref$.img, span = ref$.span;
  ReactSelectize = createFactory(require('./ReactSelectize'));
  module.exports = React.createClass({
    displayName: 'MultiSelect',
    getDefaultProps: function(){
      return {
        closeOnSelect: false,
        defaultValues: [],
        delimiters: [],
        filterOptions: curry$(function(options, values, search){
          var this$ = this;
          return filter(function(it){
            return it.label.toLowerCase().trim().indexOf(search.toLowerCase().trim()) > -1;
          })(
          reject(function(it){
            return in$(it.label.trim(), map(function(it){
              return it.label.trim();
            }, values != null
              ? values
              : []));
          })(
          options));
        }),
        onBlur: function(values, reason){},
        onEnter: function(highlightedOption){},
        onFocus: function(values, reason){},
        onPaste: function(e){
          true;
        },
        serialize: map(function(it){
          return it != null ? it.value : void 8;
        }),
        tether: false
      };
    },
    render: function(){
      var ref$, anchor, search, values, onAnchorChange, onSearchChange, onValuesChange, filteredOptions, options, autosize, delimiters, disabled, dropdownDirection, groupId, groups, groupsAsColumns, name, onEnter, renderGroupTitle, serialize, tether, transitionEnter, transitionLeave, transitionEnterTimeout, transitionLeaveTimeout, uid, this$ = this;
      ref$ = this.getComputedState(), anchor = ref$.anchor, search = ref$.search, values = ref$.values, onAnchorChange = ref$.onAnchorChange, onSearchChange = ref$.onSearchChange, onValuesChange = ref$.onValuesChange, filteredOptions = ref$.filteredOptions, options = ref$.options;
      if ((ref$ = this.props) != null) {
        autosize = ref$.autosize, delimiters = ref$.delimiters, disabled = ref$.disabled, dropdownDirection = ref$.dropdownDirection, groupId = ref$.groupId, groups = ref$.groups, groupsAsColumns = ref$.groupsAsColumns, name = ref$.name, onEnter = ref$.onEnter, renderGroupTitle = ref$.renderGroupTitle, serialize = ref$.serialize, tether = ref$.tether, transitionEnter = ref$.transitionEnter, transitionLeave = ref$.transitionLeave, transitionEnterTimeout = ref$.transitionEnterTimeout, transitionLeaveTimeout = ref$.transitionLeaveTimeout, uid = ref$.uid;
      }
      return ReactSelectize(import$(import$({
        autosize: autosize,
        className: "multi-select" + (!!this.props.className ? " " + this.props.className : ""),
        delimiters: delimiters,
        disabled: disabled,
        dropdownDirection: dropdownDirection,
        groupId: groupId,
        groups: groups,
        groupsAsColumns: groupsAsColumns,
        name: name,
        onEnter: onEnter,
        renderGroupTitle: renderGroupTitle,
        tether: tether,
        transitionEnter: transitionEnter,
        transitionEnterTimeout: transitionEnterTimeout,
        transitionLeave: transitionLeave,
        transitionLeaveTimeout: transitionLeaveTimeout,
        uid: uid,
        ref: 'select',
        anchor: anchor,
        onAnchorChange: onAnchorChange,
        open: this.state.open,
        onOpenChange: function(open, callback){
          if (open) {
            return this$.showOptions(callback);
          } else {
            return this$.setState({
              open: open
            }, callback);
          }
        },
        highlightedUid: this.state.highlightedUid,
        onHighlightedUidChange: function(highlightedUid, callback){
          return this$.setState({
            highlightedUid: highlightedUid
          }, callback);
        },
        firstOptionIndexToHighlight: function(){
          return this$.firstOptionIndexToHighlight(options);
        },
        options: options,
        renderOption: this.props.renderOption,
        search: search,
        onSearchChange: function(search, callback){
          return onSearchChange(!!this$.props.maxValues && values.length >= this$.props.maxValues ? "" : search, callback);
        },
        values: values,
        onValuesChange: function(newValues, callback){
          return onValuesChange(newValues, function(){
            if (this$.props.closeOnSelect || (!!this$.props.maxValues && newValues.length >= this$.props.maxValues)) {
              return this$.setState({
                open: false
              }, callback);
            } else {
              return this$.focus(callback);
            }
          });
        },
        renderValue: this.props.renderValue,
        serialize: serialize,
        onBlur: function(arg$, reason){
          this$.setState({
            anchor: last(values)
          }, function(){
            return onSearchChange("", function(){
              return this$.props.onBlur(values, reason);
            });
          });
        },
        onFocus: function(arg$, reason){
          this$.props.onFocus(values, reason);
        },
        onPaste: (function(){
          var ref$;
          switch (false) {
          case typeof ((ref$ = this.props) != null ? ref$.valuesFromPaste : void 8) !== 'undefined':
            return this.props.onPaste;
          default:
            return function(e){
              var clipboardData;
              clipboardData = e.clipboardData;
              (function(){
                var newValues;
                newValues = values.concat(this$.props.valuesFromPaste(options, values, clipboardData.getData('text')));
                return onValuesChange(newValues, function(){
                  return onAnchorChange(last(newValues));
                });
              })();
              e.preventDefault();
              return false;
            };
          }
        }.call(this)),
        placeholder: this.props.placeholder,
        style: this.props.style
      }, (function(){
        switch (false) {
        case typeof this.props.restoreOnBackspace !== 'function':
          return {
            restoreOnBackspace: this.props.restoreOnBackspace
          };
        default:
          return {};
        }
      }.call(this))), (function(){
        switch (false) {
        case typeof this.props.renderNoResultsFound !== 'function':
          return {
            renderNoResultsFound: function(){
              return this$.props.renderNoResultsFound(values, search);
            }
          };
        default:
          return {};
        }
      }.call(this))));
    },
    getComputedState: function(){
      var anchor, search, values, ref$, onAnchorChange, onSearchChange, onValuesChange, optionsFromChildren, unfilteredOptions, filteredOptions, newOption, options, this$ = this;
      anchor = this.props.hasOwnProperty('anchor')
        ? this.props.anchor
        : this.state.anchor;
      search = this.props.hasOwnProperty('search')
        ? this.props.search
        : this.state.search;
      values = this.values();
      ref$ = map(function(p){
        switch (false) {
        case !(this$.props.hasOwnProperty(p) && this$.props.hasOwnProperty(camelize("on-" + p + "-change"))):
          return this$.props[camelize("on-" + p + "-change")];
        case !(this$.props.hasOwnProperty(p) && !this$.props.hasOwnProperty(camelize("on-" + p + "-change"))):
          return function(arg$, callback){
            return callback();
          };
        case !(!this$.props.hasOwnProperty(p) && this$.props.hasOwnProperty(camelize("on-" + p + "-change"))):
          return function(o, callback){
            var ref$;
            return this$.setState((ref$ = {}, ref$[p + ""] = o, ref$), function(){
              return this$.props[camelize("on-" + p + "-change")](o, callback);
            });
          };
        case !(!this$.props.hasOwnProperty(p) && !this$.props.hasOwnProperty(camelize("on-" + p + "-change"))):
          return function(o, callback){
            var ref$;
            return this$.setState((ref$ = {}, ref$[p + ""] = o, ref$), callback);
          };
        }
      })(
      ['anchor', 'search', 'values']), onAnchorChange = ref$[0], onSearchChange = ref$[1], onValuesChange = ref$[2];
      optionsFromChildren = (function(){
        var ref$;
        switch (false) {
        case !((ref$ = this.props) != null && ref$.children):
          return map(function(arg$){
            var props, value, children;
            if (arg$ != null) {
              props = arg$.props;
            }
            if (props != null) {
              value = props.value, children = props.children;
            }
            return {
              label: children,
              value: value
            };
          })(
          toString$.call(this.props.children).slice(8, -1) === 'Array'
            ? this.props.children
            : [this.props.children]);
        default:
          return [];
        }
      }.call(this));
      unfilteredOptions = this.props.hasOwnProperty('options') ? (ref$ = this.props.options) != null
        ? ref$
        : [] : optionsFromChildren;
      filteredOptions = this.props.filterOptions(unfilteredOptions, values, search);
      newOption = (function(){
        switch (false) {
        case typeof this.props.createFromSearch !== 'function':
          return this.props.createFromSearch(filteredOptions, values, search);
        default:
          return null;
        }
      }.call(this));
      options = (!!newOption
        ? [(ref$ = import$({}, newOption), ref$.newOption = true, ref$)]
        : []).concat(filteredOptions);
      return {
        anchor: anchor,
        search: search,
        values: values,
        onAnchorChange: onAnchorChange,
        onSearchChange: onSearchChange,
        onValuesChange: onValuesChange,
        filteredOptions: filteredOptions,
        options: options
      };
    },
    getInitialState: function(){
      return {
        anchor: !!this.props.values ? last(this.props.values) : undefined,
        highlightedUid: undefined,
        open: false,
        search: "",
        values: this.props.defaultValues
      };
    },
    firstOptionIndexToHighlight: function(options){
      var ref$;
      switch (false) {
      case options.length !== 1:
        return 0;
      case typeof ((ref$ = options[0]) != null ? ref$.newOption : void 8) !== 'undefined':
        return 0;
      default:
        if (all(function(it){
          return typeof it.selectable === 'boolean' && !it.selectable;
        })(
        drop(1)(
        options))) {
          return 0;
        } else {
          return 1;
        }
      }
    },
    focus: function(callback){
      this.refs.select.focusOnInput();
      return this.showOptions(callback);
    },
    blur: function(){
      this.refs.select.blur();
    },
    highlightFirstSelectableOption: function(){
      var options;
      if (!this.state.open) {
        return;
      }
      options = this.getComputedState().options;
      this.refs.select.highlightAndScrollToSelectableOption(this.firstOptionIndexToHighlight(options), 1);
    },
    showOptions: function(callback){
      this.setState({
        open: (function(){
          switch (false) {
          case !this.props.disabled:
            return false;
          case !(typeof this.props.maxValues !== 'undefined' && this.values().length >= this.props.maxValues):
            return false;
          default:
            return true;
          }
        }.call(this))
      }, callback);
    },
    values: function(){
      if (this.props.hasOwnProperty('values')) {
        return this.props.values;
      } else {
        return this.state.values;
      }
    }
  });
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
