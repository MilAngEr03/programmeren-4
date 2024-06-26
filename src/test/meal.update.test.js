const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); 
const should = chai.should();

chai.use(chaiHttp);


describe('UC-302 Wijzigen van maaltijdsgegevens', () => {
    it('TC-302-1 Verplicht velden “name” en/of “price” en/of “maxAmountOfParticipants” ontbreken', (done) => {
      chai.request(server)
        .put('/api/meal/1')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUwLCJpYXQiOjE3MTk0MDI0MTQsImV4cCI6MTcyMDQzOTIxNH0.82ZuGg1BRGQ4_SZLWMHeZqDJ1CE2wGRSFzq5s1BwAe0') // Use a valid token
        .send({ name: 'Updated Meal' }) // Missing price and maxAmountOfParticipants fields
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.have.property('data').eql({});
          done();
        });
    });
  
    // Other test cases for UC-302
  });