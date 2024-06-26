const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('UC-301 Toevoegen van maaltijd', () => {
    it('TC-301-1 Verplicht veld ontbreekt', (done) => {
      chai.request(server)
        .post('/api/meal')
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUwLCJpYXQiOjE3MTk0MDI0MTQsImV4cCI6MTcyMDQzOTIxNH0.82ZuGg1BRGQ4_SZLWMHeZqDJ1CE2wGRSFzq5s1BwAe0') // Use a valid token
        .send({ name: 'Pasta', price: 10 }) // Missing required fields
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.should.have.property('data').eql({});
          done();
        });
    });
  
  });