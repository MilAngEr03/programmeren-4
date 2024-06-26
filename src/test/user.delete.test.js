const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server'); // Adjust the path to your server file
const should = chai.should();

chai.use(chaiHttp);

describe('UC-206 Verwijderen van user', () => {
    it('TC-206-1 Gebruiker bestaat niet', (done) => {
      chai.request(server)
        .delete('/api/users/99999') // Non-existent user ID
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUwLCJpYXQiOjE3MTk0MDI0MTQsImV4cCI6MTcyMDQzOTIxNH0.82ZuGg1BRGQ4_SZLWMHeZqDJ1CE2wGRSFzq5s1BwAe0') // Use a valid token
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          res.body.should.have.property('data').eql({});
          done();
        });
    });
  
    // Other test cases for UC-206
  });