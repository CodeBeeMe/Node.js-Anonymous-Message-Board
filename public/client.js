
$(document).ready(function() {
  
  //===============================================board.html==================================================  
  var currentBoard = window.location.pathname.slice(3, -1);
  var url = "/api/threads/" + currentBoard;
     $('#boardTitle').text('Welcome to ' + window.location.pathname)
     $.ajax({
         type: "GET",
         url: url,
         success: function(data) {
             var boardThreads = [];
             //
             // THIS ARRAY SET UP IS FOR CODE READABILITIES AND TESTING!
             // THIS IS NOT WHAT IT WOULD LOOK LIKE TO GO LIVE
             //
             data.forEach(function(ele) {
                 console.log(ele); //can I use typeScript please?!
                 var thread = ['<div class="thread">'];
                 thread.push('<div class="main">')
                 thread.push('<p class="id">id: ' + ele._id + ' (' + ele.created_on + ')</p>');
                 thread.push('<form id="reportThread"><input type="hidden" name="report_id" value="' + ele._id + '"><input type="submit" value="REPORT"></form>');
                 thread.push('<form id="deleteThread"><input type="hidden" value="' + ele._id + '" name="thread_id" required=""><input type="text" placeholder="*password" name="delete_password" required=""><input type="submit" value="DELETE"></form>');
                 thread.push('<h3>' + ele.text + '</h3>');
                 var hiddenCount = ele.replycount - 3;
                 hiddenCount < 1 ? hiddenCount = 0 : null;
                 thread.push('<h5>' + ele.replycount + ' replies total (' + hiddenCount + ' hidden) <button><a href="' + window.location.pathname + ele._id + '">see full thread here</a></button></h5>');
                 thread.push('</div><div class="replies">');                 
                 ele.replies.forEach(function(rep) {
                     thread.push('<div class="reply">')
                     thread.push('<p class="id">id: ' + rep._id + ' (' + rep.created_on + ')</p>');
                     thread.push('<form id="reportReply"><input type="hidden" name="thread_id" value="' + ele._id + '"><input type="hidden" name="reply_id" value="' + rep._id + '"><input type="submit" value="REPORT"></form>');
                     thread.push('<form id="deleteReply"><input type="hidden" value="' + ele._id + '" name="thread_id" required=""><input type="hidden" value="' + rep._id + '" name="reply_id" required=""><input type="text" placeholder="*password" name="delete_password" required=""><input type="submit" value="DELETE"></form>');
                     thread.push('<p id="replyText">' + rep.text + '</p>');
                     thread.push('</div>')
                 });
                 thread.push('<div class="newReply">')
                 thread.push('<form action="/api/replies/' + currentBoard + '/" method="post" id="newReply">');
                 thread.push('<input type="hidden" name="thread_id" value="' + ele._id + '">');
                 thread.push('<textarea type="text" placeholder="*Quick reply..." name="text" required=""></textarea><br>');
                 thread.push('<input type="text" placeholder="*password to delete" name="delete_password" required=""><input type="submit" value="REPLY">')
                 thread.push('</form></div></div></div>')
                 boardThreads.push(thread.join(''));
             });
             $('#boardDisplay').html(boardThreads.join(''));
         }
     });

     $('#newThread').submit(function() {
         $(this).attr('action', "/api/threads/" + currentBoard);
     });

     /*$('#boardDisplay').on('submit', '#reportThread', function(e) {
         var url = "/api/threads/" + currentBoard;
         $.ajax({
             type: "PUT",
             url: url,
             data: $(this).serialize(),
             success: function(data) {
                 alert(data);
                 window.location.reload(true); //update list
             }
         });
         //setTimeout(() => location.reload(), 1000); //update list
         e.preventDefault();
     });    
     $('#boardDisplay').on('submit', '#deleteThread', function(e) {
         var url = "/api/threads/" + currentBoard;
         $.ajax({
             type: "DELETE",
             url: url,
             data: $(this).serialize(),
             success: function(data) {
                 alert(data);
                 window.location.reload(true); //update list
             }
         });
         //setTimeout(() => location.reload(), 1000); 
         e.preventDefault();
     });*/
     /*$('#boardDisplay').on('submit', '#reportReply', function(e) {
         var url = "/api/replies/" + currentBoard;
         $.ajax({
             type: "PUT",
             url: url,
             data: $(this).serialize(),
             success: function(data) {
                 alert(data);
                 window.location.reload(true); //update list
             }
         });
         //setTimeout(() => location.reload(), 1000); //update list
         e.preventDefault();
     });
     $('#boardDisplay').on('submit', '#deleteReply', function(e) {
         var url = "/api/replies/" + currentBoard;
         $.ajax({
             type: "DELETE",
             url: url,
             data: $(this).serialize(),
             success: function(data) {
                 alert(data);
                 window.location.reload(true); //update list
             }
         });
         //setTimeout(() => location.reload(), 1000); //update list
         e.preventDefault();
     });*/
  
  //============================================================================================================  
  //===============================================thread.html==================================================  
  var currentURL = window.location.pathname.slice(3);
      currentURL = currentURL.split('/');
  
  var url = "/api/replies/" + currentURL[0];
     $('#threadTitle').text(window.location.pathname);
     $.ajax({
         type: "GET",
         url: url,
         data: {
             thread_id: currentURL[1]
         },
         success: function(ele) {
             var boardThreads = [];
             //
             // THIS ARRAY SET UP IS FOR CODE READABILITIES AND TESTING!
             // THIS IS NOT WHAT IT WOULD LOOK LIKE TO GO LIVE
             //
             console.log(ele); //can I use typeScript please?!
             var thread = ['<div class="thread">'];
             thread.push('<div class="main">')
             thread.push('<p class="id">id: ' + ele._id + ' (' + ele.created_on + ')</p>');
             thread.push('<form id="reportThread"><input type="hidden" name="report_id" value="' + ele._id + '"><input type="submit" value="REPORT"></form>');
             thread.push('<form id="deleteThread"><input type="hidden" value="' + ele._id + '" name="thread_id" required=""><input type="text" placeholder="password" name="delete_password" required=""><input type="submit" value="DELETE"></form>');
             thread.push('<h3>' + ele.text + '</h3>');
             thread.push('</div><div class="replies">');
             ele.replies.forEach(function(rep) {
                 thread.push('<div class="reply">')
                 thread.push('<p class="id">id: ' + rep._id + ' (' + rep.created_on + ')</p>');
                 thread.push('<form id="reportReply"><input type="hidden" name="thread_id" value="' + ele._id + '"><input type="hidden" name="reply_id" value="' + rep._id + '"><input type="submit" value="REPORT"></form>');
                 thread.push('<form id="deleteReply"><input type="hidden" value="' + ele._id + '" name="thread_id" required=""><input type="hidden" value="' + rep._id + '" name="reply_id" required=""><input type="text" placeholder="password" name="delete_password" required=""><input type="submit" value="DELETE"></form>');
                 thread.push('<p id="replyText">' + rep.text + '</p>');
                 thread.push('</div>')
             });
             thread.push('<div class="newReply">')
             thread.push('<form action="/api/replies/' + currentURL[0] + '/" method="post" id="newReply">');
             thread.push('<input type="hidden" name="thread_id" value="' + ele._id + '">');
             thread.push('<textarea type="text" placeholder="Quick reply..." name="text" required=""></textarea><br>');
             thread.push('<input type="text" placeholder="password to delete" name="delete_password" required=""><input type="submit" value="REPLY">')
             thread.push('</form></div></div></div>')
             boardThreads.push(thread.join(''));
             $('#boardDisplay').html(boardThreads.join(''));
         }
     });
  
     $('#newThread').submit(function() {
         $(this).attr('action', "/api/threads/" + currentBoard);
     });

     $('#boardDisplay').on('submit', '#reportThread', function(e) {
         var url = "/api/threads/" + currentURL[0];
         $.ajax({
             type: "PUT",
             url: url,
             data: $(this).serialize(),
             success: function(data) {
                 alert(data);
                 window.location.reload(true); //update list
             }
         });
         e.preventDefault();
     });
     $('#boardDisplay').on('submit', '#deleteThread', function(e) {
         var url = "/api/threads/" + currentURL[0];
         $.ajax({
             type: "DELETE",
             url: url,
             data: $(this).serialize(),
             success: function(data) {
                 alert(data);
                 window.location.reload(true); //update list
             }
         });
         e.preventDefault();
     });
     $('#boardDisplay').on('submit', '#reportReply', function(e) {
         var url = "/api/replies/" + currentURL[0];
         $.ajax({
             type: "PUT",
             url: url,
             data: $(this).serialize(),
             success: function(data) {
                 alert(data);
                 window.location.reload(true); //update list
             }
         });
         e.preventDefault();
     });
     $('#boardDisplay').on('submit', '#deleteReply', function(e) {
         var url = "/api/replies/" + currentURL[0];
         $.ajax({
             type: "DELETE",
             url: url,
             data: $(this).serialize(),
             success: function(data) {
                 alert(data);
                 window.location.reload(true); //update list
             }
         });
         e.preventDefault();
     });
  
  //============================================================================================================  
  //=================================================index.html=================================================
    $("#newThread").submit(function() {
        var board = $("#board1").val();
        $(this).attr("action", "/api/threads/" + board);
    });
    $("#newReply").submit(function() {
        var board = $("#board4").val();
        $(this).attr("action", "/api/replies/" + board);
    });
    $("#reportThread").submit(function(e) {
        var url = "/api/threads/" + $("#board2").val();
        $.ajax({
            type: "PUT",
            url: url,
            data: $(this).serialize(),
            success: function(data) {
                alert(data);
            }
        });
        e.preventDefault();
    });
    $("#deleteThread").submit(function(e) {
        var url = "/api/threads/" + $("#board3").val();
        $.ajax({
            type: "DELETE",
            url: url,
            data: $(this).serialize(),
            success: function(data) {
                alert(data);
            }
        });
        e.preventDefault();
    });
    $("#reportReply").submit(function(e) {
        var url = "/api/replies/" + $("#board5").val();
        $.ajax({
            type: "PUT",
            url: url,
            data: $(this).serialize(),
            success: function(data) {
                alert(data);
            }
        });
        e.preventDefault();
    });
    $("#deleteReply").submit(function(e) {
        var url = "/api/replies/" + $("#board6").val();
        $.ajax({
            type: "DELETE",
            url: url,
            data: $(this).serialize(),
            success: function(data) {
                alert(data);
            }
        });
        e.preventDefault();
    });
  
  //===========================================================================================================

});

