
const connect = require('../lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { assert } = chai;
const url = 'mongodb://localhost:27017/issues-test';
const app = require('../lib/app');
const request = chai.request(app);

const staticIssues = [
    {
        company: 'ABC Company',
        contact: 'Samantha Bloom',
        category: 'User Login',
        title: 'Account locked due to failed login attempts',
        severity: 'High',
        status: 'Open',
        assignee: 'Brad Cooper'
    },
    {
        company: 'ABC Company',
        contact: 'Daren Hackenstack',
        category: 'Workflow',
        title: 'Project task does not route to task assignee',
        severity: 'Medium',
        status: 'Open',
        assignee: 'Brad Cooper'
    },
    {
        company: 'XYZ Company',
        contact: 'Tara Anderson',
        category: 'Reports',
        title: 'Unable to access all of my reports',
        severity: 'Medium',
        status: 'Open',
        assignee: 'Shannon Peterson'
    },
    {
        company: 'XYZ Company',
        contact: 'Greg Montgomery',
        category: 'Notifications',
        title: 'Email reminders for past due tasks is not working',
        severity: 'Medium',
        status: 'Open',
        assignee: 'Shannon Peterson'
    }
];

before(() => connect.connect(url));
before(() => connect.db.dropDatabase());

describe('issues -', () => {
    it('saves new issues', () => {

        return Promise.all(staticIssues.map((issue, i) => {
            return request.post('/issues')
                .send(issue)
                .then(res => {
                    let saved = res.body;
                    assert.ok(saved._id);
                    assert.equal(saved.company, issue.company);
                    assert.equal(saved.contact, issue.contact);
                    staticIssues[i] = saved;
                });
        }));
    });
});

describe('issues -', () => {
    it('returns all issues', () => {
        return request.get('/issues')
            .then(res => {
                let saved = res.body;
                assert.equal(saved.length, 4);
                assert.equal(saved[0].contact, staticIssues[0].contact);
                assert.equal(saved[0].title, staticIssues[0].title);
            });
    });
});

describe('issues -', () => {
    it('returns requested issue', () => {
        return request.get(`/issues/${staticIssues[0]._id}`)
            .then(res => {
                let results = res.body;
                assert.equal(results.contact, staticIssues[0].contact);
            });
    });
});

describe('issues -', () => {
    it('updates desired issue', () => {
        return request.put(`/issues/${staticIssues[0]._id}`)
            .send({
                company: 'ABC Company',
                contact: 'Samantha Bloom',
                category: 'User Login',
                title: 'Account locked due to failed login attempts',
                sev: 'Open',
                status: 'Closed',
                assigned_to: 'Brad Cooper'
            })
            .then(res => {
                let results = res.body;
                assert.equal(results.status, 'Closed');
            });
    });
});

describe('issues -', () => {

    it('deletes requested issue, responds with { removed: true } message', () => {
        return request.del(`/issues/${staticIssues[0]._id}`)
            .then(res => {
                let results = res.body;
                assert.deepEqual(results, { removed: true });
            });
    });
});

describe('issues -', () => {
    
    it('attempts to delete non-existent issue and responds with { removed: false } message', () => {
        return request.del(`/issues/${staticIssues[0]._id}`)
            .then(res => {
                let results = res.body;
                assert.deepEqual(results, { removed: false });
            });
    });
});

describe('issues -', () => {
    it('returns requested issues based on status query', () =>{
        return request.get('/issues?status=Open')
            .then(res => {
                let result = res.body[0];
                assert.equal(result.status, 'Open');
            });
    });
});

describe('issues -', () => {
    it('returns requested issues based on severity query', () => {
        return request.get('/issues?severity=Medium')
            .then(res => {
                let result = res.body[0];
                assert.equal(result.severity, 'Medium');
            });
    });
});

describe('issues -', () => {
    it('adds related articles to an existing issue', () => {
        let issueArticles = { articles: ['KB Article 1', 'KB Article 2', 'KB Article 3'] };

        return request.post(`/issues/${staticIssues[1]._id}/articles`).send(issueArticles)
            .then(res => {
                assert.deepEqual(res.body.articles, issueArticles.articles);
            });
    });
});

describe('issues -', () => {
    it('deletes a child article from an existing issue', () => {
        let articleToRemove = { articles: 'KB Article 3' };

        return request.delete(`/issues/${staticIssues[1]._id}/articles`).send(articleToRemove)
            .then(res => {
                assert.deepEqual(res.body.articles, ['KB Article 1', 'KB Article 2']);
            });
    });
});

describe('issues -', () => {
    it('returns 404 not found if requested document does not exist', () => {
        return request.get('/issues/597585d0f9a5f12fda536296')
            .then(
                () => { throw new Error('Expected 404 error instead got 200'); },
                err => {
                    assert.equal(err.response.error.text, 'not found');
                }
            );
    });
});