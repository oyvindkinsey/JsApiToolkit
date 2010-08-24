/*global library, apply, rpc, subscribe */
(function(library){

    library.css.register("ui-modal", {
        "frame": {
            position: "absolute",
            width: "400px",
            height: "300px",
            display: "none",
            border: "1px solid black"
        },
        "frame iframe": {
            border: "0",
            width: "100%",
            height: "100%"
        }
    });
    
    library.provide("ui", {
        Modal: function(config){
            var frame = document.createElement("div");
            frame.className = library.config.cssPrefix + "-ui-modal-frame";
            var iframe = document.createElement("iframe");
            iframe.frameBorder = 0; //IE
            iframe.src = config.url;
            document.body.appendChild(frame);
            frame.appendChild(iframe);
            return {
                show: function(){
                    frame.style.display = "block";
                },
                hide: function(){
                    frame.style.display = "none";
                }
            };
        },
        popup: function(title, url){
            if (library.config.useModal) {
                var win = new this.Modal({
                    title: title,
                    url: library.config.apiServerRoot + url + "?target=easyXDM_xyz_provider"
                });
                win.show();
            }
            else {
                // open the popup, as this is triggered by a user action, the blocker will allow it
                window.open("", "api_sign-in", "width=400, height=400");
                rpc.api("popup", {
                    url: url,
                    target: "api_sign-in"
                });
            }
        }
    });
    // subscribe to the 'authencitate' event so that we can give the user the option to sign in
    subscribe("auth.signin", function(){
        library.ui.popup("Sign in", "sign_in.html");
    });
}(library));
