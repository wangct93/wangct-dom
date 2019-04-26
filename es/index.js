
import util,{stringUtil,arrayUtil} from 'wangct-util';

export default function $(selector){
    return new DOMElement(selector);
}


class DOMElement {
    constructor(selector) {
        this.init(selector);
    }

    elemList = [];
    length = 0;

    init(selector = {}) {
        let list = [];

        if (selector.nodeType === 9 || selector.nodeType === 1) {
            list = [selector];
        } else if (typeof selector === 'string') {
            list = Array.from(document.querySelectorAll(selector));
        } else {
            list = Array.from(selector);
        }

        this.setList(list);
    }

    setList(list){
        this.elemList = list;
        this.length = list.length;
    }

    getList(){
        return this.elemList;
    }

    forEach(fn){
        this.getList().forEach(fn);
        return this;
    }

    eq(index){
        return $(this.getList()[index]);
    }

    first(){
        return this.eq(0);
    }

    last(){
        return this.eq(this.length - 1);
    }

    on(type,func,bol){
        this.getList().forEach(item => {
            const {eventCache = {}} = item;
            const funcList = eventCache[type] || [];
            funcList.push(func);
            eventCache[type] = funcList;
            item.eventCache = eventCache;
            item.addEventListener(type, func, bol);
        });
        return this;
    }

    off(type, func){
        this.getList().forEach(item => {
            const {eventCache = {}} = item;
            const funcList = eventCache[type] || [];
            if(util.isFunction(func)){
                arrayUtil.remove(funcList,func);
                item.removeEventListener(type, func);
            }else{
                funcList.forEach(func => {
                    item.removeEventListener(type, func);
                });
                funcList.splice(0,funcList.length);
            }
        });
        return this;
    }

    attr(key, value) {
        const list = this.getList();
        if(util.isUndefined(value)){
            return list[0] && list[0].getAttribute(key);
        }
        list.forEach(item => {
            item.setAttribute(key,value);
        });
        return this;
    }

    removeAttr(key){
        this.getList().forEach(item => item.removeAttribute(key));
        return this;
    }

    prop(key, value) {
        const list = this.getList();
        if(util.isUndefined(value)){
            return list[0] && list[0][key];
        }
        list.forEach(item => {
            item[key] = value;
        });
        return this;
    }

    hasClass(className){
        return this.getList().every(item => getClassName(item).split(/\s+/).includes(className));
    }

    addClass(className) {
        this.getList().forEach(item => {
            const temp = getClassName(item).split(/\s+/);
            temp.push(className);
            item.className = arrayUtil.noRepeat(temp).filter(item => !!item).join(' ');
        });
        return this;
    }

    removeClass(className) {
        this.getList().forEach(item => {
            const temp = getClassName(item).split(/\s+/);
            arrayUtil.remove(temp,className);
            item.className = arrayUtil.noRepeat(temp).filter(item => !!item).join(' ');
        });
        return this;
    }

    toggleClass(className){
        this.getList().forEach(item => {
            const temp = getClassName(item).split(/\s+/);
            if(temp.includes(className)){
                arrayUtil.remove(temp,className);
            }else{
                temp.push(className);
            }
            item.className = arrayUtil.noRepeat(temp).filter(item => !!item).join(' ');
        });
        return this;
    }

    css(key, value) {
        if(util.isObject(key)){
            Object.keys(key).forEach(item => {
                this.css(item,key[item]);
            });
        }else if(util.isUndefined(value)){
            const list = this.getList();
            return list[0] && etComputedStyle(list[0], false)[key]
        }else{
            this.getList().forEach(item => {
                item.style[key] = value;
            })
        }
        return this;
    }

    next(selector){
        const list = this.getList().map(item => {
            let next = item.nextElementSibling;
            while (next && !isValidElem(next, selector)) {
                next = next.nextElementSibling;
            }
            return next;
        });
        return $(list);
    }

    prev(){
        const list = this.getList().map(item => {
            let prev = item.previousElementSibling;
            while (prev && !isValidElem(prev, selector)) {
                prev = prev.previousElementSibling;
            }
            return prev;
        });
        return $(list);
    }

    index(){
        const elem = this.getList()[0];
        if(elem){
            let prev = elem.previousElementSibling;
            let i = 0;
            while(prev){
                i++;
                prev = prev.previousElementSibling;
            }
            return i;
        }else{
            return -1;
        }
    }

    show(displayValue = 'block') {
        return this.css('display', displayValue);
    }

    hide() {
        return this.css('display', 'none');
    }

    parent() {
        const list = this.getList().map(item => item.parentNode);
        return $(list);
    }

    children(selector){
        const list = this.getList().reduce((pv,item) => {
            return pv.concat(Array.from(item.children));
        },[]);
        return $(list).filter(selector);
    }

    siblings(selector) {
        const list = this.getList().reduce((pv,item) => {
            return pv.concat(Array.from(item.parentNode.children).filter(otherItem => otherItem !== item));
        },[]);
        return $(list).filter(selector);
    }

    append(children) {
        this.getList().forEach(item => {
            $(children).getList().forEach(child => {
                item.appendChild(child);
            });
        });
        return this;
    }

    prepend(children){
        this.getList().forEach(item => {
            let firstChild = item.children[0];
            $(children).getList().forEach(child => {
                if (firstChild) {
                    item.insertBefore(child, firstChild);
                } else {
                    item.appendChild(child);
                }
            });
        });
        return this;
    }

    before(children){
        this.getList().forEach(item => {
            $(children).getList().forEach(child => {
                item.parentNode.insertBefore(child, item);
            });
        });
        return this;
    }

    after(children){
        this.getList().forEach(item => {
            const next = item.nextElementSibling;
            $(children).getList().forEach(child => {
                if(next){
                    next.parentNode.insertBefore(child,next);
                }else{
                    next.parentNode.appendChild(child);
                }
            });
        });
        return this;
    }

    remove() {
        this.getList().forEach(item => item.parentNode.removeChild(item));
        return this;
    }

    getRect(){
        const elem = this.getList()[0];
        return elem && elem.getBoundingClientRect();
    }

    find(selector){
        const list = this.getList().reduce((pv,item) => {
            return pv.concat(Array.from(item.querySelectorAll(selector)));
        },[]);
        return $(list);
    }

    text(text){
        if(util.isUndefined(text)){
            const elem = this.getList()[0];
            return elem && elem.innerText;
        }else{
            this.getList().forEach(item => {
                item.innerText = text;
            })
        }
        return this;
    }

    html(html){
        if(util.isUndefined(html)){
            const elem = this.getList()[0];
            return elem && elem.innerHTML;
        }else{
            this.getList().forEach(item => {
                item.innerHTML = html;
            })
        }
        return this;
    }

    val(value){
        if(util.isUndefined(value)){
            const elem = this.getList()[0];
            return elem && elem.value;
        }else{
            this.getList().forEach(item => {
                item.value = value;
            })
        }
        return this;
    }

    empty(){
        this.getList().forEach(item => item.innerHTML = '');
        return this;
    }

    filter(selector){
        const list = this.getList().filter(item => isValidElem(item,selector));
        return $(list);
    }

    closest(selector){
        const list = this.getList().map(item => {
            while(item && !isValidElem(item,selector)){
                item = item.parentNode;
            }
            return item;
        }).filter(item => !!item);
        return $(list);
    }
}



function getClassName(elem){
    return stringUtil.toString(elem.className);
}

function isValidElem(elem,selector = ''){
    if(selector[0] === '.'){
        return getClassName(elem).includes(selector.substr(1))
    }else if(selector[0] === '#'){
        return elem.id === selector.substr(1);
    }else{
        return elem.nodeName.toLocaleLowerCase() === selector;
    }
}