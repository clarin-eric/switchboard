(function() {

/******************************************************************************
 * Here we include Zepto (inlined minified) and Zepto data plugin.
 * Go below to get to Switchboard popup code
 * We need to make sure $ is not changed after the execution of this code.
 ******************************************************************************/

if (typeof window.$ != 'undefined') {
    var old$ = window.$;
}

/* Zepto v1.1.6 - zepto event ajax form ie - zeptojs.com/license */
var Zepto=function(){function L(t){return null==t?String(t):j[S.call(t)]||"object"}function Z(t){return"function"==L(t)}function _(t){return null!=t&&t==t.window}function $(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function D(t){return"object"==L(t)}function M(t){return D(t)&&!_(t)&&Object.getPrototypeOf(t)==Object.prototype}function R(t){return"number"==typeof t.length}function k(t){return s.call(t,function(t){return null!=t})}function z(t){return t.length>0?n.fn.concat.apply([],t):t}function F(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function q(t){return t in f?f[t]:f[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function H(t,e){return"number"!=typeof e||c[F(t)]?e:e+"px"}function I(t){var e,n;return u[t]||(e=a.createElement(t),a.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),u[t]=n),u[t]}function V(t){return"children"in t?o.call(t.children):n.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function B(n,i,r){for(e in i)r&&(M(i[e])||A(i[e]))?(M(i[e])&&!M(n[e])&&(n[e]={}),A(i[e])&&!A(n[e])&&(n[e]=[]),B(n[e],i[e],r)):i[e]!==t&&(n[e]=i[e])}function U(t,e){return null==e?n(t):n(t).filter(e)}function J(t,e,n,i){return Z(e)?e.call(t,n,i):e}function X(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function W(e,n){var i=e.className||"",r=i&&i.baseVal!==t;return n===t?r?i.baseVal:i:void(r?i.baseVal=n:e.className=n)}function Y(t){try{return t?"true"==t||("false"==t?!1:"null"==t?null:+t+""==t?+t:/^[\[\{]/.test(t)?n.parseJSON(t):t):t}catch(e){return t}}function G(t,e){e(t);for(var n=0,i=t.childNodes.length;i>n;n++)G(t.childNodes[n],e)}var t,e,n,i,C,N,r=[],o=r.slice,s=r.filter,a=window.document,u={},f={},c={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},l=/^\s*<(\w+|!)[^>]*>/,h=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,p=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,d=/^(?:body|html)$/i,m=/([A-Z])/g,g=["val","css","html","text","data","width","height","offset"],v=["after","prepend","before","append"],y=a.createElement("table"),x=a.createElement("tr"),b={tr:a.createElement("tbody"),tbody:y,thead:y,tfoot:y,td:x,th:x,"*":a.createElement("div")},w=/complete|loaded|interactive/,E=/^[\w-]*$/,j={},S=j.toString,T={},O=a.createElement("div"),P={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},A=Array.isArray||function(t){return t instanceof Array};return T.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var i,r=t.parentNode,o=!r;return o&&(r=O).appendChild(t),i=~T.qsa(r,e).indexOf(t),o&&O.removeChild(t),i},C=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},N=function(t){return s.call(t,function(e,n){return t.indexOf(e)==n})},T.fragment=function(e,i,r){var s,u,f;return h.test(e)&&(s=n(a.createElement(RegExp.$1))),s||(e.replace&&(e=e.replace(p,"<$1></$2>")),i===t&&(i=l.test(e)&&RegExp.$1),i in b||(i="*"),f=b[i],f.innerHTML=""+e,s=n.each(o.call(f.childNodes),function(){f.removeChild(this)})),M(r)&&(u=n(s),n.each(r,function(t,e){g.indexOf(t)>-1?u[t](e):u.attr(t,e)})),s},T.Z=function(t,e){return t=t||[],t.__proto__=n.fn,t.selector=e||"",t},T.isZ=function(t){return t instanceof T.Z},T.init=function(e,i){var r;if(!e)return T.Z();if("string"==typeof e)if(e=e.trim(),"<"==e[0]&&l.test(e))r=T.fragment(e,RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=T.qsa(a,e)}else{if(Z(e))return n(a).ready(e);if(T.isZ(e))return e;if(A(e))r=k(e);else if(D(e))r=[e],e=null;else if(l.test(e))r=T.fragment(e.trim(),RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=T.qsa(a,e)}}return T.Z(r,e)},n=function(t,e){return T.init(t,e)},n.extend=function(t){var e,n=o.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){B(t,n,e)}),t},T.qsa=function(t,e){var n,i="#"==e[0],r=!i&&"."==e[0],s=i||r?e.slice(1):e,a=E.test(s);return $(t)&&a&&i?(n=t.getElementById(s))?[n]:[]:1!==t.nodeType&&9!==t.nodeType?[]:o.call(a&&!i?r?t.getElementsByClassName(s):t.getElementsByTagName(e):t.querySelectorAll(e))},n.contains=a.documentElement.contains?function(t,e){return t!==e&&t.contains(e)}:function(t,e){for(;e&&(e=e.parentNode);)if(e===t)return!0;return!1},n.type=L,n.isFunction=Z,n.isWindow=_,n.isArray=A,n.isPlainObject=M,n.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},n.inArray=function(t,e,n){return r.indexOf.call(e,t,n)},n.camelCase=C,n.trim=function(t){return null==t?"":String.prototype.trim.call(t)},n.uuid=0,n.support={},n.expr={},n.map=function(t,e){var n,r,o,i=[];if(R(t))for(r=0;r<t.length;r++)n=e(t[r],r),null!=n&&i.push(n);else for(o in t)n=e(t[o],o),null!=n&&i.push(n);return z(i)},n.each=function(t,e){var n,i;if(R(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(i in t)if(e.call(t[i],i,t[i])===!1)return t;return t},n.grep=function(t,e){return s.call(t,e)},window.JSON&&(n.parseJSON=JSON.parse),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){j["[object "+e+"]"]=e.toLowerCase()}),n.fn={forEach:r.forEach,reduce:r.reduce,push:r.push,sort:r.sort,indexOf:r.indexOf,concat:r.concat,map:function(t){return n(n.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return n(o.apply(this,arguments))},ready:function(t){return w.test(a.readyState)&&a.body?t(n):a.addEventListener("DOMContentLoaded",function(){t(n)},!1),this},get:function(e){return e===t?o.call(this):this[e>=0?e:e+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return r.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return Z(t)?this.not(this.not(t)):n(s.call(this,function(e){return T.matches(e,t)}))},add:function(t,e){return n(N(this.concat(n(t,e))))},is:function(t){return this.length>0&&T.matches(this[0],t)},not:function(e){var i=[];if(Z(e)&&e.call!==t)this.each(function(t){e.call(this,t)||i.push(this)});else{var r="string"==typeof e?this.filter(e):R(e)&&Z(e.item)?o.call(e):n(e);this.forEach(function(t){r.indexOf(t)<0&&i.push(t)})}return n(i)},has:function(t){return this.filter(function(){return D(t)?n.contains(this,t):n(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!D(t)?t:n(t)},last:function(){var t=this[this.length-1];return t&&!D(t)?t:n(t)},find:function(t){var e,i=this;return e=t?"object"==typeof t?n(t).filter(function(){var t=this;return r.some.call(i,function(e){return n.contains(e,t)})}):1==this.length?n(T.qsa(this[0],t)):this.map(function(){return T.qsa(this,t)}):n()},closest:function(t,e){var i=this[0],r=!1;for("object"==typeof t&&(r=n(t));i&&!(r?r.indexOf(i)>=0:T.matches(i,t));)i=i!==e&&!$(i)&&i.parentNode;return n(i)},parents:function(t){for(var e=[],i=this;i.length>0;)i=n.map(i,function(t){return(t=t.parentNode)&&!$(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return U(e,t)},parent:function(t){return U(N(this.pluck("parentNode")),t)},children:function(t){return U(this.map(function(){return V(this)}),t)},contents:function(){return this.map(function(){return o.call(this.childNodes)})},siblings:function(t){return U(this.map(function(t,e){return s.call(V(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return n.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=I(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var e=Z(t);if(this[0]&&!e)var i=n(t).get(0),r=i.parentNode||this.length>1;return this.each(function(o){n(this).wrapAll(e?t.call(this,o):r?i.cloneNode(!0):i)})},wrapAll:function(t){if(this[0]){n(this[0]).before(t=n(t));for(var e;(e=t.children()).length;)t=e.first();n(t).append(this)}return this},wrapInner:function(t){var e=Z(t);return this.each(function(i){var r=n(this),o=r.contents(),s=e?t.call(this,i):t;o.length?o.wrapAll(s):r.append(s)})},unwrap:function(){return this.parent().each(function(){n(this).replaceWith(n(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(e){return this.each(function(){var i=n(this);(e===t?"none"==i.css("display"):e)?i.show():i.hide()})},prev:function(t){return n(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return n(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0 in arguments?this.each(function(e){var i=this.innerHTML;n(this).empty().append(J(this,t,e,i))}):0 in this?this[0].innerHTML:null},text:function(t){return 0 in arguments?this.each(function(e){var n=J(this,t,e,this.textContent);this.textContent=null==n?"":""+n}):0 in this?this[0].textContent:null},attr:function(n,i){var r;return"string"!=typeof n||1 in arguments?this.each(function(t){if(1===this.nodeType)if(D(n))for(e in n)X(this,e,n[e]);else X(this,n,J(this,i,t,this.getAttribute(n)))}):this.length&&1===this[0].nodeType?!(r=this[0].getAttribute(n))&&n in this[0]?this[0][n]:r:t},removeAttr:function(t){return this.each(function(){1===this.nodeType&&t.split(" ").forEach(function(t){X(this,t)},this)})},prop:function(t,e){return t=P[t]||t,1 in arguments?this.each(function(n){this[t]=J(this,e,n,this[t])}):this[0]&&this[0][t]},data:function(e,n){var i="data-"+e.replace(m,"-$1").toLowerCase(),r=1 in arguments?this.attr(i,n):this.attr(i);return null!==r?Y(r):t},val:function(t){return 0 in arguments?this.each(function(e){this.value=J(this,t,e,this.value)}):this[0]&&(this[0].multiple?n(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value)},offset:function(t){if(t)return this.each(function(e){var i=n(this),r=J(this,t,e,i.offset()),o=i.offsetParent().offset(),s={top:r.top-o.top,left:r.left-o.left};"static"==i.css("position")&&(s.position="relative"),i.css(s)});if(!this.length)return null;var e=this[0].getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:Math.round(e.width),height:Math.round(e.height)}},css:function(t,i){if(arguments.length<2){var r,o=this[0];if(!o)return;if(r=getComputedStyle(o,""),"string"==typeof t)return o.style[C(t)]||r.getPropertyValue(t);if(A(t)){var s={};return n.each(t,function(t,e){s[e]=o.style[C(e)]||r.getPropertyValue(e)}),s}}var a="";if("string"==L(t))i||0===i?a=F(t)+":"+H(t,i):this.each(function(){this.style.removeProperty(F(t))});else for(e in t)t[e]||0===t[e]?a+=F(e)+":"+H(e,t[e])+";":this.each(function(){this.style.removeProperty(F(e))});return this.each(function(){this.style.cssText+=";"+a})},index:function(t){return t?this.indexOf(n(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?r.some.call(this,function(t){return this.test(W(t))},q(t)):!1},addClass:function(t){return t?this.each(function(e){if("className"in this){i=[];var r=W(this),o=J(this,t,e,r);o.split(/\s+/g).forEach(function(t){n(this).hasClass(t)||i.push(t)},this),i.length&&W(this,r+(r?" ":"")+i.join(" "))}}):this},removeClass:function(e){return this.each(function(n){if("className"in this){if(e===t)return W(this,"");i=W(this),J(this,e,n,i).split(/\s+/g).forEach(function(t){i=i.replace(q(t)," ")}),W(this,i.trim())}})},toggleClass:function(e,i){return e?this.each(function(r){var o=n(this),s=J(this,e,r,W(this));s.split(/\s+/g).forEach(function(e){(i===t?!o.hasClass(e):i)?o.addClass(e):o.removeClass(e)})}):this},scrollTop:function(e){if(this.length){var n="scrollTop"in this[0];return e===t?n?this[0].scrollTop:this[0].pageYOffset:this.each(n?function(){this.scrollTop=e}:function(){this.scrollTo(this.scrollX,e)})}},scrollLeft:function(e){if(this.length){var n="scrollLeft"in this[0];return e===t?n?this[0].scrollLeft:this[0].pageXOffset:this.each(n?function(){this.scrollLeft=e}:function(){this.scrollTo(e,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),i=this.offset(),r=d.test(e[0].nodeName)?{top:0,left:0}:e.offset();return i.top-=parseFloat(n(t).css("margin-top"))||0,i.left-=parseFloat(n(t).css("margin-left"))||0,r.top+=parseFloat(n(e[0]).css("border-top-width"))||0,r.left+=parseFloat(n(e[0]).css("border-left-width"))||0,{top:i.top-r.top,left:i.left-r.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||a.body;t&&!d.test(t.nodeName)&&"static"==n(t).css("position");)t=t.offsetParent;return t})}},n.fn.detach=n.fn.remove,["width","height"].forEach(function(e){var i=e.replace(/./,function(t){return t[0].toUpperCase()});n.fn[e]=function(r){var o,s=this[0];return r===t?_(s)?s["inner"+i]:$(s)?s.documentElement["scroll"+i]:(o=this.offset())&&o[e]:this.each(function(t){s=n(this),s.css(e,J(this,r,t,s[e]()))})}}),v.forEach(function(t,e){var i=e%2;n.fn[t]=function(){var t,o,r=n.map(arguments,function(e){return t=L(e),"object"==t||"array"==t||null==e?e:T.fragment(e)}),s=this.length>1;return r.length<1?this:this.each(function(t,u){o=i?u:u.parentNode,u=0==e?u.nextSibling:1==e?u.firstChild:2==e?u:null;var f=n.contains(a.documentElement,o);r.forEach(function(t){if(s)t=t.cloneNode(!0);else if(!o)return n(t).remove();o.insertBefore(t,u),f&&G(t,function(t){null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src||window.eval.call(window,t.innerHTML)})})})},n.fn[i?t+"To":"insert"+(e?"Before":"After")]=function(e){return n(e)[t](this),this}}),T.Z.prototype=n.fn,T.uniq=N,T.deserializeValue=Y,n.zepto=T,n}();window.Zepto=Zepto,void 0===window.$&&(window.$=Zepto),function(t){function l(t){return t._zid||(t._zid=e++)}function h(t,e,n,i){if(e=p(e),e.ns)var r=d(e.ns);return(s[l(t)]||[]).filter(function(t){return!(!t||e.e&&t.e!=e.e||e.ns&&!r.test(t.ns)||n&&l(t.fn)!==l(n)||i&&t.sel!=i)})}function p(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function d(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function m(t,e){return t.del&&!u&&t.e in f||!!e}function g(t){return c[t]||u&&f[t]||t}function v(e,i,r,o,a,u,f){var h=l(e),d=s[h]||(s[h]=[]);i.split(/\s/).forEach(function(i){if("ready"==i)return t(document).ready(r);var s=p(i);s.fn=r,s.sel=a,s.e in c&&(r=function(e){var n=e.relatedTarget;return!n||n!==this&&!t.contains(this,n)?s.fn.apply(this,arguments):void 0}),s.del=u;var l=u||r;s.proxy=function(t){if(t=j(t),!t.isImmediatePropagationStopped()){t.data=o;var i=l.apply(e,t._args==n?[t]:[t].concat(t._args));return i===!1&&(t.preventDefault(),t.stopPropagation()),i}},s.i=d.length,d.push(s),"addEventListener"in e&&e.addEventListener(g(s.e),s.proxy,m(s,f))})}function y(t,e,n,i,r){var o=l(t);(e||"").split(/\s/).forEach(function(e){h(t,e,n,i).forEach(function(e){delete s[o][e.i],"removeEventListener"in t&&t.removeEventListener(g(e.e),e.proxy,m(e,r))})})}function j(e,i){return(i||!e.isDefaultPrevented)&&(i||(i=e),t.each(E,function(t,n){var r=i[t];e[t]=function(){return this[n]=x,r&&r.apply(i,arguments)},e[n]=b}),(i.defaultPrevented!==n?i.defaultPrevented:"returnValue"in i?i.returnValue===!1:i.getPreventDefault&&i.getPreventDefault())&&(e.isDefaultPrevented=x)),e}function S(t){var e,i={originalEvent:t};for(e in t)w.test(e)||t[e]===n||(i[e]=t[e]);return j(i,t)}var n,e=1,i=Array.prototype.slice,r=t.isFunction,o=function(t){return"string"==typeof t},s={},a={},u="onfocusin"in window,f={focus:"focusin",blur:"focusout"},c={mouseenter:"mouseover",mouseleave:"mouseout"};a.click=a.mousedown=a.mouseup=a.mousemove="MouseEvents",t.event={add:v,remove:y},t.proxy=function(e,n){var s=2 in arguments&&i.call(arguments,2);if(r(e)){var a=function(){return e.apply(n,s?s.concat(i.call(arguments)):arguments)};return a._zid=l(e),a}if(o(n))return s?(s.unshift(e[n],e),t.proxy.apply(null,s)):t.proxy(e[n],e);throw new TypeError("expected function")},t.fn.bind=function(t,e,n){return this.on(t,e,n)},t.fn.unbind=function(t,e){return this.off(t,e)},t.fn.one=function(t,e,n,i){return this.on(t,e,n,i,1)};var x=function(){return!0},b=function(){return!1},w=/^([A-Z]|returnValue$|layer[XY]$)/,E={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};t.fn.delegate=function(t,e,n){return this.on(e,t,n)},t.fn.undelegate=function(t,e,n){return this.off(e,t,n)},t.fn.live=function(e,n){return t(document.body).delegate(this.selector,e,n),this},t.fn.die=function(e,n){return t(document.body).undelegate(this.selector,e,n),this},t.fn.on=function(e,s,a,u,f){var c,l,h=this;return e&&!o(e)?(t.each(e,function(t,e){h.on(t,s,a,e,f)}),h):(o(s)||r(u)||u===!1||(u=a,a=s,s=n),(r(a)||a===!1)&&(u=a,a=n),u===!1&&(u=b),h.each(function(n,r){f&&(c=function(t){return y(r,t.type,u),u.apply(this,arguments)}),s&&(l=function(e){var n,o=t(e.target).closest(s,r).get(0);return o&&o!==r?(n=t.extend(S(e),{currentTarget:o,liveFired:r}),(c||u).apply(o,[n].concat(i.call(arguments,1)))):void 0}),v(r,e,u,a,s,l||c)}))},t.fn.off=function(e,i,s){var a=this;return e&&!o(e)?(t.each(e,function(t,e){a.off(t,i,e)}),a):(o(i)||r(s)||s===!1||(s=i,i=n),s===!1&&(s=b),a.each(function(){y(this,e,s,i)}))},t.fn.trigger=function(e,n){return e=o(e)||t.isPlainObject(e)?t.Event(e):j(e),e._args=n,this.each(function(){e.type in f&&"function"==typeof this[e.type]?this[e.type]():"dispatchEvent"in this?this.dispatchEvent(e):t(this).triggerHandler(e,n)})},t.fn.triggerHandler=function(e,n){var i,r;return this.each(function(s,a){i=S(o(e)?t.Event(e):e),i._args=n,i.target=a,t.each(h(a,e.type||e),function(t,e){return r=e.proxy(i),i.isImmediatePropagationStopped()?!1:void 0})}),r},"focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e){t.fn[e]=function(t){return 0 in arguments?this.bind(e,t):this.trigger(e)}}),t.Event=function(t,e){o(t)||(e=t,t=e.type);var n=document.createEvent(a[t]||"Events"),i=!0;if(e)for(var r in e)"bubbles"==r?i=!!e[r]:n[r]=e[r];return n.initEvent(t,i,!0),j(n)}}(Zepto),function(t){function h(e,n,i){var r=t.Event(n);return t(e).trigger(r,i),!r.isDefaultPrevented()}function p(t,e,i,r){return t.global?h(e||n,i,r):void 0}function d(e){e.global&&0===t.active++&&p(e,null,"ajaxStart")}function m(e){e.global&&!--t.active&&p(e,null,"ajaxStop")}function g(t,e){var n=e.context;return e.beforeSend.call(n,t,e)===!1||p(e,n,"ajaxBeforeSend",[t,e])===!1?!1:void p(e,n,"ajaxSend",[t,e])}function v(t,e,n,i){var r=n.context,o="success";n.success.call(r,t,o,e),i&&i.resolveWith(r,[t,o,e]),p(n,r,"ajaxSuccess",[e,n,t]),x(o,e,n)}function y(t,e,n,i,r){var o=i.context;i.error.call(o,n,e,t),r&&r.rejectWith(o,[n,e,t]),p(i,o,"ajaxError",[n,i,t||e]),x(e,n,i)}function x(t,e,n){var i=n.context;n.complete.call(i,e,t),p(n,i,"ajaxComplete",[e,n]),m(n)}function b(){}function w(t){return t&&(t=t.split(";",2)[0]),t&&(t==f?"html":t==u?"json":s.test(t)?"script":a.test(t)&&"xml")||"text"}function E(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function j(e){e.processData&&e.data&&"string"!=t.type(e.data)&&(e.data=t.param(e.data,e.traditional)),!e.data||e.type&&"GET"!=e.type.toUpperCase()||(e.url=E(e.url,e.data),e.data=void 0)}function S(e,n,i,r){return t.isFunction(n)&&(r=i,i=n,n=void 0),t.isFunction(i)||(r=i,i=void 0),{url:e,data:n,success:i,dataType:r}}function C(e,n,i,r){var o,s=t.isArray(n),a=t.isPlainObject(n);t.each(n,function(n,u){o=t.type(u),r&&(n=i?r:r+"["+(a||"object"==o||"array"==o?n:"")+"]"),!r&&s?e.add(u.name,u.value):"array"==o||!i&&"object"==o?C(e,u,i,n):e.add(n,u)})}var i,r,e=0,n=window.document,o=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,s=/^(?:text|application)\/javascript/i,a=/^(?:text|application)\/xml/i,u="application/json",f="text/html",c=/^\s*$/,l=n.createElement("a");l.href=window.location.href,t.active=0,t.ajaxJSONP=function(i,r){if(!("type"in i))return t.ajax(i);var f,h,o=i.jsonpCallback,s=(t.isFunction(o)?o():o)||"jsonp"+ ++e,a=n.createElement("script"),u=window[s],c=function(e){t(a).triggerHandler("error",e||"abort")},l={abort:c};return r&&r.promise(l),t(a).on("load error",function(e,n){clearTimeout(h),t(a).off().remove(),"error"!=e.type&&f?v(f[0],l,i,r):y(null,n||"error",l,i,r),window[s]=u,f&&t.isFunction(u)&&u(f[0]),u=f=void 0}),g(l,i)===!1?(c("abort"),l):(window[s]=function(){f=arguments},a.src=i.url.replace(/\?(.+)=\?/,"?$1="+s),n.head.appendChild(a),i.timeout>0&&(h=setTimeout(function(){c("timeout")},i.timeout)),l)},t.ajaxSettings={type:"GET",beforeSend:b,success:b,error:b,complete:b,context:null,global:!0,xhr:function(){return new window.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:u,xml:"application/xml, text/xml",html:f,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0},t.ajax=function(e){var a,o=t.extend({},e||{}),s=t.Deferred&&t.Deferred();for(i in t.ajaxSettings)void 0===o[i]&&(o[i]=t.ajaxSettings[i]);d(o),o.crossDomain||(a=n.createElement("a"),a.href=o.url,a.href=a.href,o.crossDomain=l.protocol+"//"+l.host!=a.protocol+"//"+a.host),o.url||(o.url=window.location.toString()),j(o);var u=o.dataType,f=/\?.+=\?/.test(o.url);if(f&&(u="jsonp"),o.cache!==!1&&(e&&e.cache===!0||"script"!=u&&"jsonp"!=u)||(o.url=E(o.url,"_="+Date.now())),"jsonp"==u)return f||(o.url=E(o.url,o.jsonp?o.jsonp+"=?":o.jsonp===!1?"":"callback=?")),t.ajaxJSONP(o,s);var C,h=o.accepts[u],p={},m=function(t,e){p[t.toLowerCase()]=[t,e]},x=/^([\w-]+:)\/\//.test(o.url)?RegExp.$1:window.location.protocol,S=o.xhr(),T=S.setRequestHeader;if(s&&s.promise(S),o.crossDomain||m("X-Requested-With","XMLHttpRequest"),m("Accept",h||"*/*"),(h=o.mimeType||h)&&(h.indexOf(",")>-1&&(h=h.split(",",2)[0]),S.overrideMimeType&&S.overrideMimeType(h)),(o.contentType||o.contentType!==!1&&o.data&&"GET"!=o.type.toUpperCase())&&m("Content-Type",o.contentType||"application/x-www-form-urlencoded"),o.headers)for(r in o.headers)m(r,o.headers[r]);if(S.setRequestHeader=m,S.onreadystatechange=function(){if(4==S.readyState){S.onreadystatechange=b,clearTimeout(C);var e,n=!1;if(S.status>=200&&S.status<300||304==S.status||0==S.status&&"file:"==x){u=u||w(o.mimeType||S.getResponseHeader("content-type")),e=S.responseText;try{"script"==u?(1,eval)(e):"xml"==u?e=S.responseXML:"json"==u&&(e=c.test(e)?null:t.parseJSON(e))}catch(i){n=i}n?y(n,"parsererror",S,o,s):v(e,S,o,s)}else y(S.statusText||null,S.status?"error":"abort",S,o,s)}},g(S,o)===!1)return S.abort(),y(null,"abort",S,o,s),S;if(o.xhrFields)for(r in o.xhrFields)S[r]=o.xhrFields[r];var N="async"in o?o.async:!0;S.open(o.type,o.url,N,o.username,o.password);for(r in p)T.apply(S,p[r]);return o.timeout>0&&(C=setTimeout(function(){S.onreadystatechange=b,S.abort(),y(null,"timeout",S,o,s)},o.timeout)),S.send(o.data?o.data:null),S},t.get=function(){return t.ajax(S.apply(null,arguments))},t.post=function(){var e=S.apply(null,arguments);return e.type="POST",t.ajax(e)},t.getJSON=function(){var e=S.apply(null,arguments);return e.dataType="json",t.ajax(e)},t.fn.load=function(e,n,i){if(!this.length)return this;var a,r=this,s=e.split(/\s/),u=S(e,n,i),f=u.success;return s.length>1&&(u.url=s[0],a=s[1]),u.success=function(e){r.html(a?t("<div>").html(e.replace(o,"")).find(a):e),f&&f.apply(r,arguments)},t.ajax(u),this};var T=encodeURIComponent;t.param=function(e,n){var i=[];return i.add=function(e,n){t.isFunction(n)&&(n=n()),null==n&&(n=""),this.push(T(e)+"="+T(n))},C(i,e,n),i.join("&").replace(/%20/g,"+")}}(Zepto),function(t){t.fn.serializeArray=function(){var e,n,i=[],r=function(t){return t.forEach?t.forEach(r):void i.push({name:e,value:t})};return this[0]&&t.each(this[0].elements,function(i,o){n=o.type,e=o.name,e&&"fieldset"!=o.nodeName.toLowerCase()&&!o.disabled&&"submit"!=n&&"reset"!=n&&"button"!=n&&"file"!=n&&("radio"!=n&&"checkbox"!=n||o.checked)&&r(t(o).val())}),i},t.fn.serialize=function(){var t=[];return this.serializeArray().forEach(function(e){t.push(encodeURIComponent(e.name)+"="+encodeURIComponent(e.value))}),t.join("&")},t.fn.submit=function(e){if(0 in arguments)this.bind("submit",e);else if(this.length){var n=t.Event("submit");this.eq(0).trigger(n),n.isDefaultPrevented()||this.get(0).submit()}return this}}(Zepto),function(t){"__proto__"in{}||t.extend(t.zepto,{Z:function(e,n){return e=e||[],t.extend(e,t.fn),e.selector=n||"",e.__Z=!0,e},isZ:function(e){return"array"===t.type(e)&&"__Z"in e}});try{getComputedStyle(void 0)}catch(e){var n=getComputedStyle;window.getComputedStyle=function(t){try{return n(t)}catch(e){return null}}}}(Zepto);

const cogimage = "data:image/png;base64,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";

const newwindowimage = "data:image/png;base64,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"

var $ = window.$ = Zepto;

const switchboardConfig = {switchboardURL: "https://switchboard.clarin.eu/", preflightTimeout: 1000};

function init() {
    const originMap = {
        'vlo.clarin.eu': 'vlo',
        'collections.clarin.eu': 'vcr',
        'contentsearch.clarin.eu': 'fcs',
        'b2share.eudat.eu': 'b2share',
    }
    const origin = originMap[window.location.host];
    if (origin) {
        switchboardConfig.origin = origin;
    }

    for (const x of document.getElementsByTagName('script')) {
        if (x.src && x.src.includes('switchboardpopup')) {
            const url = x.src;
            const end = url.indexOf('/popup/');
            let switchboardURL = url.substr(0, end);
            if (!switchboardURL.endsWith("/")) {
                // to avoid a server redirect
                switchboardURL += "/";
            }
            switchboardConfig.switchboardURL = switchboardURL;
            return;
        }
    }
    console.warn("Could not automatically set the Switchboard URL, defaulting to:",
        switchboardConfig.switchboardURL);
}

function setSwitchboardURL(url) {
    switchboardConfig.switchboardURL = url;
}

const ALLOWED_CONFIG_KEYS = new Set(['switchboardURL', 'title', 'origin', 'preflightTimeout']);

function setSwitchboardConfig(config) {
    for (const key in config) {
        if (!ALLOWED_CONFIG_KEYS.has(key)) {
            console.warn("Unknown key in setSwitchboardConfig: " + key);
        }
    }
    Object.assign(switchboardConfig, config);
}

var container, backdrop;
var oldOnkeydown = undefined;
var oldOnmousedown = undefined;
var oldOnselectionchange = undefined;
var oldOnmouseup = undefined;

function showSwitchboardPopupOnSelection(align, params) {
    let mouseDown = false;
    let nowSelecting = false;
    let selection = null;
    oldOnmousedown = document.onmousedown;
    oldOnselectionchange = document.onselectionchange;
    oldOnmouseup = document.onmouseup;
    document.onmousedown = (e) => {
        mouseDown = true;
        if (oldOnmousedown) {
            oldOnmousedown(e);
        }
    };
    document.onselectionchange = (e) => {
        selection = document.getSelection();
        if (selection.type !== 'Range') {
            selection = null;
        }
        if (oldOnselectionchange) {
            oldOnselectionchange(e);
        }
    };
    document.onmouseup = (e) => {
        if (!mouseDown) {
            return;
        }
        mouseDown = false;
        if (container) {
            return;
        }
        if (!selection) {
            return;
        }
        const newAlign = Object.assign({}, align, {alignSelection: selection});
        const newParams = Object.assign({}, params, {selection: selection.toString()});
        makeDomElements(newAlign, switchboardConfig, newParams);
        if (oldOnmouseup) {
            oldOnmouseup(e);
        }
    };
}

function disableSwitchboardPopupOnSelection() {
    removePopup();
    document.onmousedown = oldOnmousedown;
    document.onselectionchange = oldOnselectionchange;
    document.onmouseup = oldOnmouseup;
}

function showSwitchboardPopup(align, params) {
    if (!align || !align.alignSelector) {
        throw "Bad switchboardPopup first argument: .alignSelector must be valid";
    }
    if (!params || !params.url) {
        throw "Bad switchboardPopup second argument: .url must be valid";
    }
    const selector = $(align.alignSelector);
    if (!selector || !selector.size()) {
        throw "Bad switchboardPopup first argument: .alignSelector must be a valid selector";
    }

    makeDomElements(align, switchboardConfig, params);
}

function testSwitchboardMatches(params) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const xhr = new XMLHttpRequest();
        xhr.open("POST", switchboardConfig.switchboardURL + "api/urlmatch");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = 'json';
        xhr.onload = function() {
            if (xhr.readyState === 4) {
                const duration = (Date.now()-start)+"ms";
                if (xhr.status === 200) {
                    const data = xhr.response;
                    if (data.timeout) {
                        // console.log("urlmatch ok: timeout, unknown", duration);
                        resolve(data, xhr);
                    } else if (data.matches) {
                        // console.log("urlmatch ok: we have matches", duration);
                        resolve(data, xhr);
                    } else {
                        // console.log("urlmatch ok: no match, running callback", duration);
                        resolve(data, xhr);
                    }
                } else {
                    console.error("Switchboard request to urlmatch failed: ", xhr.statusText, duration);
                    reject(xhr);
                }
            }
        };
        xhr.timeout = switchboardConfig.preflightTimeout;
        xhr.ontimeout = function () {
            const duration = (Date.now()-start)+"ms";
            console.error("Switchboard request to urlmatch " + params.url + " timed out.", duration);
            reject(xhr);
        };
        xhr.send(JSON.stringify(params));
    })
}

function makeDomElements(align, config, params) {
    container = $('<div>')
        .css({
            'position': 'absolute',
            'z-index': 9999,
            'top': 0,
            'left': 0,
            'padding': 0,
            'margin': 0,
            'float': 'left',
            'min-width': '160px',
            'list-style': 'none',
            'background-color': '#fff',
            'border': '1px solid #ccc',
            'border-radius': '4px',
            'box-shadow': '0 12px 24px rgba(0, 0, 0, 0.5)',
            'background-clip': 'padding-box',
            'transform-origin': '0 0',
            'transform': 'scale(0.85)',
        });

    if (align.alignRight) {
        container.css({
            'transform-origin': '100% 0',
            'left': 'auto',
            'right': 0,
        })
    }

    const closebutton = $('<button>')
        .css({
            'float': 'right',
            'margin': '4px',
            'padding': '2px',
            'border': 'none',
            'background': 'transparent',
            'cursor': 'pointer',
            'font-size': '20px',
        })
        .attr({title: params.selection ? "Disable showing popup on selection" : "Close"})
        .append("✖️")
        .on('click', removePopup)
        .appendTo(container);

    const maximizebutton = $('<button>')
        .css({
            'float': 'right',
            'margin-top': '4px',
            'padding': '2px',
            'border': 'none',
            'background': 'transparent',
            'cursor': 'pointer',
        })
        .attr({title:"Open in new window"})
        .append($(`<img src="${newwindowimage}" style="width:24px">`))
        .appendTo(container);

    const titlebar = $('<div>')
        .css({
            'width': '100%',
            'background-color': params.selection ? '#f1fafe' : '#eee',
            'border-radius': '6px 6px 0 0',
            'padding': '8px',
            'font-family': 'Helvetica',
            'font-size': '18px',
            'cursor': 'move',
            'user-select': 'none',
            'margin-bottom': params.selection ? 0 : '12px',
        })
        .append($(`<img src="${cogimage}" style="width:24px; vertical-align:sub">`))
        .append(config.title || "Switchboard")
        .appendTo(container);

    const form = $('<form>')
        .css({
            display: 'none'
        }).attr({
            action: config.switchboardURL,
            method: 'POST',
            enctype: 'multipart/form-data',
            target: 'switchboard_iframe',
        });
    for (const key in params) {
        if (Array.isArray(params[key])) {
            for (const value of params[key]) {
                form.append($('<input>').attr({type:'text', name:key, value}))
            }
        } else {
            form.append($('<input>').attr({type:'text', name:key, value:params[key]}))
        }
    }
    if (!params.origin && config.origin) {
        form.append($('<input>').attr({type:'text', name:'origin', value:config['origin']}))
    }
    const formPopupValue = $('<input>').attr({type:'text', name:'popup', value:'true'});
    form.append(formPopupValue);
    form.appendTo(container);

    maximizebutton.on('click', function() {
        formPopupValue.attr({value:'false'});
        form.attr({target:'_blank'});
        form.submit();
    });

    const iframe = $('<iframe>')
        .css({
            'border': 'none',
            'width': '375px',
            'height': '600px',
        })
        .attr({name: 'switchboard_iframe'})
        .appendTo(container);

    if (params.selection) {
        // add the footer with disable popup link
        $('<div>')
            .css({
                'width': '100%',
                'background-color': '#f1fafd',
                'padding': '6px 6px',
                'text-align': 'center',
            })
            .append($('<a>')
                .css({
                    'margin': 0,
                    'padding': '2px',
                    'font-size': '14px',
                    'cursor': 'pointer',
                })
                .append("Stop showing this popup.")
                .on('click', disableSwitchboardPopupOnSelection)
            )
            .append($('<span>')
                .css({
                    'margin-left': 4,
                    'padding': '2px',
                    'font-size': '14px',
                    'color': 'gray',
                })
                .append("Reload page to show it again.")
            )
            .appendTo(container);
    }

    var selectorOffset;
    if (align.alignSelector) {
        selectorOffset = $(align.alignSelector).offset();
    } else if (align.alignSelection) {
        selectorOffset = $(align.alignSelection.getRangeAt(0)).offset();
    }
    const offset = {
        left: selectorOffset.left,
        top: selectorOffset.top + selectorOffset.height,
        right: window.innerWidth - selectorOffset.left - selectorOffset.width,
    };

    if (align.alignRight) {
        container.css({
            left: 'auto',
            top: offset.top+'px',
            right: offset.right+'px',
            bottom: 'auto',
        });
    } else {
        container.css({
            left: offset.left+'px',
            top: offset.top+'px',
            right: 'auto',
            bottom: 'auto',
        });
    }

    function beginSliding(e) {
        titlebar.get()[0].onpointermove = slide;
        titlebar.get()[0].setPointerCapture(e.pointerId);
        offset.startX = e.clientX;
        offset.startY = e.clientY;
    }

    function stopSliding(e) {
        titlebar.get()[0].onpointermove = null;
        titlebar.get()[0].releasePointerCapture(e.pointerId);
    }

    function slide(e) {
        offset.left += e.clientX - offset.startX;
        offset.top += e.clientY - offset.startY;
        offset.right -= e.clientX - offset.startX;

        if (offset.left < 0) { offset.left = 0; }
        if (offset.top < 0) { offset.top = 0; }
        if (offset.right < 0) { offset.right = 0; }

        offset.startX = e.clientX;
        offset.startY = e.clientY;

        if (align.alignRight) {
            container.css({right: `${offset.right}px`, top: `${offset.top}px`});
        } else {
            container.css({left: `${offset.left}px`, top: `${offset.top}px`});
        }
    }

    titlebar.get()[0].onpointerdown = beginSliding;
    titlebar.get()[0].onpointerup = stopSliding;

    // add backdrop and remove handlers
    container.insertBefore(document.body.firstChild);
    backdrop = $('<div/>')
        .css({
            'position': 'fixed',
            'left': 0,
            'right': 0,
            'bottom': 0,
            'top': 0,
            'opacity': 0.125,
            'background-color': 'black',
            'z-index': 9998,
        })
        .insertBefore(document.body.firstChild)
        .on('click', removePopup);

    if (oldOnkeydown === undefined) {
        oldOnkeydown = window.onkeydown;
    }
    window.onkeydown = function(e) {
        if (e.keyCode == 27) {
            removePopup();
        }
    }

    form.submit();
}

function removePopup() {
    if (container) {
        container.remove();
        container = null;
    }
    if (backdrop) {
        backdrop.remove();
        backdrop = null;
    }
    window.onkeydown = oldOnkeydown;
}

// cleanup: remove global Zepto traces
if (typeof old$ === 'undefined') {
    delete window.$
} else {
    window.$ = old$;
}

// automatically set the config: switchboard url, origin
init();

// change globals
window.setSwitchboardURL = setSwitchboardURL;
window.setSwitchboardConfig = setSwitchboardConfig;
window.showSwitchboardPopup = showSwitchboardPopup;
window.testSwitchboardMatches = testSwitchboardMatches;
window.showSwitchboardPopupOnSelection = showSwitchboardPopupOnSelection;
window.disableSwitchboardPopupOnSelection = disableSwitchboardPopupOnSelection;
})();
