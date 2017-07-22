
const connection = require('../db');
const notFound = require('../utils/not-found');

module.exports = function issues(req, res) {
    const issues = connection.db.collection('issues');

    if (req.method === 'POST') {
        issues.insert(req.body)
            .then(result => result.ops[0])
            .then(saved => {
                res.end(JSON.stringify(saved));
            })
            .catch(console.log);
    }
    else if (req.method === 'GET' && req.url.path === '/issues') {
        issues.find({})
            .toArray()
            .then(issues => res.end(JSON.stringify(issues)))
            .catch(console.log);
    }
    else {
        notFound(req, res);
    }
};