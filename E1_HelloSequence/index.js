const df = require("durable-functions");

module.exports = df(function* (context) {
    context.log("Starting faq data generation");
    const keyword = context.df.getInput();
    var combinedResult = {};

    var results = yield context.df.callActivityAsync("DoCognitiveSearch", keyword); //Get the url's
    const output = [];
    if (results && Array.isArray(results) && results.length > 0) {

        const output = [];
        for (var count = 0; count < results.length; count++) {
            output.push(yield context.df.callActivityAsync("E1_SayHello", results[count].url));
            break;
        }
        var count = 0;
        output.forEach(element => {
            if (Array.isArray(element) && element.length > 0 && results[count]) {
                combinedResult[results[count].url] = element;
            }
            count++;
        });
    } else {
        combinedResult = results;
    }

    return combinedResult;
});