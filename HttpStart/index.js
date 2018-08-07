const uuidv1 = require("uuid/v1");

module.exports = function (context, req) {
    const id = uuidv1();

    let startArgs = [{
        FunctionName: req.params.functionName,
        Input: req.body,
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