const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index'); 
const should = chai.should();

chai.use(chaiHttp);

describe('UC-305 Verwijderen van maaltijd', () => {
    it('TC-305-1 Niet ingelogd', (done) => {
      chai.request(server)
        .delete('/api/meal/1')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.have.property('message');
          res.body.should.have.property('data').eql({});
          done();
        });
    });

  });