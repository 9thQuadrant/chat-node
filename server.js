var app = require('http').createServer(handler);
var client = require('socket.io-client')('https://maria-app.azurewebsites.net/server');
const sql = require('mssql');
var io = require('socket.io')(app);
var google = require('googleapis');
var authentication = require("./authentication");
var googleAuth = require('google-auth-library');
var mysql = require('mysql');
var mySqlPool  = mysql.createPool({
 connectionLimit : 10,
 host            : '148.72.192.112',
 user            : 'application',
 password        : '[xL+N,h(Xew]',
 database        : 'maria_server'
});

var conversationDataArrayArray = [];
var config = {
  port: 1433,
  stream : true,
  user: 'multiplier',
  password: 'Admin@Multi@500',
  server: 'multipliers.database.windows.net', 
  database: 'targeted_stage',
  options:{
    encrypt : true
  },
  pool: {
    max: 15,
    min: 1,
  }
};
mySqlPool.getConnection(function(err, connection) {
  // connected! (unless `err` is set)
  if (err){
    throw err;
    return;
  }
  else
  {
    app.listen(process.env.PORT || 1447);
  }

});


function handler (req, res) {
    res.end('200 OK');
}




io.of('/admin').on('connection', function(socket){
console.log('connected to admin pannel');

//get data from db to frontend
  socket.on('fetchInitData', function(data){
    var recordset =[];
    mySqlPool.getConnection(function(err, connection) {
       if(err)console.log(err);
       mySqlPool.query('SELECT question, answer, anstype from maria_admin WHERE client_id = ?',data.clientId, function (error, results, fields) {
          if (error) throw error;
            results.forEach(function(data,idx){
              recordset.push(data);
            });
       // console.log(recordset);
            socket.emit('onFetchInitData',recordset);
      });
    });
  });

//insert to db from admin pannel
    socket.on('sendToDb',function(dbData){
        
        mySqlPool.getConnection(function(err, connection) {
        var sendConversation = [];
       if(!err)
       {  
        connection.query('DELETE FROM maria_admin WHERE client_id = ?',dbData.clientId, function (error, results, fields) {
        if (error) throw error;
        console.log('deleted ' + results.affectedRows + ' rows');
        });
      try{
        dbData.records.forEach(function(data,idx){
        if(data.anstype == 'text'){
         var post =  {
            question  : data.question.join(),
            answer    : data.answer,
            client_id : dbData.clientId,
            ansType   : data.anstype
          }
          sendConversation.push({question:data.question, answer:data.answer, ansType:data.anstype})
        }
        else
        {
         var post =  {
            question  : data.question.join(),
            answer    : data.answer.join(),
            client_id : dbData.clientId,
            ansType   : data.anstype
          }
          sendConversation.push({question:data.question, ansOptions:data.answer, ansType:data.anstype});
        }
         var query = connection.query('INSERT INTO maria_admin SET ?', post, function (error, results, fields) {
           if(err)console.log(err);

          });
        console.log('inserted dashboard data into db');
        client.emit('getJSON',{ sendConversation:sendConversation,clientId:dbData.clientId });
        });
        socket.emit('sendToDbSuccess',{success:true});
      }catch(e){
        console.log(e);
        socket.emit('sendToDbSuccess',{success:false});

      }

        }
       });
    });
});

//insertion into db after a conversation
  client.on('completedConversation',function(conversationData){
  // console.log(conversationData);
   var question  = '';
   var answer    = '';
   var sheetArray = [];
   conversationDataArray = conversationData.conversations;
   conversationDataArray.forEach(function(userData,idx){
      if(idx > 1){
      answer   += idx-1+')'+userData.response+';;';
      question += idx-1+')'+userData.question+';;';
      }
   }) 
  if(conversationDataArray[0].gotDetails == 'true'){

    mySqlPool.getConnection(function(err, connection) {
   if(err)console.log(err);
   var post =  {
      name      : conversationDataArray[0].userName,
      email     : conversationDataArray[0].userEmail,
      phone     : conversationDataArray[0].userMobile,
      question  : question,
      answer    : answer,
      client_id : conversationDataArray[0].clientId,
      session   : conversationData.session,
      crmStatus : 0
    }
   var query = connection.query('INSERT INTO chat_details SET ?', post, function (error, results, fields) {
    if (!error)
      {
            console.log('inserted userdetails into db');
            var date = new Date().toLocaleString();
            sheetArray = [conversationDataArray[0].userName,conversationDataArray[0].userMobile,conversationDataArray[0].userEmail,question,answer,date]
            authentication.authenticate().then(function(auth){
            appendData(auth,sheetArray);
            });
      };
  });
  console.log(query.sql);
    });
   }
})

function appendData(auth,sheetData) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: '1VzkIc-jZe7gR_2y8uqusge230crf7jImlLkB7UPA9U0',
    range: 'chat!A1:F',
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    resource: {
     values: [ sheetData ]
    }
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Appended");
    }
  });
}


