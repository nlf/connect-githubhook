connect-githubhook
==================

This is a simple github post-receive hook implemented as connect middleware for integration with existing apps

```javascript
var express = require('express'),
    cgh = require('connect-githubhook'),
    sites = { '/supersecretpath': 'https://github.com/yourname/yourrepo' },
    app = express.createServer();

var handler = function (repo, payload) {
    console.log('received push from:', repo); // received push from: yourrepo
};

app.use(express.bodyParser()); //required
app.use(cgh(sites, handler));

app.listen(8000);
```

license
=======

MIT
