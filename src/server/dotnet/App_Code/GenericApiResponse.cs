using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for GenericApiResponse
/// </summary>
public class GenericApiResponse<T> : ApiResponse
{
    public T data;
    public GenericApiResponse()
    {
    }
}