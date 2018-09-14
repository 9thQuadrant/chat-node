  var __head = document.getElementsByTagName('head')[0];
  [
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://multiplier.blob.core.windows.net/chat/socket/w3.css",
    "https://multiplier.blob.core.windows.net/chat/socket/materialize.css",
  ].forEach(s=>{
      var __style = document.createElement('link');
      __style.rel = 'stylesheet';
      __style.href = s;
      __head.appendChild(__style);
  });
 document.addEventListener("DOMContentLoaded", function(event) {
  setTimeout(()=>{
    if(!window.$){
      var __script     = document.createElement('script');
      __script.type    = "text/javascript";
      __script.src     = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js";
      __script.onload  = __checkjQuery();
      __head.appendChild(__script);
    }
    else{
      __appendHTML();
    }
  },2000);
});

function __checkjQuery() {
console.log('checkjQuery');
   if (!window.$) {
    setTimeout(__checkjQuery, 50);
   }
  else{
  console.log('after jquery');
    __appendHTML();
  }
 }

function randomToken(length) {
  var chars   = 'qwertyuiopasdfghjklzxcvbnmASDFGHJKLZXCVBNMQWERTYUIOP1234567890';
  var result  = '';
  for (var i = length; i > 0; --i)
     result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function __appendHTML(){
  console.log('__appendHTML');
  var __client = document.querySelector('script[multiplier]').getAttribute('accesskey');
  var __initVar = atob(document.querySelector('script[multiplier]').getAttribute('digest'));
  var __body = document.querySelector('body');
  $('body').append('<div ng-controller="myCtrl" ng-init=\' init = '+(__initVar)+';initLoad();\' class="__parent_container__" ng-hide="parent"><input type="hidden" ng-model="client" ng-init="client=\''+__client+'\'"><div class="fixed-action-btn direction-top active" style="bottom: 45px; right: 24px;" ng-click="toggleChat()" ng-hide="!chatOpen">      <a id="menu" class="btn btn-floating btn-large custom-color" ng-style="{\'border-color\':init.color,\'background-color\':init.color}"><i class="material-icons w3-xlarge">question_answer</i></a></div><div class="tap-target custom-color" data-target="menu" ng-style="{\'border-color\':init.color,\'background-color\':init.color}"><div class="tap-target-content"><p>We are here to help you on any topic.</p></div></div><div class="parent-container w3-round-xlarge" style="overflow:hidden" ng-hide="!chatBox"><div class="w3-white"><div class="row text-custom" ng-style="{\'color\':init.color}"><div class="col l2 m2 s2 grad-icon w3-padding w3-padding-16" ng-style="{\'background\':\'linear-gradient(135deg, \'+init.color+\' 50%, #fff 50%)\'}"><i class="material-icons w3-circle w3-white w3-padding-small text-custom" ng-style="{\'color\':init.color}">question_answer</i></div><div class="col l8 m8 s8 w3-padding" ng-class=" name__maria?\'w3-padding-8\':\'w3-padding-16\'"><div>{{init.hospital}}</div><div ng-hide=" name__maria == \'\' " class="w3-tiny">Hi, {{name__maria}}</div></div><div class="col l2 m2 s2 w3-right-align w3-padding w3-padding-16 close" ng-click="toggleChat()"><i class="material-icons">keyboard_arrow_down</i></div></div></div><div class="w3-display-container welcomeOveflow" ng-if="records.length==0"><div class="w3-display-middle"><div><i class="material-icons w3-text-light-grey" style="font-size:190px">question_answer</i></div><div class="w3-center">Start a Conversation by Typing Below</div></div></div><div class="w3-padding overflow" ng-if="records.length>0"><div class="w3-padding-128"></div><div ng-repeat="x in records" class="chat-{{ ::$index }}" scroll-to-last="chat-{{ ::$index }}"><div ng-if="x.from == \'server\'"><div class="w3-row-padding w3-padding-top"><div class="w3-col l11 m11 s11"><div ng-if=" x.type==\'text\' " class="custom-color w3-padding from w3-round w3-card-2 w3-animate-left" ng-bind-html="x.message | unsafe" ng-style="{\'border-color\':init.color,\'background-color\':init.color}"></div><div ng-if=" x.type==\'options\' " class="custom-color w3-padding from w3-round w3-card-2 w3-animate-left" ng-style="{\'border-color\':init.color,background-color:init.color}"><div ng-repeat="opt in x.options" class="w3-padding-small"><button ng-click="setInputMessage(opt)" class="w3-btn-block w3-white waves-effect waves-teal ico" ng-bind-html="opt | unsafe"> </button></div></div>           <div class="w3-tiny no-select w3-animate-opacity">{{init.hospital}} | {{x.time | date: "h:mm a"}} </div>        </div>        </div>    </div>    <div ng-if="x.from == \'user\'">     <div class="w3-row-padding w3-padding-top">            <div class="w3-col l1 m1 s1">&nbsp;</div>            <div class="w3-col l11 m11 s11">                <div class="custom-color w3-padding to w3-round w3-card-2 w3-right w3-animate-right" ng-bind-html="x.message | unsafe" ng-style="{\'border-color\':init.color,\'background-color\':init.color}"></div>                <div class="w3-tiny w3-right no-select w3-block w3-right-align w3-animate-opacity">{{x.time | date : "h:mm a"}} | {{name__maria?name__maria:\'You\'}}</div>            </div>        </div>    </div>    </div>    <div class="w3-padding"></div>    </div>    <div class="w3-row-padding w3-padding-0 bottom">    <div class="w3-row-padding w3-padding-0 w3-animate-opacity typing" ng-hide="!typing">        <div class="w3-center">            <div class="w3-padding-small w3-pale-red typing w3-border-red w3-tiny">Agent is Typing...</div>        </div>    </div>        <div class="w3-row-padding w3-white">        <div class="input-field w3-col l12 m12 s12 w3-margin-0">              <input id="question_field" type="text" ng-model="inputMessage" ng-keypress="keyPress($event)" autofocus="" class="ng-pristine ng-valid ng-empty ng-touched">              <label for="question_field" class="">{{placeholder?placeholder:\'Enter Message\'}}</label>        </div>        <div class="w3-col l2 m2 s0 w3-hide">            <div class="w3-padding-16">                <button class="w3-btn w3-teal" ng-click="sendMessage()" ng-disabled="!inputMessage" disabled="disabled">Send</button>            </div>        </div>        </div>    </div></div></div>');  
  [
    "https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/js/materialize.min.js",
    "https://multiplier.blob.core.windows.net/chat/socket/socket.js",
    "https://multiplier.blob.core.windows.net/chat/socket/socket.min.js",
    "https://multiplier.blob.core.windows.net/chat/socket/main.js"
  ].forEach((s,i)=>{
    setTimeout(()=>{
      var __script    = document.createElement('script');
      __script.type   = "text/javascript";
      __script.src    = s;
      __script.defer  = "defer";
      __script.async  = "true";
      __head.appendChild(__script);
    },i*50);
  });
}