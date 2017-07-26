
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const connect = require('./db');

app.use(bodyParser.json());

const publicDir = path.resolve(__dirname, '../public');

app.use(express.static(publicDir));

app.post('/issues', (req, res) => {
    const issues = connect.db.collection('issues');
    issues.insert(req.body)
        .then(result => result.ops[0])
        .then(issue => res.send(issue))
        .catch(console.log);
});

app.get('/issues', (req, res) => {
    const issues = connect.db.collection('issues');
    const query = {};

    if (req.query._id) query._id = req.query._id;
    if (req.query.issue_status) query.issue_status = req.query.issue_status;

    issues.find(query).toArray()
        .then(results => res.send(results))
        .catch(console.log);
});

app.get('/issues/:id', (req, res) => {
    // console.log('req.params: ', req.params);
    const Issues = connect.db.collection('issues');
    Issues.findOne({ _id: new ObjectID(req.params.id) })
        
        .then((result) => {
            result ? res.send(result) : res.status(404).send('not found');
        })
        .catch(console.log);
});

app.delete('/issues/:id', (req, res) => {
    const Issues = connect.db.collection('issues');
    Issues.removeOne({ _id: new ObjectID(req.params.id) })
        // .then((result) => console.log(JSON.stringify(result)))
        .then(({ result }) => res.send({ removed: result.n === 1 }))
        .catch(console.log);
});

app.put('/issues/:id', (req, res) => {
    const Issues = connect.db.collection('issues');
    Issues.findOneAndUpdate({ _id: new ObjectID(req.params.id) }, req.body, { returnOriginal: false })
        .then(issue => res.send(issue.value))
        .catch(console.log);

});

module.exports = app;