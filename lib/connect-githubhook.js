/*global module*/
var cgh = function (sites, callback) {
    var self = this;
    self.callback = callback;
    self.sites = sites;
    function getPayload(req) {
        var payload = req.body;
        if (typeof req.body.payload === 'string') {
            payload = JSON.parse(req.body.payload);
        } else if (typeof req.body.payload === 'object') {
            payload = req.body.payload;
        }
        return payload;
    }
    return function cgh(req, res, next) {
        if (!req.body || req.method !== 'POST') {
            return next();
        }
        if (Object.keys(self.sites).indexOf(req.url) === -1 ||
            req.header('x-github-event') !== 'push') {
            return next();
        }
        var payload = getPayload(req);
        var site_data = self.sites[req.url],
            site_url = site_data.url,
            site_branch = site_data.branch;
        if (payload.repository.url === site_url &&
            (!site_branch || payload.ref.indexOf(site_branch) != -1)) {
            res.send({ result: 'ok' }, 200);
            callback(payload.repository.name, payload);            
        } else {
            return next();
        }
    }
};

module.exports = cgh;
