
// Change Image on Hover
function enableVedioCall() {
  document.getElementById("myImg").src = "./assets/img/ic_enable_video.png";
}
function enableAudioCall() {
  document.getElementById("myImg1").src = "./assets/img/ic_enable_call.png";
}
function disableVideocall(){
   document.getElementById("myImg").src = "./assets/img/ic_disable_video.png";
}
function disableAudiocall(){
   document.getElementById("myImg1").src = "./assets/img/ic_disable_call.png";
}

// Tabs script
function tabList(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}
document.getElementById("defaultOpen").click();

// TIMER EVENTS
var h1 = document.getElementsByTagName('h2')[0],
    seconds = 0, minutes = 0, hours = 0, t;

    function add() {
      seconds++;
      if (seconds >= 60) {
          seconds = 0;
          minutes++;
          if (minutes >= 60) {
              minutes = 0;
              hours++;
          }
      }
      
      h1.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
      timer()
      
  }
  function timer() {
    console.log('timer')
    t = setTimeout(add, 1000);
}

