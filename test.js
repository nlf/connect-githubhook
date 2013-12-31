var express = require('express'),
    http = require('http'),
    app = express.createServer(),
    cgh = require('./index'),
    sites = {'/testPath': {url: 'https://github.com/nlf/connect-githubhook',
                           branch: 'master'}
            };

var handler = function (repo, payload) {
    console.log('received push for:', repo);
};

app.use(express.bodyParser());
app.use(cgh(sites, handler));

app.listen(8123);

var testData = {
    payload: {
        pusher: { name: 'nlf', email: 'nlf@andyet.net' },
        repository: {
            name: 'connect-githubhook',
            url: 'https://github.com/nlf/connect-githubhook',
            owner: { name: 'nlf', email: 'nlf@andyet.net' }
        },
        ref: 'refs/heads/master'
    }
};

var postOptions = {
    host: 'localhost',
    port: 8123,
    path: '/testPath',
    method: 'POST',
    headers: {
        'x-github-event': 'push',
        'Content-Type': 'application/json'
    }
};

var postReq = http.request(postOptions, function (res) {
    var buf = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        buf += chunk;
    });
    res.on('end', function () {
        console.log('response:', JSON.parse(buf));
        process.exit(0);
    });
});

postReq.write(JSON.stringify(testData), 'utf8');
postReq.end();
