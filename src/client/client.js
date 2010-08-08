/*global easyXDM */
(function(window, document, undef){
    var LIBRARYNAME = "Client";
    if (LIBRARYNAME in this) {
        return;
    }
    
    var rpc; /* The easyXDM rpc object */
    var config =/* The main configuration */ {
        apiServerRoot: /* The root path to the server */ "http://api.example.invalid/",
        apiServerPath: /* The relative path to the server document */ "api.html",
        apiServerHelperPath: /* The relative path to the helper document*/ "name.html",
        appKey: /* The application key */ ""
    };
    var eventListeners = /* the event listeners */ {};
    
    /**
     *
     * @param {Object} eventName
     * @param {Object} eventHandler
     */
    function addEventListener(eventName, eventHandler, context){
        var listeners = eventListeners[eventName] || (eventListeners[eventName] = []);
        if (context) {
            eventHandler = function(){
                eventHandler.call(context);
            };
        }
        listeners.push(eventHandler);
    }
    
    /**
     *
     * @param {Object} eventName
     * @param {Object} args
     */
    function raiseEvent(eventName, args){
        var listeners = eventListeners[eventName] || (eventListeners[eventName] = []);
        for (var i = 0, len = listeners.length; i < len; i++) {
            try {
                listeners[i]();
            } 
            catch (e) {
            }
        }
    }
    
    /**
     *
     */
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
                post: {},
                get: {}
            }
        });
    }
    
    /* ---------------------------------------* 
     * Export the library to the global scope *
     * ---------------------------------------*/
    this[LIBRARYNAME] = {
        init: function(map){
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    config[key] = map[key];
                }
            }
            init();
        },
        api: function(method, data, fn){
        
        },
        on: addEventListener
    };
    /* ---------------------------------------* 
     * Add any external scripts that we need *
     * ---------------------------------------*/
    var PROTO = location.protocol;
    if (!("easyXDM" in this)) {
        document.write(decodeURIComponent('%3Cscript type="text/javascript" src="' + PROTO + '//easyxdm.net/current/easyXDM.min.js"%3E%3C/script%3E'));
    }
    if (!("JSON" in this)) {
        document.write(decodeURIComponent('%3Cscript type="text/javascript" src="' + PROTO + '//easyxdm.net/current/json2.js"%3E%3C/script%3E'));
    }
}(window, document /*, undefined*/));
