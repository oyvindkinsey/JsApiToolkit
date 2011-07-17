/*global library, apply, hop, isHostMethod */
( function(library) {
    var on, un;
    if (isHostMethod(window, "addEventListener")) {
        on = function(target, type, listener) {
            target.addEventListener(type, listener, false);
        };
        un = function(target, type, listener, useCapture) {
            target.removeEventListener(type, listener, useCapture);
        };
    }
    else if (isHostMethod(window, "attachEvent")) {
        on = function(object, sEvent, fpNotify) {
            object.attachEvent("on" + sEvent, fpNotify);
        };
        un = function(object, sEvent, fpNotify) {
            object.detachEvent("on" + sEvent, fpNotify);
        };
    }
    else {
        throw new Error("Browser not supported");
    }

    function create(spec, parent) {
        var tag = spec.tag || "div";
        var el = document.createElement(tag);

        for (var key in spec) {
            if (hop.call(spec, key)) {
                switch (key) {
                    case "cls":
                        el.className = spec.cls;
                        break;
                    case "html":
                        el.innerHTML = spec.html;
                        break;
                    case "style":
                        apply(el.style, spec.style);
                        break;
                    case "listeners":
                        var events = spec[key];
                        for (var eventName in events) {
                            if (hop.call(events, eventName)) {
                                on(el, eventName, events[eventName]);
                            }
                        }
                        break;
                    default:
                        el[key] = spec[key];
                }
            }
        }
        if (parent) {
            parent.appendChild(el);
        }
        return el;
    }

    function getViewportSize() {
        if ("innerWidth" in window) {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
        if ("documentElement" in document && "clientWidth" in document.documentElement) {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
        }
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        };

    }

    function getSize(el) {
        if (!el) {
            return getViewportSize();
        }
        if ("offsetWidth" in el) {
            return {
                width: el.offsetWidth,
                height: el.offsetHeight
            };
        }
        return {
            width: el.clientWidth,
            height: el.clientHeight
        };
    }

    library.provide("dom", {
        on: on,
        un: un,
        create: create,
        getSize: getSize
    });

}(library));