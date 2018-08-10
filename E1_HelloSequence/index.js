const df = require("durable-functions");

module.exports = df(function* (context) {
    context.log("Starting faq data generation");
    var combinedResult = {};

    var results = yield context.df.callActivityAsync("DoCognitiveSearch", "Acupuncturist"); //Get the url's

    if (results && Array.isArray(results) && results.length > 0) {

        const output = [];
        for (var count = 0; count < results.length; count++) {
            output.push(yield context.df.callActivityAsync("E1_SayHello", results[count].url));
            break;
        }

        output.forEach(element => {
            if (Array.isArray(element) && element.length > 0) {
                element.forEach(item => {
                    if (item.question && item.answer && !combinedResult[item.question]) {
                        combinedResult[item.question] = item.answer;
                    }
                });
            }
        });
    } else {
        combinedResult = results;
    }

    return combinedResult;
});