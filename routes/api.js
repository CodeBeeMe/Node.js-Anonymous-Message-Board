/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect   = require('chai').expect;
const ObjectId = require('mongodb').ObjectID;

module.exports = (app, db) => {
    
  //=================================================== Posting, reporting and deleting a thread ===================================================
  //display all threads
  app.route('/api/threads/:board')
    .get((req, res) => {
    const board = req.params.board;
    
    db.collection(board)
      .find({})
      .project({reported: 0, delete_password: 0})
      .sort({bumped_on: -1})
      .limit(10)
      .toArray((err, threads) => {
      //getting the replycount value looking at the length of the replies array
      threads.forEach(el => el.replycount = el.replies.length);
      err ? res.send(err) : res.send(threads);      
      //console.log(threads);
    });
  })
  //submitting(adding) the thread
    .post((req, res) => {
    const board = req.params.board;
    const body  = req.body;
    //console.log(board);    
    
    const threadEntry = {      
      text:            body.text,      
      created_on:      new Date().toISOString(),
      bumped_on:       new Date().toISOString(),
      reported:        false,
      delete_password: body.delete_password,
      replies : []
    }  
    
    if (!body.text || !body.delete_password ) { //checking to see if the user entered a boardName, text and password in the required input fields
      res.send('*required fields missing');
    } else { //all fields are filled => proceed to add the thread to the database
      db.collection(board).insertOne(threadEntry, (err, thread) => {
        threadEntry._id = thread.insertedId;
        //console.log(thread); 
        //err ? res.send(err) : res.json(threadEntry);
        err ? res.send(err) : res.redirect('/b/' + board + '/');
      })
    }
  })
  
  //reporting the thread
    .put((req, res) => {
    const board      = req.params.board;
    const idToReport = req.body.thread_id || req.body.report_id;
    //console.log(idToReport);    
    
    if (idToReport) {
      db.collection(board).findOneAndUpdate(
        {_id: new ObjectId(idToReport)},
        { $set: { reported: true, bumped_on: new Date().toISOString()}}, (err, thread) => {
        err ? res.send(err) : res.send('success');        
        //console.log(req.body);
      })
    }
  })  
  
  //deleting the thread
    .delete((req, res) => {
    const board = req.params.board;
    const threadId = req.body.thread_id;
    const password = req.body.delete_password;
    
    db.collection(board).deleteOne({_id: new ObjectId(threadId), delete_password: password}, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        const deleted = result.result.n; // property identifier from the result file that reports if the delete was done or not.
        deleted === 0 ? res.send('incorrect password') : res.send('success'); //if  deleted === 1 then the thread was deleted
        //console.log(result.result.n);
      }   
    });
  });  
  //================================================================================================================================================
  
  //=================================================== Posting, reporting and deleting a reply ====================================================
  app.route('/api/replies/:board')
  
  //display the thread and all it's replies(posts)
    .get((req, res) => {
    const board = req.params.board;
    const threadId = req.query.thread_id;    
    //console.log(threadId);
    
    db.collection(board)
      .find({_id: ObjectId(threadId)})
      .project({ reported: 0, delete_password: 0, "replies.reported": 0, "replies.delete_password": 0 })
      .toArray((err, thread) => {
      //getting the replycount value by looking at the length of the replies array
      thread.forEach(el => el.replycount = el.replies.length);
      err ? res.send(err) : res.send(thread[0]);      
      //console.log(thread);
    });
  })
  
  //submitting(adding) a reply
    .post((req, res) => {
    const board = req.params.board;
    const body  = req.body;    
    //console.log(body); 
    
    const replyEntry = {
      _id:             new ObjectId(),
      text:            body.text,      
      created_on:      new Date().toISOString(),
      bumped_on:       new Date().toISOString(),
      reported:        false,
      delete_password: body.delete_password
    }  
    
    if (!body.text || !body.delete_password ) { //checking to see if the user entered the text and password in the required input fields
      res.send('*required fields missing');
    } else { //all fields are filled => proceed to add the reply to the thread
      db.collection(board).findOneAndUpdate(
        {_id: ObjectId(body.thread_id)},
        { $push : { replies: replyEntry }}, (err, reply) => {
        //console.log('Thread ' + text + ' has been successfully submitted.');
        //replyEntry._id = reply.insertedId;
        err ? res.send(err) : res.redirect('/b/' + board + '/' + body.thread_id);
      })
    }
  })
  
  //reporting the reply
   .put((req, res) => {
    const board    = req.params.board;
    const body     = req.body;    
    //console.log(body);  
    
    db.collection(board).findOneAndUpdate(
      {_id: ObjectId(body.thread_id), "replies._id" : ObjectId(body.reply_id)},
      { $set : { "replies.$.reported" : true, "replies.$.bumped_on": new Date().toISOString()}}, (err, reply) => {        
        err ? res.send(err) : res.send('success');
      });    
  })
  
  //deleting the reply
    .delete((req, res) => {
    const board = req.params.board;
    const body = req.body;    
    //console.log(body);
    
    db.collection(board).findOne({_id: ObjectId(body.thread_id)}, (err, thread) => {
      if (err) {
        res.send(err);
      } else {
        thread.replies.forEach(el => { 
          if (ObjectId(el._id) == body.reply_id) {
            if (el.delete_password == body.delete_password) {
              db.collection(board).updateOne(
                {_id: ObjectId(body.thread_id), "replies._id" : ObjectId(el._id)},
                { $set : { "replies.$.text" : "[deleted]" }})
              res.send('success');
            } else { 
              res.send('incorrect password');
            } 
          } 
        })
      }  
    });
  });  
};
