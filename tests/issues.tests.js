
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { assert } = chai;

const connection = require('../lib/db');
const url = 'mongodb://localhost:27017/issues-test';

const app = require('../lib/app');

describe('issues resource', () => {

    before(() => connection.connect(url));
    before(() => connection.db.dropDatabase());

    const request = chai.request(app);

    const issues = [
        {
            _id: '12345',
            company: 'ABC Company',
            contact: 'Samantha Bloom',
            issue_category: 'User Login',
            issue_title: 'Account locked due to failed login attempts',
            issue_sev: 'High',
            issue_status: 'Open',
            assigned_to: 'Brad Cooper'
        },
        {
            company: 'ABC Company',
            contact: 'Daren Hackenstack',
            issue_category: 'Workflow',
            issue_title: 'Project task does not route to task assignee',
            issue_sev: 'Medium',
            issue_status: 'Open',
            assigned_to: 'Brad Cooper'
        },
        {
            company: 'XYZ Company',
            contact: 'Tara Anderson',
            issue_category: 'Reports',
            issue_title: 'Unable to access all of my reports',
            issue_sev: 'Medium',
            issue_status: 'Open',
            assigned_to: 'Shannon Peterson'
        },
        {
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

        return Promise.all(issues.map((issue) => {
            return request.post('/issues')
                .send(issue)
                .then(res => {
                    let saved = res.body;
                    assert.ok(saved._id);
                    assert.equal(saved.company, issue.company);
                    assert.equal(saved.contact, issue.contact);
                });
        }));
    });

    it('returns all existing issues', () => {

        return request.get('/issues')
            .then(res => {
                let saved = res.body;
                assert.equal(saved.length, 4);
                assert.equal(saved[0].contact, issues[0].contact);
                assert.equal(saved[0].issue_title, issues[0].issue_title);
            });
    });

    it('returns requested issue by id', () => {
        return request.get('/issues/:id')
            .send({_id: '12345'})
            .then(res => {
                let results = res.body;
                assert.equal(results[0].contact, issues[0].contact);
            });
    });
});