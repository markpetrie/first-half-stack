
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;
const connect = require('./db');

app.use(bodyParser.json());
// const connection = require('../db');
// const notFound = require('../utils/not-found');
const publicDir = path.resolve(__dirname, '../public');

app.use(express.static(publicDir));

// module.exports = function issues(req, res) {

app.post('/issues', (req, res) => {
    const issues = connect.db.collection('issues');
    issues.insert(req.body)
        .then(res => res.ops[0])
        .then(issue => res.send(issue))
        .catch(console.log);
});

app.get('/issues', (req, res) => {
    const issues = connect.db.collection('issues');
    const query = {};

    if (req.query._id) query._id = req.query._id;
    if (req.query.issue_status) query.issue_status = req.query.issue_status;

    issues.find(query).toArray()
        .then(issues => res.send(issues))
        .catch(console.log);
});

app.get('/issues/:id', (req, res) => {

    const issues = connect.db.collection('issues');
    issues.findOne({ _id: new ObjectID(req.params.id) })
        .then(({ result }) => res.send({ removed: result.n === 1 }))
        .catch(console.log);
});

app.delete('/issues/:id', (req, res) => {
    const issues = connect.db.collection('issues');
    issues.removeOne({ _id: new ObjectID(req.params.id) })
        .then(({ result }) => res.send({ removed: result.n === 1 }))
        .catch(console.log);
});

app.put('/issues/:id', (req, res) => {
    const issues = connect.db.collection('issues');
    issues.update({ _id: new ObjectID(req.params.id) })
        .then(res => res.ops[0])
        .then(issue => res.send(issue))
        .catch(console.log);

});

module.exports = app;