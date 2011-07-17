/*global library, apply, rpc, subscribe */

// requires("dom");

( function(library) {
    var dom = library.dom;
    var zIndex = 999;
    var shimEl, win, popup;

    library.css.register("ui-modal", {
        "shim": {
            position: "absolute",
            left: "0px",
            top: "0px",
            width: "100%",
            height: "100%",
            display: "none",
            "z-index": zIndex,
            opacity: "0.7",
            filter: "alpha(opacity=70)",
            "background-color": "black"
        },
        "frame": {
            position: "absolute",
            width: "400px",
            margin: "auto",
            display: "none",
            border: "1px solid black",
            "z-index": zIndex + 2,
            "background-color": "white"
        },
        "title": {
            "font-size": "16px",
            "font-weight": "bold"
        },
        "frame iframe": {
            border: "0",
            width: "100%",
            height: "300px"
        }
    });

    function ModalWindow(config) {
        var pub;
        var frameEl = dom.create({
            cls: library.config.cssPrefix + "-ui-modal-frame"
        }, document.body);
        var iframeEl = dom.create({
            tag: "iframe",
            frameBorder: 0 //IE
        }, frameEl);

        return (pub = {
                show: function(url) {
                    iframeEl.src = url;
                    //position

                    frameEl.style.display = "block";

                    var vpSize = dom.getSize(), winSize = dom.getSize(frameEl);
                    apply(frameEl.style, {
                        left: ((vpSize.width - winSize.width) / 2) + "px",
                        top: ((vpSize.height - winSize.height) / 2) + "px"
                    });
                },
                hide: function() {
                    frameEl.style.display = "none";
                },
                resize: function(width, height) {
                    frameEl.style.width = width + "px";
                    frameEl.style.height = height + "px";
                }
            });
    }

    /*********************/
    function hide() {
        if (win) {
            win.hide();
        }
        else if (popup) {
            try {
                popup.close();
            } catch (e1) {
            }
        }
    }

    library.provide("ui", {
        popup: function(url) {
            if (!shimEl) {
                shimEl = dom.create({
                    cls: library.config.cssPrefix + "-ui-modal-shim"
                }, document.body);
            }

            shimEl.style.display = "block";
            url = library.config.apiServerRoot + url + "?target=easyXDM_" + library.name + "_xyz_provider";
            if (library.config.useModal) {
                if (!win) {
                    win = new ModalWindow();
                }
                win.show(url);
            }
            else {
                // open the popup, as this is triggered by a user action, the blocker will allow it
                popup = window.open(url, library.config.name + "_popup", "width=400, height=400");
            }
        }
    });

    subscribe("ui.hide", function(notifyOnly) {
        shimEl.style.display = "none";
        if (!notifyOnly) {
            hide();
        }
    });
    subscribe("ui.resize", function(box) {
        // the resize is only handled here for modal dialogs
        if (win) {
            win.resize(box.width, box.height);
        }
    });
}(library));