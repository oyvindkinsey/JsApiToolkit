var mode;
var getApiWindow = function() {
    var target, win, i = location.search.indexOf("target=");
    if (~i) {
        target = location.search.substring(i + 7);
    }
    if (window.opener) {
        // the document were opened using window.open
        mode = "popup"
        try {
            window.opener.api && (win = window.opener);
        } catch (e1) {
        }
        try {
            !win && window.opener.frames[target] && window.opener.frames[target].api && (win = window.opener.frames[target]);
        } catch (e2) {
        }
    }
    else {
        // the document were opened using an iframe
        mode = "iframe";
        win = window.parent.frames[target];
    }

    // memoize the result
    getApiWindow = function() {
        return win;
    }
    win.api.setWindow(window, mode);
    return win;
}
var api = getApiWindow().api;

var dialogEl = document.getElementById("dialog");
var width = dialogEl.clientWidth || dialogEl.offsetWidth || dialogEl.scrollWidth;
var height = dialogEl.clientHeight || dialogEl.offsetHeight || dialogEl.scrollHeight;

if (mode == "popup") {
    window.onunload = function() {
        api.hide(true);
    };
    window.resizeTo(width + 30, height + 80);
}
else {
    api.resize(width, height);
}