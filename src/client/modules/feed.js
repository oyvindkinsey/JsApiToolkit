/*global library, rpc, subscribe, JSON */
(function(library){
    library.provide("feed", {
        init: function(){
            this.elements = [];
            var that = this;
            subscribe("auth.change", function(signed_in){
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
                        feedEl.innerHTML = '<input type="button" onclick="' + library.name + '.api(\'sign-in\')" value="Sign In"/>';
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
}(library));
