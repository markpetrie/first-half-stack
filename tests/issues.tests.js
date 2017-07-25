
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { assert } = chai;
const connect = require('../lib/db');
const url = 'mongodb://localhost:27017/issues-test';
const app = require('../lib/app');
const ObjectID = require('mongodb').ObjectID;
const request = chai.request(app);

describe('issues - POST, GET, PUT', () => {

    before(() => connect.connect(url));
    before(() => connect.db.dropDatabase());

    it('drops database prior to running tests', () => {
        return request.get('/issues')
            .then(res => {
                // console.log('res', res.body.length);
                assert.equal(res.body.length, 0);
            });
    });

    const issues = [
        {
            // _id: '597529252fb3f719fbebcc29',
            company: 'ABC Company',
            contact: 'Samantha Bloom',
            issue_category: 'User Login',
            issue_title: 'Account locked due to failed login attempts',
            issue_sev: 'High',
            issue_status: 'Open',
            assigned_to: 'Brad Cooper'
        },
        {
            // _id: '597585d0f9a5f12fda536296',
            company: 'ABC Company',
            contact: 'Daren Hackenstack',
            issue_category: 'Workflow',
            issue_title: 'Project task does not route to task assignee',
            issue_sev: 'Medium',
            issue_status: 'Open',
            assigned_to: 'Brad Cooper'
        },
        {
            // _id: '597585d0f9a5f12fda536297',
            company: 'XYZ Company',
            contact: 'Tara Anderson',
            issue_category: 'Reports',
            issue_title: 'Unable to access all of my reports',
            issue_sev: 'Medium',
            issue_status: 'Open',
            assigned_to: 'Shannon Peterson'
        },
        {
            // _id: '597585d0f9a5f12fda536298',
            company: 'XYZ Company',
            contact: 'Greg Montgomery',
            issue_category: 'Notifications',
            issue_title: 'Email reminders for past due tasks is not working',
            issue_sev: 'Medium',
            issue_status: 'Open',
            assigned_to: 'Shannon Peterson'
        }
    ];

    it('saves new issues', () => {
        return Promise.all(issues.map((issue, i) => {
            return request.post('/issues')
                .send(issue)
                .then(res => {
                    let saved = res.body;
                    assert.ok(saved._id);
                    assert.equal(saved.company, issue.company);
                    assert.equal(saved.contact, issue.contact);
                    issues[i] = saved;
                });
        }));
    });

    it('returns all issues', () => {
        return request.get('/issues')
            .then(res => {
                // console.log(res.body);
                let saved = res.body;
                // console.log(res.body);
                assert.equal(saved.length, 4);
                assert.equal(saved[0].contact, issues[2].contact);
                assert.equal(saved[0].issue_title, issues[2].issue_title);
            });
    });

    it('returns requested issue', () => {
        return request.get(`/issues/${issues[0]._id}`)
            // .send({ _id: '597529252fb3f719fbebcc29' })
            .then(res => {
                let results = res.body;
                console.log(results);
                // console.log(results);
                assert.equal(results.contact, issues[0].contact);
            });
    });



    it('updates desired issue', () => {
        // let putId = { _id: new ObjectID(issues[0]._id) };
        
        return request.put(`/issues/${ issues[0]._id }`)
            .send({
                company: 'ABC Company',
                contact: 'Samantha Bloom',
                issue_category: 'User Login',
                issue_title: 'Account locked due to failed login attempts',
                issue_sev: 'Open',
                issue_status: 'Closed',
                assigned_to: 'Brad Cooper'
            })
            .then(res => {
                let results = res.body;
                console.log('res.body: ', res.body);
                assert.equal(issues[0].issue_status, 'Closed');
            });
    });

    describe('issues - DEL', () => {

        it('deletes requested issue, responds with { removed: true } message', () => {
            return request.del('/issues/597529252fb3f719fbebcc29')
                .then(res => {
                    let results = res.body;
                    assert.deepEqual(results, { removed: true });
                });
        });

        it('returns 404 not found if requested document does not exist', () => {
            return request.get('/issues/597529252bb3f719fbebcc31')
                .then(
                    () => { throw new Error('Expected 404 error instead got 200'); },
                    err => assert.ok(err.response.notFound)
                );

        });

        it('returns { removed: false } message for requests to delete non-existent issues', () => {
            return request.del('/issues/597529252bb3f719fbebcc31')
                .then(res => {
                    let results = res.body;
                    assert.deepEqual(results, { removed: false });
                });
        });
    });
});