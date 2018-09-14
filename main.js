var app = angular.module("myApp", ['btford.socket-io']);
               app.factory('socket',  (socketFactory,$rootScope) => {
                    var sessionVar;
                                       
                   if(localStorage.sessionVar == undefined){
                       sessionVar = randomToken(12);
                       localStorage.sessionVar = sessionVar;
                   }else{
                       sessionVar = localStorage.sessionVar;
                   }
                   // console.log(sessionVar);
                   var next = function(){
                           if(localStorage.name__maria == undefined) return 'name';
                           if(localStorage.mobile__maria == undefined) return 'mobile';
                           if(localStorage.email__maria == undefined) return 'email';
                           return 'done';
                         };
                         // console.log(next());
                         // console.log(document.querySelector('script[multiplier]').getAttribute('accesskey'));
                   var ioSocket = io('https://maria-app.azurewebsites.net/browser',{
                       query:{
                           client  : document.querySelector('script[multiplier]').getAttribute('accesskey'),
                           session : sessionVar,
                           gotDetails : (localStorage.name__maria && localStorage.mobile__maria && localStorage.email__maria )?true:false,
                           name : localStorage.name__maria?localStorage.name__maria:'',
                           mobile : localStorage.mobile__maria?localStorage.mobile__maria:'',
                           email : localStorage.email__maria?localStorage.email__maria:'',
                           next : next()
                       }
                   });
                   return socketFactory({
                       ioSocket: ioSocket,
                   });
               });

app.directive("scrollToLast", ()=>{
   return {
       restrict:'EA',
       scope: {},
       link: (scope, element, attr)=>{
           var $id = $(element[0]);
           $id.parent().animate({"scrollTop":$id[0].offsetTop},10);
       }
   }
});
app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val.toString());
    };
});
app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        event.preventDefault();
    };
});
app.run(($rootScope,$timeout)=>{

  $('.__parent_container__').show();
  
    $rootScope.parent = false;
    $rootScope.chatBox = true;
    $rootScope.chatOpen = false;
    $rootScope.instances = M.TapTarget.init(document.querySelector('.tap-target'), {onOpen:'',onClose:''});
    // $rootScope.instances.open();
    // $timeout(()=>{$rootScope.instances.close();},1000);

});

app.controller("myCtrl", function($rootScope,$scope,socket,$timeout) {
            $scope.initLoad = ()=>{
                try{
                if(sessionStorage.records)
                   JSON.parse(sessionStorage.records).forEach((message,idx)=>{
                       $scope.records.push({
                        from:message.from,
                        message:message.message,
                        options:message.options,
                        time: message.time,
                        type :message.type
                      });
                    });
                   $scope.name__maria = localStorage.name__maria?localStorage.name__maria:'';
                }catch(e){}
            };
            $scope.records = [];
            $scope.add = (result)=>{
                $scope.records.push(result);
                sessionStorage.records = JSON.stringify($scope.records);
            };
            $scope.setInputMessage =(msg) =>{
                $scope.inputMessage = msg;
                $scope.sendMessage();
            } 

            $scope.sendMessage = ()=>{
                
                if(!$scope.inputMessage)return;
                $scope.typing = true;
                $scope.add({
                    from:'user',
                    message:$scope.inputMessage,
                    time: new Date()
                });
                socket.emit('question',{
                    "question":$scope.inputMessage
                });
                $scope.inputMessage = '';

            }
            $scope.toggleChat = ()=>{

          $rootScope.chatBox == true?$rootScope.chatBox = false:$rootScope.chatBox = true;
          $rootScope.chatOpen == true?$rootScope.chatOpen = false:$rootScope.chatOpen = true;

            }

            $scope.keyPress = (e)=>{
                if(e.key == 'Enter')
                    $scope.sendMessage();
            }

            socket.on('answer',(answer)=>{
                   $scope.typing = false;
                   // console.log(answer);
                   switch(answer.ansType)
                   {
                       case 'text':
                           $scope.add({ from:'server', message:answer.answer, time: new Date() , type :'text'});
                           break;
                       case 'options':
                           $scope.add({ from:'server', options:answer.ansOptions, time: new Date() , type : 'options'});
                           break;
                   }
                   $scope.placeholder = answer.placeholder? answer.placeholder:'Type a Query';

                   if(answer.name){
                    localStorage.name__maria = answer.name;
                    $scope.name__maria= answer.name;                   
                   }
                   if(answer.email)
                    localStorage.email__maria = answer.email;
                   if(answer.mobile)
                    localStorage.mobile__maria = answer.mobile;
           });

});
setTimeout(function(){angular.bootstrap(document.querySelector(".__parent_container__"), ['myApp']);},2000);