const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('UC-303 Opvragen van alle maaltijden', () => {
    it('TC-303-1 Lijst van maaltijden geretourneerd', (done) => {
      chai.request(server)
        .get('/api/meal')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.should.have.property('data').that.is.an('array');
          done();
        });
    });
  });