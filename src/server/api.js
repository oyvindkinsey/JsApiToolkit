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
    local: "name.html"
}, {
    local: {
        api: function(methodName, args, fn){
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
        publish: {}
    }
});

server.appKey = easyXDM.query.appKey || "";
easyXDM.whenReady(function(){
    rpc.publish("auth.change", server.signed_in);
});

//to be called from the popup	
function signIn(username, password, fn){
    server.invoke(server.appKey, "sign-in", {
        username: username,
        password: password
    }, function(response){
        if (response.status == "ok") {
            fn(true);
            server.signed_in = true;
            rpc.publish("auth.change", true);
        }
        else {
            fn(false);
        }
    });
}
