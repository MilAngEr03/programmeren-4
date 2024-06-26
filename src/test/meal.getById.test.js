const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('UC-304 Opvragen van maaltijd bij ID', () => {
    it('TC-304-1 Maaltijd bestaat niet', (done) => {
      chai.request(server)
        .get('/api/meal/99999') // Non-existent meal ID
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('message');
          res.body.should.have.property('data').eql({});
          done();
        });
    });
  
    // Other test cases for UC-304
  });