/*global easyXDM, JSON */
(function(window, document, undef){
    var LIBRARYNAME = "Client";
    if (LIBRARYNAME in this) {
        return;
    }
    var library = /* this is the private interface */ {};
    var rpc; /* The easyXDM rpc object */
    var config =/* The main configuration */ {
        apiServerRoot: /* The root path to the server */ "http://api.example.invalid/",
        apiServerPath: /* The relative path to the server document */ "api.html",
        apiServerHelperPath: /* The relative path to the helper document*/ "name.html",
        appKey: /* The application key */ ""
    };
    var eventListeners = /* the event listeners */ {};
    var state = {
        initialized: false,
        signed_in: false
    };
    
    // #ifdef debug
    config.isDebug = true;
    // in production, these should be prepended and minified too
    var dependencies = /* These are the dependencies that we need to have present */ {
        "JSON": location.protocol + "easyxdm.net/current/json2.js",
        "easyXDM": location.protocol + "//easyxdm.net/current/easyXDM.min.js"
    };
    for (var dependency in dependencies) {
        if (dependencies.hasOwnProperty(dependency) && !(dependency in this)) {
            document.write(decodeURIComponent('%3Cscript type="text/javascript" src="' + dependencies[dependency] + '"%3E%3C/script%3E'));
        }
    }
    // #endif
    
    function addEventListener(eventName, eventHandler, context){
        var listeners = eventListeners[eventName] || (eventListeners[eventName] = []);
        if (context) {
            eventHandler = function(args){
                eventHandler.call(context, args);
            };
        }
        listeners.push(eventHandler);
    }
    
    function raiseEvent(eventName, args){
        var listeners = eventListeners[eventName] || (eventListeners[eventName] = []);
        for (var i = 0, len = listeners.length; i < len; i++) {
            try {
                listeners[i](args);
            } 
            catch (e) {
                throw e;
            }
        }
    }
    
    function apply(target, source){
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    
    function copy(source){
        var target = {};
        apply(source, target);
        return target;
    }
    
    function init(){
        rpc = new easyXDM.Rpc({
            local: config.localPath,
            remote: config.apiServerRoot + config.apiServerPath,
            remoteHelper: (config.localPath) ? config.apiServerRoot + config.apiServerHelperPath : undef
        }, {
            local: {
                raiseEvent: raiseEvent
            },
            remote: {
                api: {}
            }
        });
    }
    
    /* ---------------------------------------* 
     * Add all the modules                    *
     * ---------------------------------------*/
    library.provide = function(memberName, member){
        this[memberName] = member;
    };
    
    library.provide("init", function(map){
        apply(config, map);
        init();
    });
	
    library.provide("ui", {
        popup: function(title, url){
            // open the popup, as this is triggered by a user action, the blocker will allow it
            window.open("", "api_sign-in", "width=400, height=400");
            rpc.api("popup", {
                url: url,
                target: "api_sign-in"
            });
        }
    });
    
    library.provide("api", function(method, data, fn){
        switch (method) {
            case "sign-in":
                library.ui.popup("Sign in", "sign_in.html");
                break;
            default:
                // pass it to the provider
                rpc.api(method, data, fn);
        }
    });
    
    library.provide("events", {
        on: addEventListener
    });
    
    library.provide("feed", {
        init: function(){
            this.elements = [];
            var that = this;
            addEventListener("auth-status-change", function(signed_in){
                var feedEl, i, len;
                if (signed_in) {
                    rpc.api("feed.get", null, function(response){
                        if (response.status == "ok") {
                            var feed = JSON.stringify(response.data);
                            for (i = 0, len = that.elements.length; i < len; i++) {
                                feedEl = document.getElementById(that.elements[i]);
                                feedEl.innerHTML = feed;
                            }
                        }
                    });
                }
                else {
                    for (i = 0, len = that.elements.length; i < len; i++) {
                        feedEl = document.getElementById(that.elements[i]);
                        feedEl.innerHTML = '<input type="button" onclick="Client.api(\'sign-in\')" value="Sign In"/>';
                    }
                }
            });
            this._init = true;
        },
        attach: function(id){
            if (!this._init) {
                this.init();
            }
            this.elements.push(id);
        }
    });
    
    /* ---------------------------------------* 
     * Register event listeners               *
     * ---------------------------------------*/
    addEventListener("auth-status-change", function(signed_in){
        state.signed_in = signed_in;
    });
    
    /* ---------------------------------------* 
     * Export the library to the global scope *
     * ---------------------------------------*/
    this[LIBRARYNAME] = library;
}(window, document /*, undefined*/));
