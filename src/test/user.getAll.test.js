const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../index');
const should = chai.should();

chai.use(chaiHttp);

describe('UC-202 Opvragen van overzicht van users', () => {
    it('TC-202-1 Toon alle gebruikers (minimaal 2)', (done) => {
      chai.request(server)
        .get('/api/user')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.should.have.property('data').that.is.an('array').with.lengthOf.at.least(2);
          done();
        });
    });
  
});
