
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
    else if (req.method === 'GET' && req.url.path === '/issues/:id') {
        let id = req.body;
        issues.find(id)
            .toArray()
            .then(issue => (issue.length === 0) ? res.end(JSON.stringify(['404 not found'])) : res.end(JSON.stringify(issue)))
            .catch(console.log);
    }
    else if (req.method === 'DELETE' && req.url.path === '/issues/:id') {
        let id = req.body;
        issues.deleteOne(id)
            .then(temp => (temp.result.n === 1) ? temp.message = { removed: true } : temp.message = { removed: false })
            .then(message => res.end(JSON.stringify((message))))
            .catch(console.log);
    }
    else if (req.method === 'PUT' && req.url.path === '/issues/:id') {
        let document = req.body;
        issues.update({ _id: document._id }, {
            document
        })
            .then(updated => res.end(JSON.stringify((updated))))
            .catch(console.log);
    }
    else {
        notFound(req, res);
    }
};