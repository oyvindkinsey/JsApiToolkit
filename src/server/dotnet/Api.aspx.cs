using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.Services;

public partial class Api : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        ClientScript.RegisterClientScriptBlock(this.GetType(), "server",
            "server.signed_in = " + User.Identity.IsAuthenticated.ToString().ToLower() + ";",
            true);
    }

    [WebMethod]
    public static ApiResponse SignIn(String appKey, String username, String password)
    {
        ApiResponse apiResponse = new ApiResponse();
        if (username=="username" && password=="password")
        {
            apiResponse.status = "ok";
            System.Web.Security.FormsAuthentication.SetAuthCookie(username, false);
        }
        return apiResponse;
    }
	
    [WebMethod]
    public static ApiResponse SignOut(String appKey)
    {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.status = "ok";
        System.Web.Security.FormsAuthentication.SignOut();
        return apiResponse;
    }

    [WebMethod]
    public static GenericApiResponse<Feed> GetFeed(String appKey)
    {
        GenericApiResponse<Feed> apiResponse = new GenericApiResponse<Feed>();
        if (HttpContext.Current.User.Identity.IsAuthenticated)
        {
            apiResponse.status = "ok";
            apiResponse.data = new Feed() { Items = new String[3] { "item1", "item2", "item3" } };
        }
        return apiResponse;
    }
}