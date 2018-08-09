var fetch = require('node-fetch');

module.exports = function (context) {
    var cognitiveSearchUrl = "https://api.cognitive.microsoft.com/bing/v7.0/search?q=best " + context.bindings.name + " faq&cc=en-US&count=50";
    var subkey = '105881db99bf4f5582d430f96fa5e190';

    fetch(cognitiveSearchUrl, {
        method: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': subkey,
            'content-type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(json => {
            if (!json.error) {
                if (json.webPages.value) {
                    context.done(null, json.webPages.value);
                } else {
                    context.done(null, "Error doing cognitive search, No URL's retrieved.");
                }
            } else {
                throw json.error;
            }
        }).catch(error => {
            result = error;
        });
};