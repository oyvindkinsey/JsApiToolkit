<script runat="server" Language="C#">
	
	void ReturnOK(string id, string response) {
		Response.Write("{\"jsonrpc\":\"2.0\", \"id\": \"" + id + "\", \"result\": " + response + "}");
		Response.End();
	}
	void ReturnError(string id, int errorCode, string message) {
		Response.Write("{\"jsonrpc\":\"2.0\", \"id\": \"" + id + "\", \"error\": \"" + 
			"{\"code\": " + errorCode + ", \"message\":\"" + message + "\"}}");
		Response.End();
	}
	private void Page_Load(object sender, System.EventArgs e) {
		Response.ContentType = "application/json";
		string method = Request.Form["method"], id = Request.Form["id"];
		switch (method) {
			case "feed.get":
				ReturnOK(id, "[\"aaaaa\",\"bbbbb\",\"cccccc\"]");
				return;
			case "auth.authenticate":
				// pretend we parsed the data and validated the credentials
				ReturnOK(id, "\"authenticated\"");
				return;
			default:
				ReturnError(id, 0, "unknown method");
				break;
		}	
	}
</script>