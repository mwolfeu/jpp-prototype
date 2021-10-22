class awsBackend {
  constructor(cb) {
    this.config = {
      cognitoUI: "https://jppt.auth.us-east-1.amazoncognito.com/login?client_id=3clju7pon415t39vs36anap0a3&response_type=token&scope=email+openid+aws.cognito.signin.user.admin+profile+phone&redirect_uri=http://localhost:5500/jpp-aws-torture/index.html",
      baseUrl: "https://nrm5qc4mv3.execute-api.us-east-1.amazonaws.com/dev/v1",
      api: {
        byRegion: "POST"
      },
      cb: cb
    }
  }

  call(fcn, data) {
    let req = this.getReq(this.config.api[fcn], this.config.baseUrl + '/' + fcn);

    if (data)
      req.send(JSON.stringify(data));
    else
      req.send();
  }

  getReq(type, url) {
    let req = new XMLHttpRequest();

    let transferComplete = (function(evt) {
      let json = evt.target.response.length ? JSON.parse(evt.target.response) : { message: 'noResponse' };

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

    // if using Cognito Hosted UI w id_token
    let urlSearchParams = new URLSearchParams(window.location.hash);
    let params = Object.fromEntries(urlSearchParams.entries());

    // if (!("#id_token" in params)) // if not logged in
    //   window.location.href = this.cognitoHostedURL; // go to cognito hosted UI

    // TODO href also if request fails
    // list returns 404 if db empty

    // let id = params["#id_token"];

    // req.setRequestHeader("Authorization", id);
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