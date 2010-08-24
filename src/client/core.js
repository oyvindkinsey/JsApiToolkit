/*jslint evil: true */
/*global easyXDM, JSON */

var hop = Object.prototype.hasOwnProperty;

// Methods for feature testing -  From http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
function isHostMethod(object, property){
    var t = typeof object[property];
    return t == 'function' ||
    (!!(t == 'object' && object[property])) ||
    t == 'unknown';
}

function isHostObject(object, property){
    return !!(typeof(object[property]) == 'object' && object[property]);
}

// end 

var library = /* this is the private interface */ {
    version: "%%version%%",
    name: "library",
    config: /* The main configuration */ {
        apiServerRoot: /* The root path to the server */ "http://api.example.invalid/",
        apiServerPath: /* The relative path to the server document */ "api.html",
        apiServerHelperPath: /* The relative path to the helper document*/ "name.html",
        appKey: /* The application key */ "",
        useModal: /* Whether to use DHTML dialogs over window.open */ true,
        cssPrefix: "library"
    }
};
var rpc; /* The easyXDM rpc object */
var eventListeners = /* the event listeners */ {};
var state = {
    initialized: false,
    signed_in: false
};

// #ifdef debug
library.config.isDebug = true;
// in production, these should be prepended and minified too
var dependencies = /* These are the dependencies that we need to have present */ {
    "JSON": "../../lib/json2.js",
    "easyXDM": "../../lib/easyXDM.min.js"
};
for (var dependency in dependencies) {
    if (hop.call(dependencies, dependency) && !(dependency in this)) {
        document.write(decodeURIComponent('%3Cscript type="text/javascript" src="' + dependencies[dependency] + '"%3E%3C/script%3E'));
    }
}
// #endif

/* ---------------------------------------* 
 * Utilities                              *
 * ---------------------------------------*/
function apply(target, source){
    for (var key in source) {
        if (hop.call(source, key)) {
            target[key] = source[key];
        }
    }
}

function copy(source){
    var target = {};
    apply(source, target);
    return target;
}

function subscribe(eventName, eventHandler, context){
    var listeners = eventListeners[eventName] || (eventListeners[eventName] = []);
    if (context) {
        eventHandler = function(args){
            eventHandler.call(context, args);
        };
    }
    listeners.push(eventHandler);
}

function publish(eventName, args){
    var listeners = eventListeners[eventName] || (eventListeners[eventName] = []);
    for (var i = 0, len = listeners.length; i < len; i++) {
        try {
            listeners[i](args);
        } 
        catch (e) {
            (function(e){
                setTimeout(function(){
                    throw e;
                }, 0);
            }(e));
        }
    }
}

function init(){
    rpc = new easyXDM.Rpc({
        channel: "xyz",
        local: library.config.localPath,
        remote: library.config.apiServerRoot + library.config.apiServerPath,
        remoteHelper: (library.config.localPath) ? library.config.apiServerRoot + library.config.apiServerHelperPath : undefined
    }, {
        local: {
            publish: publish
        },
        remote: {
            api: {}
        }
    });
}

/* ---------------------------------------* 
 * Register event listeners               *
 * ---------------------------------------*/
subscribe("auth.change", function(signed_in){
    state.signed_in = signed_in;
});

library.provide = function(memberName, member){
    if (memberName in this) {
        apply(this[memberName], member);
    }
    else {
        this[memberName] = member;
    }
};

/* ---------------------------------------* 
 * Add the core modules                    *
 * ---------------------------------------*/
library.provide("init", function(map){
    apply(library.config, map);
    this.css.apply();
    init();
});

library.provide("css", {
    _css: [],
    register: function(key, rules){
        if (!(key in this._css)) {
            this._css[key] = rules;
        }
    },
    apply: function(){
        var styles = [], module, block, rules;
        for (var key in this._css) {
            if (hop.call(this._css, key)) {
                module = this._css[key];
                for (var element in module) {
                    if (hop.call(module, element)) {
                        block = module[element];
                        rules = [];
                        for (var rule in block) {
                            if (hop.call(block, rule)) {
                                rules.push(rule + ":" + block[rule] + ";\n");
                            }
                        }
                        styles.push("." + library.config.cssPrefix + "-" + key + "-" + element + " {\n" + rules.join("") + "}");
                    }
                }
            }
        }
        styles = styles.join("\n");
        var style = document.createElement("style");
        style.setAttribute("type", "text/css");
        
        if (style.styleSheet) {
            style.styleSheet.cssText = styles;
        }
        else {
            style.innerHTML = styles;
        }
        document.getElementsByTagName("head")[0].appendChild(style);
    }
});

library.provide("api", function(method, data, fn){
    if (method == "sign-in") {
        publish("auth.signin");
    }
    else {
        // pass it to the provider
        rpc.api(method, data, fn);
    }
});

library.provide("events", {
    subscribe: subscribe
});
