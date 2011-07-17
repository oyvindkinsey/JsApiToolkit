//hook up events

// subscribe to the auth events
subscribe("auth.signin", function() {
    library.ui.popup("../example/sign_in.html");
});
subscribe("auth.signout", function() {
    rpc.api("sign-out", null, function() {
        publish("auth.change", false);
    });
})