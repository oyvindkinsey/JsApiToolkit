/*globals easyXDM, JSON, server */
/**
 * This file is implementation agnostic and handles all the server interaction over to an object called
 * server, with a method [invoke].
 * Currently only a dotnet implementation is included.
 */
var popup;
var serverRoot = location.href.substring(0, location.href.lastIndexOf("/") + 1);

var handlers = {};
var rpcId = 0;
var rpc = new easyXDM.Rpc({
    sfw: "name.html"
}, {
    local: {
        api: function(methodName, args, fn) {
            if (methodName in handlers) {
                // this is handled locally
                return handlers[methodName](args, fn);
            }
            else {
                // this must be handled on the server
                server.invoke(server.appKey, methodName, args, fn);
            }
        }
    },
    remote: {
        publish: {},
        closeUI: {}
    }
});

server.appKey = easyXDM.query.appKey || "";

//to be called from the popup
window.api = {
    setWindow: function(win, mode) {
        this._mode = mode;
        this._win = win;
    },
    hide: function(notifyOnly) {
        if (this._mode =="iframe") {
            rpc.closeUI(false);
        }
        else {
            rpc.closeUI(true);
            if (!notifyOnly) {
                this._win.close();
            }
        }
    },
    resize: function(width, height) {
        rpc.publish("ui.resize", {
            width:width,
            height:height
        });
    },
    auth: function(data, fn) {
        server.invoke(server.appKey, "sign-in", data, function(response) {
            if (response.status == "ok") {
                fn(true);
                server.signed_in = true;
                rpc.publish("auth.change", true);
            }
            else {
                fn(false);
            }
        });
    },
    invoke: function(method, data, fn) {
        server.invoke(server.appKey, method, data, fn);
    }
};

easyXDM.whenReady( function() {
    rpc.publish("auth.change", server.signed_in);
});