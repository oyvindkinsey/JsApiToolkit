<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Api.aspx.cs" Inherits="Api" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <title>API</title>
    <script type="text/javascript" src="../../../lib/easyXDM.min.js">
    </script>
    <script type="text/javascript">
        easyXDM.DomHelper.requiresJSON("../../../lib/json2.min.js");

        var server = {
            invoke: function (appKey, methodName, args, fn) {
                console.log(methodName);
                switch (methodName) {
                    case "sign-in":
                        PageMethods.SignIn(appKey, args.username, args.password, fn);
                        break;
                    case "sign-out":
                        PageMethods.SignOut(appKey, fn);
                        break;
                    case "feed.get":
                        PageMethods.GetFeed(appKey, fn);
                        break;
                }
            }
        };
    </script>
    <script type="text/javascript" src="../api.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <asp:ScriptManager runat="server" EnablePageMethods="true" />
    </form>
</body>
</html>
