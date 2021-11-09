class awsBackend {
  constructor(cb, requireID) {
    this.config = {
      cognitoUI: "https://jppt.auth.us-east-1.amazoncognito.com/login?client_id=23id7lt20cmgf4v05vk1ih0h7l&response_type=token&scope=email+openid&redirect_uri=http://localhost:5500/jpp-prototype/html/survey.html",
      baseUrl: "https://4z4ntfa3oi.execute-api.us-east-1.amazonaws.com/dev/v1",
      api: {
        byRegion: { path: "byRegion", type: "POST" },
        submitSurvey: { path: "submitSurvey", type: "POST" },
        create: { path: "incident", type: "POST" },
      },
      cb: cb
    }

    if (requireID) {
      // if using Cognito Hosted UI w id_token
      let urlSearchParams = new URLSearchParams(window.location.hash);
      let params = Object.fromEntries(urlSearchParams.entries());
      // TODO href also if request fails
      // list returns 404 if db empty

      if ("#id_token" in params) // if not logged in
        this.id = params["#id_token"];
      else
        window.location.href = this.config.cognitoUI; // go to cognito hosted UI
    }
  }

  call(fcn, data, params) {
    let pathParams = "";
    if (Array.isArray(params))
      pathParams = "/" + params.join("/");
    if (typeof params == "string")
      pathParams = "/" + params

    let req = this.getReq(this.config.api[fcn].type, this.config.baseUrl + '/' + this.config.api[fcn].path + pathParams);

    if (data)
      req.send(JSON.stringify(data));
    else
      req.send();
  }

  getReq(type, url) {
    let req = new XMLHttpRequest();

    let transferComplete = (function(evt) {
      let json = evt.target.response.length ? JSON.parse(evt.target.response) : { message: 'noResponse' };

      // HANDLE:
      // {message: "The incoming token has expired"}

      if (json.input) {
        let rc = json.input.requestContext;
        let call = json.input.path.split('/').pop();
        let cb = this.config.cb[call][rc.httpMethod];
        if (cb)
          cb(json);
      }

      console.log("The transfer is complete.", json);
    }).bind(this);

    req.addEventListener("progress", this.updateProgress);
    req.addEventListener("load", transferComplete);
    req.addEventListener("error", this.transferFailed);
    req.addEventListener("abort", this.transferCanceled);

    req.open(type, url);

    if (this.id) req.setRequestHeader("Authorization", this.id);
    //req.setRequestHeader("Access-Control-Allow-Origin", "*");
    return req;
  }

  // progress on transfers from the server to the client (downloads)
  updateProgress(oEvent) {
    if (oEvent.lengthComputable) {
      var percentComplete = oEvent.loaded / oEvent.total * 100;
      // ...
    } else {
      // Unable to compute progress information since the total size is unknown
    }
  }

  transferFailed(evt) {
    console.log("An error occurred while transferring the file.");
  }

  transferCanceled(evt) {
    console.log("The transfer has been canceled by the user.");
  }
}

export { awsBackend as default }