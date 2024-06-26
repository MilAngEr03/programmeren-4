const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('UC-204 Opvragen van usergegevens bij ID', () => {
    it('TC-204-1 Ongeldig token', (done) => {
      chai.request(server)
        .get('/api/user/1')
        .set('Authorization', 'Bearer invalidtoken')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          res.body.should.have.property('data').eql({});
          done();
        });
    });
  
    it('TC-204-2 Gebruiker-ID bestaat niet', (done) => {
      chai.request(server)
        .get('/api/users/99999') // Non-existent user ID
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUwLCJpYXQiOjE3MTk0MDI0MTQsImV4cCI6MTcyMDQzOTIxNH0.82ZuGg1BRGQ4_SZLWMHeZqDJ1CE2wGRSFzq5s1BwAe0')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          res.body.should.have.property('data').eql({});
          done();
        });
    });
  
    it('TC-204-3 Gebruiker-ID bestaat', (done) => {
      chai.request(server)
        .get('/api/users/1') // Existing user ID
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUwLCJpYXQiOjE3MTk0MDI0MTQsImV4cCI6MTcyMDQzOTIxNH0.82ZuGg1BRGQ4_SZLWMHeZqDJ1CE2wGRSFzq5s1BwAe0')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.should.have.property('data').that.includes.keys('user');
          done();
        });
    });
  });