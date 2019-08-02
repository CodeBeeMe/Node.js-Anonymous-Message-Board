/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const ObjectId = require('mongodb').ObjectID;

module.exports = (app, db) => {
    
  //=================================================== Posting, reporting and deleting a thread ===================================================
  app.route('/api/threads/:board')
    .get((req, res) => {
    const board = req.params.board;
    const threadQuery = req.query; //getting the query object filled with the query strings
    
    threadQuery._id ? threadQuery._id = new ObjectId(threadQuery._id) : undefined;
    
    //assigning the boolean value resulting from the comparison to the threadQuery.reported property before running the .find() method
    threadQuery.reported ? threadQuery.reported = threadQuery.reported.toString() == "true" : null;
       
    //running the .find() method with the query object req.query resulted from the user query strings
    //on the first run the query object is empty and the .find() returns all the issue entries for that particular board
    db.collection(board).find({}).toArray((err, threads) => {
      //getting the replycount value looking at the length of the replies array
      threads.forEach(el => el.replycount = el.replies.length);
      err ? res.send(err) : res.send(threads);
      
      //console.log(threadQuery);
    });
  })
  //submitting the thread
    .post((req, res) => {
    const board = req.params.board;
    console.log(board);
    
    const boardName  = req.body.board;
    const text       = req.body.text;
    const password   = req.body.delete_password;
    
    const threadEntry = {      
      text:            text,      
      created_on:      new Date().toISOString(),
      bumped_on:       new Date().toISOString(),
      reported:        false,
      delete_password: password,
      replies : []
    }  
    
    if (!text || !password ) { //checking to see if the user entered a boardName, text and password in the required input fields
      res.send('*required fields missing');
    } else { //all fields are filled => proceed to add the thread to the database
      db.collection(board).insertOne(threadEntry, (err, thread) => {
        //console.log('Thread ' + text + ' has been successfully submitted.');
        threadEntry._id = thread.insertedId;
        //console.log(issue); 
        //err ? res.send(err) : res.json(threadEntry);
        err ? res.send(err) : res.redirect('/b/' + board + '/');
      })
    }
  })
  
  //updating(reporting) the thread
    .put((req, res) => {
    const board = req.params.board;    
    const threadUpdate = req.body; // threadUpdate obj composed of the form fields data
    const reportId     = req.body.report_id;
    
    console.log(reportId);    
    
    // a series of checks to refine the updates object and keep only the user completed form fields(updates) before is sent to the update method      
    !threadUpdate.text       ? delete threadUpdate.text : null; 
    !threadUpdate.created_on ? delete threadUpdate.created_on  : null; 
    !threadUpdate.bumped_on  ? delete threadUpdate.bumped_on  : null; 
    !threadUpdate.replies    ? delete threadUpdate.replies : null; 
                               delete req.body.report_id; //reseting the body._id from memory          
    
    reportId ? threadUpdate.reported = "true" : null;
    threadUpdate.bumped_on =  new Date().toISOString(); //reset the bumped_on property
    
    db.collection(board).findOneAndUpdate({_id: ObjectId(reportId)}, { $set: threadUpdate }, (err, thread) => {
        err ? res.send('could not update ' + reportId) : res.send('successfully updated');        
        //console.log(req.body);
      })
    
  })  
  
  //deleting the thread
    .delete((req, res) => {
    const board = req.params.board;
    const threadId = req.body.thread_id;
    const password = req.body.delete_password;
    
    if (!threadId || !password) { //checking to see if the user entered thread_id in the input field
      res.send('_id error');
    } else {//_id and password entered => proceed to delete the thread from the database        
      db.collection(board).deleteOne({_id: ObjectId(threadId), delete_password: password}, (err, result) => {
        if (err) {
          res.send(err);
        } else {
          const deleted = result.result.n; // property identifier from the result file that reports if the delete was done or not.
          deleted === 0 ? res.send('incorrect password') : res.send('success'); //if  deleted === 1 then the thread was deleted
          console.log(result.result.n);
        }     
      });
    }
  });  
  //================================================================================================================================================
  
  //=================================================== Posting, reporting and deleting a reply ====================================================
  app.route('/api/replies/:board');
  

};
