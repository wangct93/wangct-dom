'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = $;

var _wangctUtil = require('wangct-util');

var _wangctUtil2 = _interopRequireDefault(_wangctUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function $(selector) {
    return new DOMElement(selector);
}

var DOMElement = function () {
    function DOMElement(selector) {
        _classCallCheck(this, DOMElement);

        this.elemList = [];
        this.length = 0;

        this.init(selector);
    }

    _createClass(DOMElement, [{
        key: 'init',
        value: function init() {
            var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var list = [];

            if (selector.nodeType === 9 || selector.nodeType === 1) {
                list = [selector];
            } else if (typeof selector === 'string') {
                list = Array.from(document.querySelectorAll(selector));
            } else {
                list = Array.from(selector);
            }

            this.setList(list);
        }
    }, {
        key: 'setList',
        value: function setList(list) {
            this.elemList = list;
            this.length = list.length;
        }
    }, {
        key: 'getList',
        value: function getList() {
            return this.elemList;
        }
    }, {
        key: 'forEach',
        value: function forEach(fn) {
            this.getList().forEach(fn);
            return this;
        }
    }, {
        key: 'eq',
        value: function eq(index) {
            return $(this.getList()[index]);
        }
    }, {
        key: 'first',
        value: function first() {
            return this.eq(0);
        }
    }, {
        key: 'last',
        value: function last() {
            return this.eq(this.length - 1);
        }
    }, {
        key: 'on',
        value: function on(type, func, bol) {
            this.getList().forEach(function (item) {
                var _item$eventCache = item.eventCache,
                    eventCache = _item$eventCache === undefined ? {} : _item$eventCache;

                var funcList = eventCache[type] || [];
                funcList.push(func);
                eventCache[type] = funcList;
                item.eventCache = eventCache;
                item.addEventListener(type, func, bol);
            });
            return this;
        }
    }, {
        key: 'off',
        value: function off(type, func) {
            this.getList().forEach(function (item) {
                var _item$eventCache2 = item.eventCache,
                    eventCache = _item$eventCache2 === undefined ? {} : _item$eventCache2;

                var funcList = eventCache[type] || [];
                if (_wangctUtil2.default.isFunction(func)) {
                    _wangctUtil.arrayUtil.remove(funcList, func);
                    item.removeEventListener(type, func);
                } else {
                    funcList.forEach(function (func) {
                        item.removeEventListener(type, func);
                    });
                    funcList.splice(0, funcList.length);
                }
            });
            return this;
        }
    }, {
        key: 'attr',
        value: function attr(key, value) {
            var list = this.getList();
            if (_wangctUtil2.default.isUndefined(value)) {
                return list[0] && list[0].getAttribute(key);
            }
            list.forEach(function (item) {
                item.setAttribute(key, value);
            });
            return this;
        }
    }, {
        key: 'removeAttr',
        value: function removeAttr(key) {
            this.getList().forEach(function (item) {
                return item.removeAttribute(key);
            });
            return this;
        }
    }, {
        key: 'prop',
        value: function prop(key, value) {
            var list = this.getList();
            if (_wangctUtil2.default.isUndefined(value)) {
                return list[0] && list[0][key];
            }
            list.forEach(function (item) {
                item[key] = value;
            });
            return this;
        }
    }, {
        key: 'hasClass',
        value: function hasClass(className) {
            return this.getList().every(function (item) {
                return getClassName(item).split(/\s+/).includes(className);
            });
        }
    }, {
        key: 'addClass',
        value: function addClass(className) {
            this.getList().forEach(function (item) {
                var temp = getClassName(item).split(/\s+/);
                temp.push(className);
                item.className = _wangctUtil.arrayUtil.noRepeat(temp).filter(function (item) {
                    return !!item;
                }).join(' ');
            });
            return this;
        }
    }, {
        key: 'removeClass',
        value: function removeClass(className) {
            this.getList().forEach(function (item) {
                var temp = getClassName(item).split(/\s+/);
                _wangctUtil.arrayUtil.remove(temp, className);
                item.className = _wangctUtil.arrayUtil.noRepeat(temp).filter(function (item) {
                    return !!item;
                }).join(' ');
            });
            return this;
        }
    }, {
        key: 'toggleClass',
        value: function toggleClass(className) {
            this.getList().forEach(function (item) {
                var temp = getClassName(item).split(/\s+/);
                if (temp.includes(className)) {
                    _wangctUtil.arrayUtil.remove(temp, className);
                } else {
                    temp.push(className);
                }
                item.className = _wangctUtil.arrayUtil.noRepeat(temp).filter(function (item) {
                    return !!item;
                }).join(' ');
            });
            return this;
        }
    }, {
        key: 'css',
        value: function css(key, value) {
            var _this = this;

            if (_wangctUtil2.default.isObject(key)) {
                Object.keys(key).forEach(function (item) {
                    _this.css(item, key[item]);
                });
            } else if (_wangctUtil2.default.isUndefined(value)) {
                var list = this.getList();
                return list[0] && etComputedStyle(list[0], false)[key];
            } else {
                this.getList().forEach(function (item) {
                    item.style[key] = value;
                });
            }
            return this;
        }
    }, {
        key: 'next',
        value: function next(selector) {
            var list = this.getList().map(function (item) {
                var next = item.nextElementSibling;
                while (next && !isValidElem(next, selector)) {
                    next = next.nextElementSibling;
                }
                return next;
            });
            return $(list);
        }
    }, {
        key: 'prev',
        value: function prev() {
            var list = this.getList().map(function (item) {
                var prev = item.previousElementSibling;
                while (prev && !isValidElem(prev, selector)) {
                    prev = prev.previousElementSibling;
                }
                return prev;
            });
            return $(list);
        }
    }, {
        key: 'index',
        value: function index() {
            var elem = this.getList()[0];
            if (elem) {
                var prev = elem.previousElementSibling;
                var i = 0;
                while (prev) {
                    i++;
                    prev = prev.previousElementSibling;
                }
                return i;
            } else {
                return -1;
            }
        }
    }, {
        key: 'show',
        value: function show() {
            var displayValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'block';

            return this.css('display', displayValue);
        }
    }, {
        key: 'hide',
        value: function hide() {
            return this.css('display', 'none');
        }
    }, {
        key: 'parent',
        value: function parent() {
            var list = this.getList().map(function (item) {
                return item.parentNode;
            });
            return $(list);
        }
    }, {
        key: 'children',
        value: function children(selector) {
            var list = this.getList().reduce(function (pv, item) {
                return pv.concat(Array.from(item.children));
            }, []);
            return $(list).filter(selector);
        }
    }, {
        key: 'siblings',
        value: function siblings(selector) {
            var list = this.getList().reduce(function (pv, item) {
                return pv.concat(Array.from(item.parentNode.children).filter(function (otherItem) {
                    return otherItem !== item;
                }));
            }, []);
            return $(list).filter(selector);
        }
    }, {
        key: 'append',
        value: function append(children) {
            this.getList().forEach(function (item) {
                $(children).getList().forEach(function (child) {
                    item.appendChild(child);
                });
            });
            return this;
        }
    }, {
        key: 'prepend',
        value: function prepend(children) {
            this.getList().forEach(function (item) {
                var firstChild = item.children[0];
                $(children).getList().forEach(function (child) {
                    if (firstChild) {
                        item.insertBefore(child, firstChild);
                    } else {
                        item.appendChild(child);
                    }
                });
            });
            return this;
        }
    }, {
        key: 'before',
        value: function before(children) {
            this.getList().forEach(function (item) {
                $(children).getList().forEach(function (child) {
                    item.parentNode.insertBefore(child, item);
                });
            });
            return this;
        }
    }, {
        key: 'after',
        value: function after(children) {
            this.getList().forEach(function (item) {
                var next = item.nextElementSibling;
                $(children).getList().forEach(function (child) {
                    if (next) {
                        next.parentNode.insertBefore(child, next);
                    } else {
                        next.parentNode.appendChild(child);
                    }
                });
            });
            return this;
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.getList().forEach(function (item) {
                return item.parentNode.removeChild(item);
            });
            return this;
        }
    }, {
        key: 'getRect',
        value: function getRect() {
            var elem = this.getList()[0];
            return elem && elem.getBoundingClientRect();
        }
    }, {
        key: 'find',
        value: function find(selector) {
            var list = this.getList().reduce(function (pv, item) {
                return pv.concat(Array.from(item.querySelectorAll(selector)));
            }, []);
            return $(list);
        }
    }, {
        key: 'text',
        value: function text(_text) {
            if (_wangctUtil2.default.isUndefined(_text)) {
                var elem = this.getList()[0];
                return elem && elem.innerText;
            } else {
                this.getList().forEach(function (item) {
                    item.innerText = _text;
                });
            }
            return this;
        }
    }, {
        key: 'html',
        value: function html(_html) {
            if (_wangctUtil2.default.isUndefined(_html)) {
                var elem = this.getList()[0];
                return elem && elem.innerHTML;
            } else {
                this.getList().forEach(function (item) {
                    item.innerHTML = _html;
                });
            }
            return this;
        }
    }, {
        key: 'val',
        value: function val(value) {
            if (_wangctUtil2.default.isUndefined(value)) {
                var elem = this.getList()[0];
                return elem && elem.value;
            } else {
                this.getList().forEach(function (item) {
                    item.value = value;
                });
            }
            return this;
        }
    }, {
        key: 'empty',
        value: function empty() {
            this.getList().forEach(function (item) {
                return item.innerHTML = '';
            });
            return this;
        }
    }, {
        key: 'filter',
        value: function filter(selector) {
            var list = this.getList().filter(function (item) {
                return isValidElem(item, selector);
            });
            return $(list);
        }
    }, {
        key: 'closest',
        value: function closest(selector) {
            var list = this.getList().map(function (item) {
                while (item && !isValidElem(item, selector)) {
                    item = item.parentNode;
                }
                return item;
            }).filter(function (item) {
                return !!item;
            });
            return $(list);
        }
    }]);

    return DOMElement;
}();

function getClassName(elem) {
    return _wangctUtil.stringUtil.toString(elem.className);
}

function isValidElem(elem) {
    var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (selector[0] === '.') {
        return getClassName(elem).includes(selector.substr(1));
    } else if (selector[0] === '#') {
        return elem.id === selector.substr(1);
    } else {
        return elem.nodeName.toLocaleLowerCase() === selector;
    }
}