var app = require('http').createServer(handler);
var io = require('socket.io')(app,{ wsEngine: 'ws' });
var fs = require('fs');
var validator = require('validator');
app.listen(process.env.PORT || 1337);

var conversations = [], globalAnswers = [];

function handler (req, res) {
    res.end('200 OK');
}

io.origins('*:*');


io.of('/server').on('connection', function (socket) {
  console.log(socket.id);
  socket.on('getJSON',function(data){
   // console.log(data.clientId);
    globalAnswers[data.clientId] = data.sendConversation;
    // console.log(globalAnswers[data.clientId]);
  });

});

// io.of('/consulting').on('connection',(socket)=>{});

io.of('/browser').on('connection', function(socket) {
 
    conversations[socket.handshake.query.session] = [];
    conversations[socket.handshake.query.session].push({
     clientId : socket.handshake.query.client,
     gotDetails : socket.handshake.query.gotDetails,
     next : socket.handshake.query.next,
     userEmail : socket.handshake.query.email,
     userMobile : socket.handshake.query.mobile,
     userName : socket.handshake.query.name,
  });
 
  // console.log(conversations[socket.id]);
  socket.on('question',function(data){

   getAnswer(data.question.toLowerCase(),conversations[socket.handshake.query.session][0],socket.handshake.query.session,socket.handshake.query.client,function(question,response){
     socket.emit('answer', response);


     if( response.ansType == 'text'){
       conversations[socket.handshake.query.session].push({
         response:response.answer,
         question : question,
         options : response.ansOptions,
       });
     }
   
   });

 });


  socket.on('disconnect',function(){
    console.dir(conversations[socket.handshake.query.session]);
    io.of('/server').emit('completedConversation',{ conversations : conversations[socket.handshake.query.session], session:socket.handshake.query.session });
    conversations.splice(socket.handshake.query.session, 1);
    console.log(conversations[socket.handshake.query.session]);
  });

});

function getAnswer(question,prompt,id,clientId,callback)
{


  if( prompt.gotDetails == 'false' && prompt.next != 'done'){

    var answer = {};
    switch( prompt.next){
    case 'name':
        answer.ansType = 'text';
        answer.answer = 'Please provide your name so that we can assist you.';
        answer.placeholder = 'Enter Your Name';
        conversations[id][0].next = 'mobile';
        break;
    case 'mobile':
       if(validator.isAlpha(question))
        {
          conversations[id][0].userName = question;
          answer.ansType = 'text';
          answer.placeholder = 'Enter Your Mobile Number';
          answer.answer = 'Please provide a valid contact number.';
          conversations[id][0].next = 'email';
          answer.name = question;
        }
        else
        {
          answer.ansType = 'text';
          answer.placeholder = 'Alphabets only :)';
          answer.answer = 'Please dont use special characters or numbers in your name. Use only alphabets to provide your name.<br>Please provide your name/patient name so that we can assist you.';
        }
          break;
    case 'email':
    if (validator.isMobilePhone(question, 'en-IN')) 
    {
        conversations[id][0].userMobile = question;
        answer.ansType = 'text';
        answer.answer = 'How can we contact you? Please provide an email id.';
        answer.placeholder = 'Enter Your Email ID';
        answer.mobile = question;
        conversations[id][0].next = 'save';
    }
    else
    {
        answer.ansType = 'text';
        answer.placeholder = 'Enter mobile number!';
        answer.answer = "You did not enter a valid mobile number. Make sure it's a valid 10 digit mobile number.<br>Please provide a valid contact number.";
    }
        break;
      case 'save':
      if (validator.isEmail(question)) {
        conversations[id][0].userEmail = question;
        conversations[id][0].gotDetails = 'true';
        conversations[id][0].next = 'done';
        answer.ansType = 'text';
        answer.answer = 'Thank you for providing your information. We will get back to you with requested information through phone/email within 24-48 hrs. Thank you. In Emergency, you may contact +91 8639653657,+91 8686687113, +91 9100379991,+91 9100379992.';
        answer.placeholder = 'Thank you, Please type your query';
        answer.email = question;        
      }
      else
      {
        answer.ansType = 'text';
        answer.answer = 'You did not enter a valid email id.<br>Please enter a valid email Id';
        answer.placeholder = 'email Id?';
      }
        break;
    }
    // console.log(answer);
      return callback(question,answer);
  }
// console.log(globalAnswers[clientId]);
var answerSet = globalAnswers[clientId];
// console.log(answerSet);
if(answerSet == undefined){
      var answer = {};
      answer.ansType = 'text';
      answer.answer = 'Currently maria is under maintainance!,<br>Please check back later';
      return callback(question,answer);
}
else{
  for(i=answerSet.length-1;i>=0;i--)
  {

    for(k = answerSet[i].question.length - 1; k >= 0; k--){
      if(question.toLowerCase().includes(answerSet[i].question[k].toLowerCase())){
        var answer = {};
        answer.ansType = answerSet[i].ansType;
        if(answer.ansType == 'text')
          answer.answer = answerSet[i].answer;
        else
          answer.ansOptions = answerSet[i].ansOptions;
        return callback(question,answer);
        break;
      }
    }
    if(i==0){
      var answer = {};
      answer.ansType = 'text';
      answer.answer = 'Please visit our website or call us for additional queries';
      return callback(question,answer);
      break;
    }
  }
}

}
