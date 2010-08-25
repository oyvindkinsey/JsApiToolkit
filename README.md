JsApiToolkit
============

JsApiToolkit is project which seeks to provide a platform for building feature-rich
JavaScript API's similar to e.g. Facebook Connect.

The base implementation provides Cross-Document Messaging, user interaction and basic authentication support, and is completely event driven using a pub/sub model.

You can easily configure the core library, set its export name, and provide custom modules so that it matches your need.

You can see a demo of the base API [here][1].

How it works
============
JsApiToolkit provides both a server and a client component.  
It is built around a generic model supporting the use of an <code>appKey</code> to identify the *consumer*, and it also supports the notion of end-user authentication, both as something happening prior to the API being activated, and as an action that can be triggered on demand.

Essential to the architecture of the API is the **Cross Document Messaging** link used to communicate between the two domains. This allows state-aware communication between the two separate documents (client <> server) instead of having to resort to JSONP (client > server > client).  
JsApiToolkit is based on [easyXDM][2] and so do not need any additional files uploaded to the *consumer* in order to provide fast communication. 

Server
------
The server component is a HTML document, which is to be hosted on the domain from where you want to expose your services.
You are free to decide how to connect this with your back-end as long as the document is not navigated.
Client
------
The client is the main library that your users will include on their sites. This will in turn *connect* to the server in order to provider state-aware communication between the *consuming* document and your *providing* server.  The client exposes the base functionality as well as any additional modules added.

How to get started
==================
* Modify main configuration in <code>/src/client/core.js</code> so that it reflects the desired name and location of the server components.  
* If necessary, modify the XDM api. The base implementation expose a generic <code>api</code> method on the server, and a <code>publish</code> method on the client for event notifying.
* Add your custom modules to <code>/src/client/modules/</code> following the pattern used in the existing modules.
* Build the client library using <code>ant build</code>.
* Deploy! :)

Note that this is a work in progress.
License
-------
This is provided under the MIT license

Author
------
Øyvind Sean Kinsey <oyvind@kinsey.no> - http://kinsey.no/


  [1]: http://kinsey.no/projects/jsapitoolkit/src/test/
  [2]: http://easyxdm.net/