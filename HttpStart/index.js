const uuidv1 = require("uuid/v1");

module.exports = function (context, req) {
    const id = uuidv1();

    let keyword;
    if(req.query.keyword){
        keyword = req.query.keyword;
    } else {
        context.done(null, {
            status: 400,
            body: "No keyword provided"
        });
        return;
    }

    let startArgs = [{
        FunctionName: req.params.functionName,
        Input: keyword,
        InstanceId: id
    }];

    context.bindings.starter = startArgs;
    var locationUrl = "https://" + process.env.HOST + "/runtime/webhooks/DurableTaskExtension/instances/" + id + "?taskHub=" + process.env.HUB_NAME + "&connection=AZURE_STORAGE_CONNECTION_STRING&code=" + process.env.SYSTEM_KEY;
    context.done(null, {
        status: 202,
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            id: id,
            statusQueryGetUri: locationUrl
        }
    });
};