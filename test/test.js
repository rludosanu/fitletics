var Sequelize = require('sequelize');
var config = require('./../config/index');
var sequelize = new Sequelize(config.database);
var chai = require('chai');
var chaiHttp = require('chai-http');
var mocha = require('mocha');
var api = {
  user: `http://${config.server.host}:${config.server.port}/api/user`
};
var endpoints = {
  user: {
    signup: api.user + '/signup',
    signin: api.user + '/signin',
    updateProfile: api.user + '/update/profile',
    updatePassword: api.user + '/update/password',
    resetPassword: api.user + '/reset/password',
    read: api.user + '/read',
    activate: api.user + '/activate',
    deactivate: api.user + '/deactivate'
  }
}
var userdatas = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  active: false,
  activationToken: null
};
var activationToken = null;
var sessionToken = null;

chai.use(chaiHttp);

/*******************************************************************************
**
** User API
**
*******************************************************************************/
describe('User API', function() {
  var token = null;

  /*
  ** Sign up
  */
  describe('Sign up', function() {
    before(function(done) {
      sequelize.query('DELETE FROM users')
      .then(() => done())
      .catch(error => done(error));
    });

    it('should return a 400 Bad Request (Empty datas)', function(done) {
      chai.request(endpoints.user.signup)
      .post('/')
      .end(function(err, res) {
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 400 Bad Request (Multiple datas format error)', function(done) {
      chai.request(endpoints.user.signup)
      .post('/')
      .send({
        firstName: '',
        lastName: 'Ludosanu',
        username: 'rludosanu',
        email: 'r.ludosanu',
        password: 'luu',
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 200 OK (Valid datas)', function(done) {
      chai.request(endpoints.user.signup)
      .post('/')
      .send({
        firstName: 'Razvan',
        lastName: 'Ludosanu',
        username: 'rludosanu',
        email: 'r.ludosanu@gmail.com',
        password: 'ludosanu',
      })
      .end(function(err, res) {
        // Activation token
        activationToken = res.body;

        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 500 Internal Server Error (Duplicate username)', function(done) {
      chai.request(endpoints.user.signup)
      .post('/')
      .send({
        firstName: 'Razvan',
        lastName: 'Ludosanu',
        username: 'rludosanu',
        email: 'r.ludosanu@live.fr',
        password: 'ludosanu',
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(500);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 500 Internal Server Error (Duplicate email)', function(done) {
      chai.request(endpoints.user.signup)
      .post('/')
      .send({
        firstName: 'Razvan',
        lastName: 'Ludosanu',
        username: 'rludosanu_1',
        email: 'r.ludosanu@gmail.com',
        password: 'ludosanu',
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(500);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });
  });

  /*
  ** Activate
  */
  describe('Activate', function() {
    it('should return a 400 Bad Request (Empty datas)', function(done) {
      chai.request(endpoints.user.activate)
      .put('/')
      .end(function(err, res) {
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 400 Bad Request (Token format error)', function(done) {
      chai.request(endpoints.user.activate)
      .put('/')
      .send({
        token: 123456
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 404 Not Found (Invalid token)', function(done) {
      chai.request(endpoints.user.activate)
      .put('/')
      .send({
        token: 'abcdef123456'
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(404);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 200 OK (Valid token)', function(done) {
      chai.request(endpoints.user.activate)
      .put('/')
      .send({
        token: activationToken
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });
  });

  /*
  ** Sign in
  */
  describe('Sign in', function() {
    it('should return a 400 Bad Request (Empty datas)', function(done) {
      chai.request(endpoints.user.signin)
      .post('/')
      .end(function(err, res) {
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 400 Bad Request (Multiple datas format error)', function(done) {
      chai.request(endpoints.user.signin)
      .post('/')
      .send({
        username: '',
        password: 'test',
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    /*
    **
    ** ADD A TEST HERE IF ACCOUNT IS NOT ACTIVE
    **
    */

    it('should return a 404 Not Found (Invalid username)', function(done) {
      chai.request(endpoints.user.signin)
      .post('/')
      .send({
        username: 'rludosanu_1',
        password: 'ludosanu',
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(404);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 403 Forbidden (Invalid password)', function(done) {
      chai.request(endpoints.user.signin)
      .post('/')
      .send({
        username: 'rludosanu',
        password: 'testest',
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(403);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 200 OK (Valid datas)', function(done) {
      chai.request(endpoints.user.signin)
      .post('/')
      .send({
        username: 'rludosanu',
        password: 'ludosanu',
      })
      .end(function(err, res) {
        // Activation token
        sessionToken = res.body;

        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });
  });

  /*
  ** Read Profile
  */
  describe('Read Profile', function() {
    it('should return a 400 (Missing cookie)', function(done) {
      chai.request(endpoints.user.read)
      .post('/')
      .end(function(err, res) {
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 400 (Empty cookie)', function(done) {
      chai.request(endpoints.user.read)
      .post('/')
      .set('Cookie', 'token=')
      .end(function(err, res) {
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 500 (Cookie decryption error)', function(done) {
      chai.request(endpoints.user.read)
      .post('/')
      .set('Cookie', 'token=abcdef123456')
      .end(function(err, res) {
        chai.expect(res.status).to.equal(500);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 200 OK (User object)', function(done) {
      chai.request(endpoints.user.read)
      .post('/')
      .set('Cookie', 'token=' + sessionToken)
      .end(function(err, res) {
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.be.an('object');
        done();
      });
    });
  });

  /*
  ** Update Profile
  */
  describe('Update Profile', function() {
    it('should return a 400 Bad Request  (No datas provided)', function(done) {
      chai.request(endpoints.user.updateProfile)
      .put('/')
      .end(function(err, res) {
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 400 Bad Request  (No cookie)', function(done) {
      chai.request(endpoints.user.updateProfile)
      .put('/')
      .send({
        firstName: 'Razvan',
        lastName: 'Ludosanu',
        username: 'rludosanu',
        email: 'r.ludosanu@gmail.com',
        password: 'ludosanu'
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 500 Internal Server Error (Invalid cookie)', function(done) {
      chai.request(endpoints.user.updateProfile)
      .put('/')
      .set('Cookie', 'token=abcdef123456')
      .send({
        firstName: 'Razvan',
        lastName: 'Ludosanu',
        username: 'rludosanu',
        email: 'r.ludosanu@gmail.com',
        password: 'ludosanu'
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(500);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 400 Bad Request (Invalid datas)', function(done) {
      chai.request(endpoints.user.updateProfile)
      .put('/')
      .set('Cookie', 'token=' + sessionToken)
      .send({
        firstName: 'Razvan',
        lastName: '',
        username: 'rlnu',
        email: 'r.luail.com',
        password: 'ab456'
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 403 Forbidden (Invalid password)', function(done) {
      chai.request(endpoints.user.updateProfile)
      .put('/')
      .set('Cookie', 'token=' + sessionToken)
      .send({
        firstName: 'Razvan',
        lastName: 'Ludosanu',
        username: 'rludosanu',
        email: 'r.ludosanu@gmail.com',
        password: 'abdef123456'
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(403);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 304 Not Modified (Valid datas and cookie)', function(done) {
      chai.request(endpoints.user.updateProfile)
      .put('/')
      .set('Cookie', 'token=' + sessionToken)
      .send({
        firstName: 'Razvan',
        lastName: 'Ludosanu',
        username: 'rludosanu',
        email: 'r.ludosanu@gmail.com',
        password: 'ludosanu'
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(304);
        done();
      });
    });

    it('should return a 200 OK (Valid datas and cookie)', function(done) {
      chai.request(endpoints.user.updateProfile)
      .put('/')
      .set('Cookie', 'token=' + sessionToken)
      .send({
        firstName: 'John',
        lastName: 'Doe',
        username: 'rludosanu',
        email: 'r.ludosanu@gmail.com',
        password: 'ludosanu'
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });
  });

  /*
  ** Reset Password
  */
  /*describe('Reset Password', function() {
    it('should return a 400 Bad Request (Empty datas)', function(done) {
      chai.request(endpoints.user.resetPassword)
      .put('/')
      .end(function(err, res) {
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 400 Bad Request (Email format error)', function(done) {
      chai.request(endpoints.user.resetPassword)
      .put('/')
      .send({
        email: 'r.ludosanu'
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(400);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 404 Not Found (Invalid email)', function(done) {
      chai.request(endpoints.user.resetPassword)
      .put('/')
      .send({
        email: 'r.ludosanu@live.fr'
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(404);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });

    it('should return a 200 OK (Valid email)', function(done) {
      chai.request(endpoints.user.resetPassword)
      .put('/')
      .send({
        email: 'r.ludosanu@gmail.com'
      })
      .end(function(err, res) {
        chai.expect(res.status).to.equal(200);
        chai.expect(res.body).to.be.a('string');
        done();
      });
    });
  });*/
});
