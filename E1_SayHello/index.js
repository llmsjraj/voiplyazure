var TSV = require('tsv');
var fetch = require('node-fetch');
const uuidv4 = require('uuid/v4');

module.exports = function(context) {
    context.log('JavaScript Execution.');
    var subkey = '08b0c7bd06ef4decb9cb76f37d3a52cf';
    var urls = null;

    if (context.bindings.url) {
        urls = [context.bindings.url];
    } else {
        context.done(null,"No urls provided. ");
        return;
    }

    var createKBUrl = "https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/create";

    fetch(createKBUrl, {
            method: 'POST',
            body: JSON.stringify({
                name: "voiply QnA maker",
                urls: urls
            }),
            headers: {
                'Ocp-Apim-Subscription-Key': subkey,
                'content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(json => {

            if (!json.error) {
                let kbId = json.kbId;
                context.log("Recieved knowledge base id : " + json.kbId);
                let SSAUrl = "https://westus.api.cognitive.microsoft.com/qnamaker/v2.0/knowledgebases/" + kbId;
                return SSAUrl;

            } else {
                throw json.error;
            }
        }).then(SSAUrl => fetch(SSAUrl, {
            method: 'GET',
            body: null,
            headers: {
                'Ocp-Apim-Subscription-Key': subkey
            }
        }))
        .then(res => res.json())
        .then(json => {

            if (!json.error) {
                var tsvFileURL = json;
                context.log("Recieved TSV file url. ");
                return tsvFileURL;
            }
        })
        .then(tsvFileURL => fetch(tsvFileURL, {
            method: 'GET'
        }))
        .then(res => res.text())
        .then((response) => {
            if (response) {


                let data = TSV.parse(response);

                context.log("Parsing TSV file. ");
                let items = [];

                for (let i = 0; i < data.length; i++) {


                    if ((data[i]['﻿Question'] || data[i]['Question']) && data[i]['Answer'] && data[i]['Source']) {

                        let qKey = 'Question';
                        if (data[i]['﻿Question']) {
                            qKey = '﻿Question';
                        }


                        data[i][qKey] = data[i][qKey].replace(/\\n/g, "").trim();
                        data[i]['Answer'] = data[i]['Answer'].replace(/\\n/g, "").trim();



                        var itemDescriptor = {
                            question: data[i][qKey],
                            answer: data[i]['Answer']
                        };
                        if (itemDescriptor.question !== "Hi") {
                            items.push(itemDescriptor);
                        }

                    }
                }

                context.done(null, items);
            }
        }).catch(error => {
            context.done(null, error.message);
        });

};