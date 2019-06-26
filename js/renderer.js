var QB = require('quickblox');
var moment = require('moment');
var incomingCallSession = null;
var incomingSession=null;
var sessionResponse = null ;
var userInfo = null;
var selectUserDetails = null;

var CREDENTIALS = {
  appId:77130,
  authKey: 'BrCLckemSvjAvE7',
  authSecret: 'ZuNvDcHKmeds9Hq'
};
// CHAT INIT
QB.init(CREDENTIALS.appId, CREDENTIALS.authKey, CREDENTIALS.authSecret);

// CHECK IF USER IS EXIST OR NOT
(() => {
  var user = localStorage.getItem('user');
  if(user){
    document.querySelector('.login-wrapper').style.display="none";
    document.querySelector('.chat-wrapper').style.display="inline-flex"
    var parsedUser = JSON.parse(user);
    createSession(parsedUser.user, parsedUser.pwd);
  }else{
    document.querySelector('.login-wrapper').style.display="inline-flex";
    document.querySelector('.chat-wrapper').style.display="none"
  }
})();

// LOGIN USER
var UserLoginSession = document.getElementById('userLoginSession');
UserLoginSession.addEventListener('click', UserLogin);

function UserLogin(e) {
  e.preventDefault();
  var userLoginInput = document.getElementById('loginUserName').value;
  var userPsswordInput = document.getElementById('loginUserPwd').value;
  if (userLoginInput === '' || userPsswordInput === '') {
    alert('please enter userName & Password');
  }
  else {
    //call create session method
    createSession(userLoginInput, userPsswordInput);
  }
};


//CREATE USER SESSION
function createSession(userLoginInput, userPsswordInput) {
  QB.createSession({ login: userLoginInput, password: userPsswordInput }, function (err, res) {
    if (err) {
      var errMessage = err.detail[0];
      document.querySelector('.alert-danger').style.display="block";
      document.getElementById('errorMessage').innerHTML=errMessage + ' User';
    } else {
    
      sessionResponse = res;
      document.querySelector('.spinner-border').style.display = "block";
      document.querySelector('.alert-danger').style.display="none";
      var userId = sessionResponse.user_id;
      localStorage.setItem('user', JSON.stringify({user: userLoginInput, pwd: userPsswordInput,}))

      connectChat(userId, userPsswordInput);
    }
  });
};

//CONNECT CHAT
function connectChat(userId, userPsswordInput) {
  QB.chat.connect({ userId, password: userPsswordInput }, function (err, roster) {
    if (err) {
    } else {
      document.querySelector('.spinner-border').style.display = "none"
      document.querySelector('.login-wrapper').style.display = "none";
      document.querySelector('.chat-wrapper').style.display = "inline-flex"
      setUserName(userId);
    }
  })
}

//SET USER NAME ON SCREEN
function setUserName(userId){
  QB.users.get(userId, function (err, result) {
    if (err) {
    } else {
      userInfo = result;
      console.log(userInfo)
      //BIND MODAL USER DETAILS
      document.getElementById('FullName').innerHTML=userInfo.full_name;
      document.getElementById('UserName').innerHTML=userInfo.login;
      document.getElementById('UserEmail').innerHTML=userInfo.email;
      document.getElementById('UserPhone').innerHTML=userInfo.phone;
     
     
      document.getElementById('userName').innerText=userInfo.full_name
      document.querySelector('#loginUserNameDispaly').innerText = userInfo.full_name
      showDialog()
    }
  });
}

// SHOW DIALOG LIST
function showDialog(){
  var filters = {"limit": 50,skip: 0};
  QB.chat.dialog.list(filters, function (err, resDialogs) {
    if (err) {
    } else {
      recentChats(resDialogs);
    }
  });
}




//USER RECENT CHAT LIST
function recentChats(resDialogs){
  var dialogList = resDialogs.items;
  recentChatList(dialogList);
}

//LIST OF USER RECENT CHATS
function recentChatList(dialogList){
  dialogList.forEach(function (item) {
    RecentUserListChats(item)
  })
}
//CREATION LIST OF USER RECENT CHATS
function RecentUserListChats(item){
  selectUserDetails = item;
  var li = document.createElement('li');//create li element
  li.className ='px-2 py-2 user-chat-list';
  var div = document.createElement('div');//create div element
  div.className='online';
  var img = document.createElement('img');//create image element
  img.setAttribute('src', './assets/img/placeholder-female-square.png');
  img.className='user-img';
  div.appendChild(img);
  li.appendChild(div)
  UserDiv = document.createElement('div');//create user name div element
  UserDiv.className='last-message';
  var username = document.createElement('span');//create user name
  username.className='chatuserName';
  var recentChatUserName = item.name;
  var recentChatUserName = document.createTextNode(recentChatUserName);
  username.appendChild(recentChatUserName)
  var lastmsg = document.createElement('span');//last message element
  lastmsg.className='last-chat-message';
  var last_msg = item.last_message;
  var last_msg_text = document.createTextNode(last_msg);
  lastmsg.appendChild(last_msg_text)
  UserDiv.appendChild(username);
  UserDiv.appendChild(lastmsg);
  li.appendChild(UserDiv);
  var small = document.createElement('small');
  small.className='time';
  var message_time = item.updated_at;
  var result = moment(message_time).calendar();
  var lastMsgTime = document.createTextNode(result);
  small.appendChild(lastMsgTime);
  li.appendChild(small);
  var ul = document.getElementById('RecentChatUserList');
  ul.appendChild(li);
  dialogListId = item._id;
}

// SELECT CURRENT USER LIST
const ul = document.querySelector('ul');
ul.addEventListener('click', currentUserChatList);

function currentUserChatList(e){
  // scrollBottom();
  e.preventDefault();
  document.querySelector('.chat-message-header').style.display = "block";
  document.querySelector('.type-message-wrapper').style.display = "block";
  document.getElementById('chatListUserName').innerHTML=selectUserDetails.name
  var dialogId = dialogListId;
  RecentMessageList(dialogId)
  
 }

  //RECENT CHAT MESSAGE LIST FROM USERS
 function RecentMessageList(dialogId){
  var params = { chat_dialog_id: dialogId, sort_desc: 'date_sent', limit: 50, skip: 0 };
  QB.chat.message.list(params, function (err, res) {
    resList = res.items;
    if (err) {
    } else {
     
      console.table(res);
      if (document.getElementById('chatParentWrapper')) {
       var ele = document.getElementById('chatParentWrapper');
       ele.innerHTML = '';
     }
     var userMessageList = res.items;
     userMessageList.reverse();
    
     userMessageList.forEach(function (item) {
       var messageList = item.message;
       var senderId = item.sender_id;
       var messageTime = item.created_at;
       var result = moment(messageTime).calendar()
       var senderUserId = userInfo.id;
       console.log(senderUserId)
       if (senderId == senderUserId) {
        chatReceiverList(messageList,result);
       } 
       else {
        chatSenderList(messageList,result);
       }
     })
     scrollBottom();
    }
  });
 }
 //MESSAGE DIV FOR SENDER 
function chatSenderList(messageList,result){
  var Incoming_Msg = document.createElement('div');
  Incoming_Msg.className='incoming_msg';
  var Received_Msg = document.createElement('div');
  Received_Msg.className='received_msg';
  var Received_Withd_Msg = document.createElement('div');
  Received_Withd_Msg.className='received_withd_msg';
  var recMsg = document.createElement('p');
  var text = document.createTextNode(messageList)
  recMsg.appendChild(text);
  var recTime = document.createElement('span');
  recTime.className='time_date'
  var currentChatTime = document.createTextNode(result);
  recTime.appendChild(currentChatTime);
  Received_Withd_Msg.appendChild(recMsg)
  Received_Withd_Msg.appendChild(recTime)
  Received_Msg.appendChild(Received_Withd_Msg);
  Incoming_Msg.appendChild(Received_Msg);
  var listParentEle = document.getElementById('chatParentWrapper');
  listParentEle.appendChild(Incoming_Msg);
}

//MESSAGE DIV FOR RECEIVER
function chatReceiverList(messageList,result){
  var Outgoing_Msg = document.createElement('div');
  Outgoing_Msg.className='outgoing_msg';
  var Sent_Msg = document.createElement('div');
  Sent_Msg.className='sent_msg';
  var OutMsg = document.createElement('p');
  var OutMsgText = document.createTextNode(messageList)
  OutMsg.appendChild(OutMsgText);
  var OutMsgTime = document.createElement('span');
  OutMsgTime.className='time_date'
  var OutMsgcurrentChatTime = document.createTextNode(result);
  OutMsgTime.appendChild(OutMsgcurrentChatTime);
  Sent_Msg.appendChild(OutMsg);
  Sent_Msg.appendChild(OutMsgTime)
  Outgoing_Msg.appendChild(Sent_Msg);
  var listParentEle = document.getElementById('chatParentWrapper');
  listParentEle.appendChild(Outgoing_Msg);

}

//SEND MESSAGE EVENT
var input = document.getElementById('typeMessage')
input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    var currentMsgTime = resList.date_sent;
    var format = 'LT';
    var result = moment(currentMsgTime).format(format)
    var inputValue = input.value
    if (inputValue === '') {
      alert('please write message')
    } else {
      var msg = {
        type: 'chat',
        body: inputValue,
        extension: {
          save_to_history: 1,
        }
      };
      let opponentId = 92473099;
      QB.chat.send(opponentId, msg);
      input.value = '';
      WriteMsg(inputValue,result);
      event.preventDefault();
    }

  }
});

function WriteMsg(inputValue,result){
  var Outgoing_Msg = document.createElement('div');
  Outgoing_Msg.className='outgoing_msg';
  var Sent_Msg = document.createElement('div');
  Sent_Msg.className='sent_msg';
  var OutMsg = document.createElement('p');
  var OutMsgText = document.createTextNode(inputValue)
  OutMsg.appendChild(OutMsgText);
  var OutMsgTime = document.createElement('span');
  OutMsgTime.className='time_date'
  var OutMsgcurrentChatTime = document.createTextNode(result);
  OutMsgTime.appendChild(OutMsgcurrentChatTime);
  Sent_Msg.appendChild(OutMsg);
  Sent_Msg.appendChild(OutMsgTime)
  Outgoing_Msg.appendChild(Sent_Msg);
  var listParentEle = document.getElementById('chatParentWrapper');
  listParentEle.appendChild(Outgoing_Msg);
}

//RECEIVER CHAT DYNAMIC DIV
QB.chat.onMessageListener = onMessage;
function onMessage(userId, msg) {
  var userMessage = msg.body;
  var Outgoing_Msg = document.createElement('div');
  Outgoing_Msg.className='outgoing_msg';
  var Sent_Msg = document.createElement('div');
  Sent_Msg.className='sent_msg';
  var OutMsg = document.createElement('p');
  var OutMsgText = document.createTextNode(userMessage)
  OutMsg.appendChild(OutMsgText);
  var OutMsgTime = document.createElement('span');
  OutMsgTime.className='time_date'
  var OutMsgcurrentChatTime = document.createTextNode(result);
  OutMsgTime.appendChild(OutMsgcurrentChatTime);
  Sent_Msg.appendChild(OutMsg);
  // Sent_Msg.appendChild(OutMsgTime)
  Outgoing_Msg.appendChild(Sent_Msg);
  var listParentEle = document.getElementById('chatParentWrapper');
  listParentEle.appendChild(Outgoing_Msg);
}

// UPLOAD A FILE TO THE CONTENT MODULE

// function readURL(input) {
//   if (input.files && input.files[0]) {
//     var reader = new FileReader();
//     reader.onload = function (e) {
//       $('#typeMessage').attr('src', e.target.result);
//     }
//     reader.readAsDataURL(input.files[0]);
//   }
// }
// $("#profile-img").change(function(){
//   readURL(this);
// });


// function showname () {
//   var inputFile = document.getElementById('file-input'); 
  
//   var params = {name: inputFile.files.item(0).name, file: inputFile, type: inputFile.files.item(0).type, size:  inputFile.files.item(0).size, 'public': false};
// QB.content.createAndUpload(params, function(err, response){
//   if (err) {
//     console.log(err);
//   } else {
//     var uploadedFile = response;
//     console.table(uploadedFile);
   
//   }
// });
// };



//******************* */ VOICE CALL******************
var voiceCallBtn = document.querySelector('.voiceCall');
voiceCallBtn.addEventListener('click', VoiceCall)

function VoiceCall(){
document.querySelector('.voice-wrapper').style.display='block';
document.getElementById('voiceCallUserName').innerHTML=selectUserDetails.name;
var options = {
  muted: true,
  mirror: true
};
var calleesIds = [92473099]; 
  var sessionType = QB.webrtc.CallType.AUDIO;
  var session = QB.webrtc.createNewSession(calleesIds, sessionType);
  // console.table(session.opponentsIDs);
  session.getUserMedia({audio: true, video: false, elemId: 'localVideo', options: options}, function(err, stream) {
    if (err){
     
    } else{
      // console.log('call stream successfully',stream);
      var extension = {};
      session.call(extension, function(error) {
      if(error) {
        console.log('session.call', error);
      } else {
        // console.log('Called successfully');
        const audio = document.querySelector("#audio");
        audio.play();
      }
      });
    }
  });
}
//*** *ON CALL LISTEM METHOD***
QB.webrtc.onCallListener = function(session, extension) {
  document.getElementById('incommingUserCall').style.visibility="visible";
  console.log(`Incoming call with session:${session}`);
  incomingCallSession = session;
  console.table('incomingCallSession', incomingCallSession)
 
  
};

// **CALL ACCEPT METHOD**
var incommingAcceptCall = document.getElementById('acceptCall');
incommingAcceptCall.addEventListener('click', AcceptIncommingCall);

function AcceptIncommingCall(){
  var options = {
    muted: true,
    mirror: true
  };
incomingCallSession.getUserMedia({audio: true, video: false, elemId: 'localVideo', options: options}, function(err, stream) {
  if (err){
    console.log('error in stream', err)
    
  }else{
   
    document.querySelector('.voice-wrapper').style.display='block';
    console.log('call stream successfully',stream);
    var extension = {};
    incomingCallSession.accept(extension);
    console.log('accept user call');
    timer();
   
  }
});
}

//***ON REMOTE STREAM LISTENER***
QB.webrtc.onRemoteStreamListener = function(session, userID, remoteStream) {
  if(incomingCallSession == null){
    session.attachMediaStream('remoteVideo', remoteStream);
  }else{
    incomingCallSession.attachMediaStream('remoteVideo', remoteStream);
    incomingCallSession.unmute('audio');
  }
}

//********** */ON CALL REJECT**********
var reject = document.getElementById('callReject');
reject.addEventListener('click', rejectCall);
function rejectCall(e){
  var extension = {};
  incomingCallSession.reject(extension);
  console.log('reject user call');
  e.preventDefault();

}

// **********ON ACCEPT CALL LISTENER**********
QB.webrtc.onAcceptCallListener = function(session, userId, extension) {
 
  console.log(`${userId} accepted the call`);
  timer();
  const audio = document.querySelector("#audio");
  audio.pause();
  audio.currentTime = 0;
};


// END CALL
var EndCall = document.getElementById('endCall');
EndCall.addEventListener('click', endIncommingCall)

function endIncommingCall(){
  document.querySelector('.voice-wrapper').style.display='none'
  document.getElementById('incommingUserCall').style.visibility='hidden'
  var extension = {};
  incomingSession.stop(extension);
  const audio = document.querySelector("#audio");
  audio.pause();
  audio.currentTime = 0;
}
QB.webrtc.onStopCallListener = function(session, userId, extension) {
 console.log('end call');
 const audio = document.querySelector("#audio");
  audio.pause();
  audio.currentTime = 0;
};

  

// CHAT LOGOUT FUNCTION
var chatLogout = document.getElementById('logoutChat');
chatLogout.addEventListener('click', logoutChat)

function logoutChat() {
  location.reload(); 
  document.querySelector('.login-wrapper').style.display="inline-flex";
  document.querySelector('.chat-wrapper').style.display="none";
  document.querySelector('.spinner-border').style.display="none";
  console.log('chat logout')
  localStorage.clear();
  QB.chat.disconnect();


}
QB.chat.onDisconnectedListener = onDisconnectedListener;
function onDisconnectedListener() {
  console.log("onDisconnected");
}


// SCROLL EVENTS
function scrollBottom(){
  var objDiv = document.getElementById("chatParentWrapper");
  objDiv.scrollTop = objDiv.scrollHeight;
}




