/**
 * @file prescribe
 * @description Tiny, forgiving HTML parser
 * @version v1.1.3
 * @see {@link https://github.com/krux/prescribe/}
 * @license MIT
 * @author Derek Brans
 * @copyright 2017 Krux Digital, Inc
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Prescribe"] = factory();
	else
		root["Prescribe"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _HtmlParser = __webpack_require__(1);

	var _HtmlParser2 = _interopRequireDefault(_HtmlParser);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	module.exports = _HtmlParser2['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _supports = __webpack_require__(2);

	var supports = _interopRequireWildcard(_supports);

	var _streamReaders = __webpack_require__(3);

	var streamReaders = _interopRequireWildcard(_streamReaders);

	var _fixedReadTokenFactory = __webpack_require__(6);

	var _fixedReadTokenFactory2 = _interopRequireDefault(_fixedReadTokenFactory);

	var _utils = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Detection regular expressions.
	 *
	 * Order of detection matters: detection of one can only
	 * succeed if detection of previous didn't

	 * @type {Object}
	 */
	var detect = {
	  comment: /^<!--/,
	  endTag: /^<\//,
	  atomicTag: /^<\s*(script|style|noscript|iframe|textarea)[\s\/>]/i,
	  startTag: /^</,
	  chars: /^[^<]/
	};

	/**
	 * HtmlParser provides the capability to parse HTML and return tokens
	 * representing the tags and content.
	 */

	var HtmlParser = function () {
	  /**
	   * Constructor.
	   *
	   * @param {string} stream The initial parse stream contents.
	   * @param {Object} options The options
	   * @param {boolean} options.autoFix Set to true to automatically fix errors
	   */
	  function HtmlParser() {
	    var _this = this;

	    var stream = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    _classCallCheck(this, HtmlParser);

	    this.stream = stream;

	    var fix = false;
	    var fixedTokenOptions = {};

	    for (var key in supports) {
	      if (supports.hasOwnProperty(key)) {
	        if (options.autoFix) {
	          fixedTokenOptions[key + 'Fix'] = true; // !supports[key];
	        }
	        fix = fix || fixedTokenOptions[key + 'Fix'];
	      }
	    }

	    if (fix) {
	      this._readToken = (0, _fixedReadTokenFactory2['default'])(this, fixedTokenOptions, function () {
	        return _this._readTokenImpl();
	      });
	      this._peekToken = (0, _fixedReadTokenFactory2['default'])(this, fixedTokenOptions, function () {
	        return _this._peekTokenImpl();
	      });
	    } else {
	      this._readToken = this._readTokenImpl;
	      this._peekToken = this._peekTokenImpl;
	    }
	  }

	  /**
	   * Appends the given string to the parse stream.
	   *
	   * @param {string} str The string to append
	   */


	  HtmlParser.prototype.append = function append(str) {
	    this.stream += str;
	  };

	  /**
	   * Prepends the given string to the parse stream.
	   *
	   * @param {string} str The string to prepend
	   */


	  HtmlParser.prototype.prepend = function prepend(str) {
	    this.stream = str + this.stream;
	  };

	  /**
	   * The implementation of the token reading.
	   *
	   * @private
	   * @returns {?Token}
	   */


	  HtmlParser.prototype._readTokenImpl = function _readTokenImpl() {
	    var token = this._peekTokenImpl();
	    if (token) {
	      this.stream = this.stream.slice(token.length);
	      return token;
	    }
	  };

	  /**
	   * The implementation of token peeking.
	   *
	   * @returns {?Token}
	   */


	  HtmlParser.prototype._peekTokenImpl = function _peekTokenImpl() {
	    for (var type in detect) {
	      if (detect.hasOwnProperty(type)) {
	        if (detect[type].test(this.stream)) {
	          var token = streamReaders[type](this.stream);

	          if (token) {
	            if (token.type === 'startTag' && /script|style/i.test(token.tagName)) {
	              return null;
	            } else {
	              token.text = this.stream.substr(0, token.length);
	              return token;
	            }
	          }
	        }
	      }
	    }
	  };

	  /**
	   * The public token peeking interface.  Delegates to the basic token peeking
	   * or a version that performs fixups depending on the `autoFix` setting in
	   * options.
	   *
	   * @returns {object}
	   */


	  HtmlParser.prototype.peekToken = function peekToken() {
	    return this._peekToken();
	  };

	  /**
	   * The public token reading interface.  Delegates to the basic token reading
	   * or a version that performs fixups depending on the `autoFix` setting in
	   * options.
	   *
	   * @returns {object}
	   */


	  HtmlParser.prototype.readToken = function readToken() {
	    return this._readToken();
	  };

	  /**
	   * Read tokens and hand to the given handlers.
	   *
	   * @param {Object} handlers The handlers to use for the different tokens.
	   */


	  HtmlParser.prototype.readTokens = function readTokens(handlers) {
	    var tok = void 0;
	    while (tok = this.readToken()) {
	      // continue until we get an explicit "false" return
	      if (handlers[tok.type] && handlers[tok.type](tok) === false) {
	        return;
	      }
	    }
	  };

	  /**
	   * Clears the parse stream.
	   *
	   * @returns {string} The contents of the parse stream before clearing.
	   */


	  HtmlParser.prototype.clear = function clear() {
	    var rest = this.stream;
	    this.stream = '';
	    return rest;
	  };

	  /**
	   * Returns the rest of the parse stream.
	   *
	   * @returns {string} The contents of the parse stream.
	   */


	  HtmlParser.prototype.rest = function rest() {
	    return this.stream;
	  };

	  return HtmlParser;
	}();

	exports['default'] = HtmlParser;


	HtmlParser.tokenToString = function (tok) {
	  return tok.toString();
	};

	HtmlParser.escapeAttributes = function (attrs) {
	  var escapedAttrs = {};

	  for (var name in attrs) {
	    if (attrs.hasOwnProperty(name)) {
	      escapedAttrs[name] = (0, _utils.escapeQuotes)(attrs[name], null);
	    }
	  }

	  return escapedAttrs;
	};

	HtmlParser.supports = supports;

	for (var key in supports) {
	  if (supports.hasOwnProperty(key)) {
	    HtmlParser.browserHasFlaw = HtmlParser.browserHasFlaw || !supports[key] && key;
	  }
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	var tagSoup = false;
	var selfClose = false;

	var work = window.document.createElement('div');

	try {
	  var html = '<P><I></P></I>';
	  work.innerHTML = html;
	  exports.tagSoup = tagSoup = work.innerHTML !== html;
	} catch (e) {
	  exports.tagSoup = tagSoup = false;
	}

	try {
	  work.innerHTML = '<P><i><P></P></i></P>';
	  exports.selfClose = selfClose = work.childNodes.length === 2;
	} catch (e) {
	  exports.selfClose = selfClose = false;
	}

	work = null;

	exports.tagSoup = tagSoup;
	exports.selfClose = selfClose;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.comment = comment;
	exports.chars = chars;
	exports.startTag = startTag;
	exports.atomicTag = atomicTag;
	exports.endTag = endTag;

	var _tokens = __webpack_require__(4);

	/**
	 * Regular Expressions for parsing tags and attributes
	 *
	 * @type {Object}
	 */
	var REGEXES = {
	  startTag: /^<([\-A-Za-z0-9_!:]+)((?:\s+[\w\-]+(?:\s*=?\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
	  endTag: /^<\/([\-A-Za-z0-9_:]+)[^>]*>/,
	  attr: /(?:([\-A-Za-z0-9_]+)\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))|(?:([\-A-Za-z0-9_]+)(\s|$)+)/g,
	  fillAttr: /^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noresize|noshade|nowrap|readonly|selected)$/i
	};

	/**
	 * Reads a comment token
	 *
	 * @param {string} stream The input stream
	 * @returns {CommentToken}
	 */
	function comment(stream) {
	  var index = stream.indexOf('-->');
	  if (index >= 0) {
	    return new _tokens.CommentToken(stream.substr(4, index - 1), index + 3);
	  }
	}

	/**
	 * Reads non-tag characters.
	 *
	 * @param {string} stream The input stream
	 * @returns {CharsToken}
	 */
	function chars(stream) {
	  var index = stream.indexOf('<');
	  return new _tokens.CharsToken(index >= 0 ? index : stream.length);
	}

	/**
	 * Reads start tag token.
	 *
	 * @param {string} stream The input stream
	 * @returns {StartTagToken}
	 */
	function startTag(stream) {
	  var endTagIndex = stream.indexOf('>');
	  if (endTagIndex !== -1) {
	    var match = stream.match(REGEXES.startTag);
	    if (match) {
	      var attrs = {};
	      var booleanAttrs = {};
	      var rest = match[2];

	      match[2].replace(REGEXES.attr, function (match, name) {
	        if (!(arguments[2] || arguments[3] || arguments[4] || arguments[5])) {
	          attrs[name] = '';
	        } else if (arguments[5]) {
	          attrs[arguments[5]] = '';
	          booleanAttrs[arguments[5]] = true;
	        } else {
	          attrs[name] = arguments[2] || arguments[3] || arguments[4] || REGEXES.fillAttr.test(name) && name || '';
	        }

	        rest = rest.replace(match, '');
	      });

	      return new _tokens.StartTagToken(match[1], match[0].length, attrs, booleanAttrs, !!match[3], rest.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ''));
	    }
	  }
	}

	/**
	 * Reads atomic tag token.
	 *
	 * @param {string} stream The input stream
	 * @returns {AtomicTagToken}
	 */
	function atomicTag(stream) {
	  var start = startTag(stream);
	  if (start) {
	    var rest = stream.slice(start.length);
	    // for optimization, we check first just for the end tag
	    if (rest.match(new RegExp('<\/\\s*' + start.tagName + '\\s*>', 'i'))) {
	      // capturing the content is inefficient, so we do it inside the if
	      var match = rest.match(new RegExp('([\\s\\S]*?)<\/\\s*' + start.tagName + '\\s*>', 'i'));
	      if (match) {
	        return new _tokens.AtomicTagToken(start.tagName, match[0].length + start.length, start.attrs, start.booleanAttrs, match[1]);
	      }
	    }
	  }
	}

	/**
	 * Reads an end tag token.
	 *
	 * @param {string} stream The input stream
	 * @returns {EndTagToken}
	 */
	function endTag(stream) {
	  var match = stream.match(REGEXES.endTag);
	  if (match) {
	    return new _tokens.EndTagToken(match[1], match[0].length);
	  }
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.EndTagToken = exports.AtomicTagToken = exports.StartTagToken = exports.TagToken = exports.CharsToken = exports.CommentToken = exports.Token = undefined;

	var _utils = __webpack_require__(5);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Token is a base class for all token types parsed.  Note we don't actually
	 * use intheritance due to IE8's non-existent ES5 support.
	 */
	var Token =
	/**
	 * Constructor.
	 *
	 * @param {string} type The type of the Token.
	 * @param {Number} length The length of the Token text.
	 */
	exports.Token = function Token(type, length) {
	  _classCallCheck(this, Token);

	  this.type = type;
	  this.length = length;
	  this.text = '';
	};

	/**
	 * CommentToken represents comment tags.
	 */


	var CommentToken = exports.CommentToken = function () {
	  /**
	   * Constructor.
	   *
	   * @param {string} content The content of the comment
	   * @param {Number} length The length of the Token text.
	   */
	  function CommentToken(content, length) {
	    _classCallCheck(this, CommentToken);

	    this.type = 'comment';
	    this.length = length || (content ? content.length : 0);
	    this.text = '';
	    this.content = content;
	  }

	  CommentToken.prototype.toString = function toString() {
	    return '<!--' + this.content;
	  };

	  return CommentToken;
	}();

	/**
	 * CharsToken represents non-tag characters.
	 */


	var CharsToken = exports.CharsToken = function () {
	  /**
	   * Constructor.
	   *
	   * @param {Number} length The length of the Token text.
	   */
	  function CharsToken(length) {
	    _classCallCheck(this, CharsToken);

	    this.type = 'chars';
	    this.length = length;
	    this.text = '';
	  }

	  CharsToken.prototype.toString = function toString() {
	    return this.text;
	  };

	  return CharsToken;
	}();

	/**
	 * TagToken is a base class for all tag-based Tokens.
	 */


	var TagToken = exports.TagToken = function () {
	  /**
	   * Constructor.
	   *
	   * @param {string} type The type of the token.
	   * @param {string} tagName The tag name.
	   * @param {Number} length The length of the Token text.
	   * @param {Object} attrs The dictionary of attributes and values
	   * @param {Object} booleanAttrs If an entry has 'true' then the attribute
	   *                              is a boolean attribute
	   */
	  function TagToken(type, tagName, length, attrs, booleanAttrs) {
	    _classCallCheck(this, TagToken);

	    this.type = type;
	    this.length = length;
	    this.text = '';
	    this.tagName = tagName;
	    this.attrs = attrs;
	    this.booleanAttrs = booleanAttrs;
	    this.unary = false;
	    this.html5Unary = false;
	  }

	  /**
	   * Formats the given token tag.
	   *
	   * @param {TagToken} tok The TagToken to format.
	   * @param {?string} [content=null] The content of the token.
	   * @returns {string} The formatted tag.
	   */


	  TagToken.formatTag = function formatTag(tok) {
	    var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	    var str = '<' + tok.tagName;
	    for (var key in tok.attrs) {
	      if (tok.attrs.hasOwnProperty(key)) {
	        str += ' ' + key;

	        var val = tok.attrs[key];
	        if (typeof tok.booleanAttrs === 'undefined' || typeof tok.booleanAttrs[key] === 'undefined') {
	          str += '="' + (0, _utils.escapeQuotes)(val) + '"';
	        }
	      }
	    }

	    if (tok.rest) {
	      str += ' ' + tok.rest;
	    }

	    if (tok.unary && !tok.html5Unary) {
	      str += '/>';
	    } else {
	      str += '>';
	    }

	    if (content !== undefined && content !== null) {
	      str += content + '</' + tok.tagName + '>';
	    }

	    return str;
	  };

	  return TagToken;
	}();

	/**
	 * StartTagToken represents a start token.
	 */


	var StartTagToken = exports.StartTagToken = function () {
	  /**
	   * Constructor.
	   *
	   * @param {string} tagName The tag name.
	   * @param {Number} length The length of the Token text
	   * @param {Object} attrs The dictionary of attributes and values
	   * @param {Object} booleanAttrs If an entry has 'true' then the attribute
	   *                              is a boolean attribute
	   * @param {boolean} unary True if the tag is a unary tag
	   * @param {string} rest The rest of the content.
	   */
	  function StartTagToken(tagName, length, attrs, booleanAttrs, unary, rest) {
	    _classCallCheck(this, StartTagToken);

	    this.type = 'startTag';
	    this.length = length;
	    this.text = '';
	    this.tagName = tagName;
	    this.attrs = attrs;
	    this.booleanAttrs = booleanAttrs;
	    this.html5Unary = false;
	    this.unary = unary;
	    this.rest = rest;
	  }

	  StartTagToken.prototype.toString = function toString() {
	    return TagToken.formatTag(this);
	  };

	  return StartTagToken;
	}();

	/**
	 * AtomicTagToken represents an atomic tag.
	 */


	var AtomicTagToken = exports.AtomicTagToken = function () {
	  /**
	   * Constructor.
	   *
	   * @param {string} tagName The name of the tag.
	   * @param {Number} length The length of the tag text.
	   * @param {Object} attrs The attributes.
	   * @param {Object} booleanAttrs If an entry has 'true' then the attribute
	   *                              is a boolean attribute
	   * @param {string} content The content of the tag.
	   */
	  function AtomicTagToken(tagName, length, attrs, booleanAttrs, content) {
	    _classCallCheck(this, AtomicTagToken);

	    this.type = 'atomicTag';
	    this.length = length;
	    this.text = '';
	    this.tagName = tagName;
	    this.attrs = attrs;
	    this.booleanAttrs = booleanAttrs;
	    this.unary = false;
	    this.html5Unary = false;
	    this.content = content;
	  }

	  AtomicTagToken.prototype.toString = function toString() {
	    return TagToken.formatTag(this, this.content);
	  };

	  return AtomicTagToken;
	}();

	/**
	 * EndTagToken represents an end tag.
	 */


	var EndTagToken = exports.EndTagToken = function () {
	  /**
	   * Constructor.
	   *
	   * @param {string} tagName The name of the tag.
	   * @param {Number} length The length of the tag text.
	   */
	  function EndTagToken(tagName, length) {
	    _classCallCheck(this, EndTagToken);

	    this.type = 'endTag';
	    this.length = length;
	    this.text = '';
	    this.tagName = tagName;
	  }

	  EndTagToken.prototype.toString = function toString() {
	    return '</' + this.tagName + '>';
	  };

	  return EndTagToken;
	}();

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.escapeQuotes = escapeQuotes;

	/**
	 * Escape quotes in the given value.
	 *
	 * @param {string} value The value to escape.
	 * @param {string} [defaultValue=''] The default value to return if value is falsy.
	 * @returns {string}
	 */
	function escapeQuotes(value) {
	  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	  // There's no lookback in JS, so /(^|[^\\])"/ only matches the first of two `"`s.
	  // Instead, just match anything before a double-quote and escape if it's not already escaped.
	  return !value ? defaultValue : value.replace(/([^"]*)"/g, function (_, prefix) {
	    return (/\\/.test(prefix) ? prefix + '"' : prefix + '\\"'
	    );
	  });
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = fixedReadTokenFactory;
	/**
	 * Empty Elements - HTML 4.01
	 *
	 * @type {RegExp}
	 */
	var EMPTY = /^(AREA|BASE|BASEFONT|BR|COL|FRAME|HR|IMG|INPUT|ISINDEX|LINK|META|PARAM|EMBED)$/i;

	/**
	 * Elements that you can intentionally leave open (and which close themselves)
	 *
	 * @type {RegExp}
	 */
	var CLOSESELF = /^(COLGROUP|DD|DT|LI|OPTIONS|P|TD|TFOOT|TH|THEAD|TR)$/i;

	/**
	 * Corrects a token.
	 *
	 * @param {Token} tok The token to correct
	 * @returns {Token} The corrected token
	 */
	function correct(tok) {
	  if (tok && tok.type === 'startTag') {
	    tok.unary = EMPTY.test(tok.tagName) || tok.unary;
	    tok.html5Unary = !/\/>$/.test(tok.text);
	  }
	  return tok;
	}

	/**
	 * Peeks at the next token in the parser.
	 *
	 * @param {HtmlParser} parser The parser
	 * @param {Function} readTokenImpl The underlying readToken implementation
	 * @returns {Token} The next token
	 */
	function peekToken(parser, readTokenImpl) {
	  var tmp = parser.stream;
	  var tok = correct(readTokenImpl());
	  parser.stream = tmp;
	  return tok;
	}

	/**
	 * Closes the last token.
	 *
	 * @param {HtmlParser} parser The parser
	 * @param {Array<Token>} stack The stack
	 */
	function closeLast(parser, stack) {
	  var tok = stack.pop();

	  // prepend close tag to stream.
	  parser.prepend('</' + tok.tagName + '>');
	}

	/**
	 * Create a new token stack.
	 *
	 * @returns {Array<Token>}
	 */
	function newStack() {
	  var stack = [];

	  stack.last = function () {
	    return this[this.length - 1];
	  };

	  stack.lastTagNameEq = function (tagName) {
	    var last = this.last();
	    return last && last.tagName && last.tagName.toUpperCase() === tagName.toUpperCase();
	  };

	  stack.containsTagName = function (tagName) {
	    for (var i = 0, tok; tok = this[i]; i++) {
	      if (tok.tagName === tagName) {
	        return true;
	      }
	    }
	    return false;
	  };

	  return stack;
	}

	/**
	 * Return a readToken implementation that fixes input.
	 *
	 * @param {HtmlParser} parser The parser
	 * @param {Object} options Options for fixing
	 * @param {boolean} options.tagSoupFix True to fix tag soup scenarios
	 * @param {boolean} options.selfCloseFix True to fix self-closing tags
	 * @param {Function} readTokenImpl The underlying readToken implementation
	 * @returns {Function}
	 */
	function fixedReadTokenFactory(parser, options, readTokenImpl) {
	  var stack = newStack();

	  var handlers = {
	    startTag: function startTag(tok) {
	      var tagName = tok.tagName;

	      if (tagName.toUpperCase() === 'TR' && stack.lastTagNameEq('TABLE')) {
	        parser.prepend('<TBODY>');
	        prepareNextToken();
	      } else if (options.selfCloseFix && CLOSESELF.test(tagName) && stack.containsTagName(tagName)) {
	        if (stack.lastTagNameEq(tagName)) {
	          closeLast(parser, stack);
	        } else {
	          parser.prepend('</' + tok.tagName + '>');
	          prepareNextToken();
	        }
	      } else if (!tok.unary) {
	        stack.push(tok);
	      }
	    },
	    endTag: function endTag(tok) {
	      var last = stack.last();
	      if (last) {
	        if (options.tagSoupFix && !stack.lastTagNameEq(tok.tagName)) {
	          // cleanup tag soup
	          closeLast(parser, stack);
	        } else {
	          stack.pop();
	        }
	      } else if (options.tagSoupFix) {
	        // cleanup tag soup part 2: skip this token
	        readTokenImpl();
	        prepareNextToken();
	      }
	    }
	  };

	  function prepareNextToken() {
	    var tok = peekToken(parser, readTokenImpl);
	    if (tok && handlers[tok.type]) {
	      handlers[tok.type](tok);
	    }
	  }

	  return function fixedReadToken() {
	    prepareNextToken();
	    return correct(readTokenImpl());
	  };
	}

/***/ }
/******/ ])
});
;