/*jslint evil: true */
/*global easyXDM, JSON */

var hop = Object.prototype.hasOwnProperty;

// Methods for feature testing -  From http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
function isHostMethod(object, property) {
    var t = typeof object[property];
    return t == 'function' ||
    (!!(t == 'object' && object[property])) ||
    t == 'unknown';
}

function isHostObject(object, property) {
    return !!(typeof(object[property]) == 'object' && object[property]);
}

// end

var library = /* this is the private interface */
{
    version: "%%version%%",
    name: "library",
    config: /* The main configuration */
    {
        apiServerRoot: /* The root path to the server */ "http://api.example.invalid/",
        apiServerPath: /* The relative path to the server document */ "api.html",
        apiServerResourcePath: /* The relative path to resource directory*/ "resources/",
        appKey: /* The application key */ "",
        useModal: /* Whether to use DHTML dialogs over window.open */ true,
        cssPrefix: "library"
    }
};

library.easyXDM = easyXDM.noConflict(library.name);

var rpc; /* The easyXDM rpc object */
var eventListeners = /* the event listeners */
{
};
var state = {
    initialized: false,
    signed_in: false
};

/* ---------------------------------------*
 * Utilities                              *
 * ---------------------------------------*/
function apply(target, source) {
    for (var key in source) {
        if (hop.call(source, key)) {
            target[key] = source[key];
        }
    }
}

function copy(source) {
    var target = {};
    apply(source, target);
    return target;
}

function subscribe(eventName, eventHandler, context) {
    var listeners = eventListeners[eventName] || (eventListeners[eventName] = []);
    if (context) {
        eventHandler = function(args) {
            eventHandler.call(context, args);
        };
    }
    listeners.push(eventHandler);
}

function publish(eventName, args) {
    var listeners = eventListeners[eventName] || (eventListeners[eventName] = []);
    function throwError(e) {
        setTimeout( function() {
            throw e;
        }, 0);
    }

    for (var i = 0, len = listeners.length; i < len; i++) {
        try {
            listeners[i](args);
        } catch (e) {
            throwError(e);
        }
    }
}

function init() {
    rpc = new library.easyXDM.Rpc({
        channel: "xyz",
        local: library.config.localPath,
        remote: library.config.apiServerRoot + library.config.apiServerPath + "?appKey=" + encodeURIComponent(library.config.appKey),
        swf: library.config.apiServerRoot + library.config.apiServerResourcePath + "easyxdm.swf"
    }, {
        local: {
            publish: publish,
            closeUI: function(notifyOnly) {
               publish("ui.hide", notifyOnly);
            }
        },
        remote: {
            api: {}
        }
    });
}

/* ---------------------------------------*
 * Register event listeners               *
 * ---------------------------------------*/
subscribe("auth.change", function(signed_in) {
    state.signed_in = signed_in;
    if (signed_in) {
        publish("ui.hide");
    }
});
library.provide = function(memberName, member) {
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
library.provide("init", function(map) {
    apply(library.config, map);
    this.css.apply();
    init();
});
library.provide("css", {
    _css: [],
    register: function(key, rules) {
        if (!(key in this._css)) {
            this._css[key] = rules;
        }
    },
    apply: function() {
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

library.provide("api", function(method, data, fn) {
    switch (method) {
        case "sign-in":
            publish("auth.signin");
            break;
        case "sign-out":
            publish("auth.signout");
            break;
        default:
            // pass it to the provider
            rpc.api(method, data, fn);
    }
});
library.provide("events", {
    subscribe: subscribe
});