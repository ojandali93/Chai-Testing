require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const temporaryId = 'temporaryId'
const temporaryMessageId = 'Message1'


describe('Message API endpoints', () => {
    beforeEach((done) => {
        // TODO: add any beforeEach code here
      const testUser1 = new User({username: 'OmarJandali', password:'password', id:temporaryId})
      testUser1.save()
      .then(() => {
        const message1 = new Message({title: 'Test Message', body: 'Testing', author: temporaryMessageId, id:temporaryId})
        message1.save()
        done()
      })
    })

    afterEach((done) => {
        // TODO: add any afterEach code here
        Message.deleteMany({title: ['Test Message']})
        .then(() => {
          User.deleteMany({username: ['OmarJandali']})
          .then(() => {
            done();
          });
        });
    })

    it('should load all messages', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get('/messages')
        .end((err, res) => {
          err ? done(err) : null
          expect(res).to.have.status(200);
          expect(res.body.messages).to.be.an("array")
          done();
        });
    })

    it('should get one specific message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .get(`/messages/${temporaryMessageId}`)
        .end((err, res) => {
          err ? done(err) : null
          expect(res).to.have.status(200);
          expect(res.body.title).to.equal('test');
          done();
        });
        
    })

    it('should post a new message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .post('/messages')
        .send({title: 'test2', body:'testing again', author: temporaryId})
        .end((err, res) => {
          err ? done(err) : null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('title')
          done()
        })  
    })

    it('should update a message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .put(`/messages/${temporaryMessageId}`)
        .send({title: 'test', body: 'message changed', author:temporaryId})
        .end((err, res) => {
          err ? done(err) : null
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('title')
          Message.findOne({title:'test'}).then((message) => {
            expect(message).to.have.property('body')
            done()
          })
        })
    })

    it('should delete a message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .delete(`/messages/${temporaryMessageId}`)
        .end((err, res) => {
          err ? done(err) : null
          expect(res.body.message).to.equal('Successfully deleted.')
          expect(res.body.id).to.equal(temporaryMessageId)
          Message.findOne({title:'test'}).then(message => {
            expect(message).to.equal(null)
            done()
          })
        })
    })
})
