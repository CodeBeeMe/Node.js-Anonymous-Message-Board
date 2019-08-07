/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  const threadText = 'This is a TEST for posting a thread';
  const replyText = 'This is a TEST for posting a reply';
  const threadsUrl = '/api/threads/fcc-tests';
  const repliesUrl = '/api/replies/fcc-tests';
  let testId1, testId2, testId3, testId4;

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test('adding multiple threads',function(done) {
        chai.request(server)
        .post(threadsUrl)
        .send({text: threadText, delete_password: 1234})
        .end(function(err, res){
          assert.equal(res.status, 200);
        });
        chai.request(server)
        .post(threadsUrl)
        .send({text: threadText, delete_password: 1234})
        .end(function(err, res){
          assert.equal(res.status, 200);
        });
        chai.request(server)
        .post(threadsUrl)
        .send({text: threadText, delete_password: 1234})
        .end(function(err, res){
          assert.equal(res.status, 200);
        });
        chai.request(server)
        .post(threadsUrl)
        .send({text: threadText, delete_password: 1234})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('displaying 10 most recent threads',function(done) {
        chai.request(server)
        .get(threadsUrl)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isBelow(res.body.length, 11);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'replies');
          assert.notProperty(res.body[0], 'reported');
          assert.notProperty(res.body[0], 'delete_password');
          assert.isArray(res.body[0].replies);
          testId1 = res.body[0]._id;
          testId2 = res.body[1]._id;
          testId3 = res.body[2]._id;
          testId4 = res.body[3]._id;
          done();
        });
      });
      
    });
    
    suite('DELETE', function() {
      
      test('trying to delete thread using incorrect password',function(done) {
        chai.request(server)
        .delete(threadsUrl)
        .send({thread_id: testId1, delete_password: 5678})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
      
      test('trying to delete thread using correct password',function(done) {
        chai.request(server)
        .delete(threadsUrl)
        .send({thread_id: testId2, delete_password: 1234})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      
      test('reporting thread',function(done) {
        chai.request(server)
        .put(threadsUrl)
        .send({report_id: testId1})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      test('reply to a couple of threads', function(done) {
        chai.request(server)
        .post(repliesUrl)
        .send({thread_id: testId3, text: replyText, delete_password: 1234 })
        .end(function(err, res){
          assert.equal(res.status, 200);
        });
        chai.request(server)
        .post(repliesUrl)
        .send({thread_id: testId4, text: replyText, delete_password: 1234 })
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
      
    });
    
    suite('GET', function() {
      
      test('getting all replies for a thread', function(done) {
        chai.request(server)
        .get(repliesUrl)
        .query({thread_id: testId3})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'text');
          assert.property(res.body, 'replies');
          assert.notProperty(res.body, 'reported');
          assert.notProperty(res.body, 'delete_password');
          assert.isArray(res.body.replies);
          assert.notProperty(res.body.replies[0], 'delete_password');
          assert.notProperty(res.body.replies[0], 'reported');
          done();
        });
      });
      
    });
    
    suite('PUT', function() {
      
      test('reporting reply', function(done) {
        chai.request(server)
        .put(threadsUrl)
        .send({thread_id: testId3 , reply_id: testId3})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    
    suite('DELETE', function() {
      
      test('trying to delete reply using incorrect password', function(done) {
        chai.request(server)
        .delete(threadsUrl)
        .send({thread_id: testId3, delete_password: 5678 })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
            
      test('trying to delete reply using correct password', function(done) {
        chai.request(server)
        .delete(threadsUrl)
        .send({thread_id: testId3, delete_password: 1234 })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
    });
    
  });

});
