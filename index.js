 // basic control functions

/* Get our elements */ 


const player       =  document.querySelector('.player');

const video        =  player.querySelector('.viewer');

const controls      =  player.querySelector('.player__controls');

const toggle       =  controls.querySelector('.toggle');

const fullscreen   =  controls.querySelector('.fullscreen-btn');


/* Build out functions */ 

function firstPlay(){
  video.play();
  let startDiv = document.getElementById("start-video");
  startDiv.className = "hidden";

}

// toggle play/pause
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

// Detect press of spacebar, toggle play
function detectKeypress(e) {
	if (e.keyCode == 32) {
	  togglePlay();
	} else {
      return;
	}
}

// Update button on play/pause
function updateButton() {
  const icon = this.paused ? 'assets/buttons/pause/2.png' : 'assets/buttons/pause/1.png';
  let defaultImg = toggle.querySelector(".btn-up");
  defaultImg.src = icon;
}

// Create fullscreen video button
function toggleFullscreen() {
  //rewind(1);
	if(document.fullscreenElement){
    closeFullscreen();
  }
  else{
    openFullscreen();
  }
}

/* View in fullscreen */
function openFullscreen() {
  if (player.requestFullscreen) {
    player.requestFullscreen();
  } else if (player.webkitRequestFullscreen) { /* Safari */
    player.webkitRequestFullscreen();
  } else if (player.msRequestFullscreen) { /* IE11 */
    player.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

function nextFrame(){
  video.seekToNextFrame();
  logTime()

}
function rewind(t){
  video.currentTime = video.currentTime - t;
  logTime()
  
}

function logTime(){
  let sec = video.currentTime % 60;
  let min = Math.round(video.currentTime / 60, 0);
  if(cue){
    console.log(cue.id+ ": 0"+min+":"+sec+" ("+video.currentTime+")");
  }
  else{
    console.log("nocue : 0"+min+":"+sec);
  }
}



/* Hook up the event listeners */ 


// Click events
toggle.addEventListener('click', togglePlay);
fullscreen.addEventListener('click', toggleFullscreen);

// Keypress (Play/Pause)
//window.addEventListener('keydown', detectKeypress);

// Play/Pause events 
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);



function nextChapter(){
    var nextChapter = cue.data.nextChapterID;
    goToChapter(nextChapter);
}

function previousChapter(){
    var nextChapter = cue.data.previousChapterID;
    goToChapter(nextChapter);
}

function goToChapter(cueID){
    if(cue){
      cue.forcedExit = true;
    }
    var nextTimepoint = cues[cueID].startTime;
    video.currentTime = nextTimepoint;

    logTime();
}

function parseRawCues(cues){
    var cueArr = []; 
    for (let index = 0; index < cues.length; index++) {
        let cue = cues[index];
        cue.data = JSON.parse(cue.text);
        cueArr[cue.id] = cue;
    }
    
    return(cueArr);
}

function updateControlDisplay(data){
  if(data.hideControls){
    controls.className = "player__controls hidden";
  }
  else{
    controls.className = "player__controls";
  }
  // for last video find next chapter btn and hide it
  if(data.endAction == "stop"){
    let nextbtn = controls.querySelector(".next-chapter");
    nextbtn.className = nextbtn.className + " hidden";
  }

}

function playFromStart(){
  goToChapter('a_intro');
  let nextbtn = controls.querySelector(".next-chapter");
  nextbtn.className = "next-chapter btn";
  let togglebtn = controls.querySelector(".toggle");
  togglebtn.className = "toggle btn";
  let prevbtn = controls.querySelector(".previous-chapter");
  prevbtn.className = "previous-chapter btn";
  if(video.paused){
    let startDiv = document.getElementById("start-video");
    startDiv.className = "";
  }
  
}


var activeOverlay;
    var activeOverlayClass;
    var clickedBtn;
    var cuesLoaded = false;
    var cues;
    var cue;

if(Hls.isSupported()) {
    
    var hls = new Hls({
        debug: false
    });
    hls.loadSource('media/est/master.m3u8');
    hls.attachMedia(video);

    hls.on(Hls.Events.MEDIA_ATTACHED, function() {
      //video.muted = true;
      video.currentTime = 1050;
      var metaTrack  = video.textTracks[0];
      
      
      
      metaTrack.mode = "hidden"; 
      metaTrack.oncuechange = function(e) {
          if(!cuesLoaded){
            cues = parseRawCues(this.cues);
            //console.log(cues);
            cuesLoaded = true;
          }
        
          cue = this.activeCues[0];
          if(cue){
            //console.log("enter "+cue.id);
              cue.data = cues[cue.id].data;
              cue.forcedExit = false;
              activeOverlayClass = cue.data.displayClass;
              if(activeOverlayClass){
                  activeOverlay = document.getElementById(activeOverlayClass);
                  activeOverlay.className = activeOverlayClass;
              }
              updateControlDisplay(cue.data);
              
              cue.onexit = function(e){
                if(activeOverlay){
                  activeOverlay.className ="hidden";
                }
                let endAction = this.data.endAction;
                  if(endAction == "goToStart"){
                    if(!this.forcedExit){
                        video.currentTime = this.startTime;
                    } 
                  }
                  if(endAction == "goToNext"){
                    if(!this.forcedExit){
                      goToChapter(this.data.nextChapterID);
                    } 
                  }
                  if(endAction == "continue"){
                    //do nothing special just hide activeoverlay
                    
                  }
                  if(endAction == "goToPrevious"){
                        goToChapter(this.data.previousChapterID);
                  }
                  if(endAction == "stop"){                
                      video.pause();
                      let togglebtn = controls.querySelector(".toggle");
                      togglebtn.className = togglebtn.className + " hidden";
                      let prevbtn = controls.querySelector(".previous-chapter");
                      prevbtn.className = prevbtn.className + " hidden";

                  }
                  
              }
          }
      }
      //video.play();
      
  });
 }

 