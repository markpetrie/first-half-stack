
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { assert } = chai;

const connection = require('../lib/db');
const url = 'mongodb://localhost:27017/support-test';

const app = require('../lib/app');

describe('support resource', () => {

    before(() => connection.connect(url));
    before(() => connection.db.dropDatabase());

    const request = chai.request(app);

    it('saves', () => {
        const issue = {
            company: 'ABC Company',
            contact: 'Samantha Bloom',
            issue_category: 'User Login',
            issue_title: 'Account locked due to failed login attempts',
            issue_sev: 'High',
            issue_status: 'Open',
            assigned_to: 'Brad Cooper'
        };
        return request.post('/support')
            .send(issue)
            .then(res => {
                const saved = res.body;
                assert.ok(saved._id);
                assert.equal(saved.company, issue.company);
                assert.equal(saved.contact, issue.contact);
            });
    });
});