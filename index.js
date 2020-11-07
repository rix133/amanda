 // basic control functions

/* Get our elements */ 


const player       =  document.querySelector('.player');

const video        =  player.querySelector('.viewer');

const toggle       =  player.querySelector('.toggle');

const fullscreen   =  player.querySelector('.fullscreen-btn');




/* Build out functions */ 


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
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

// Create fullscreen video button
function toggleFullscreen() {
	if(player.requestFullScreen){
		player.requestFullScreen();
	} else if(player.webkitRequestFullScreen){
		player.webkitRequestFullScreen();
	} else if(player.mozRequestFullScreen){
		player.mozRequestFullScreen();
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
    cue.forcedExit = true;
    var nextTimepoint = cues[cueID].startTime;
    video.currentTime = nextTimepoint;
}

function parseRawCues(cues){
    var cueArr = []; 
    for (let index = 0; index < cues.length; index++) {
        const cue = cues[index];
        cueArr[cue.id] = cue;
    }
    
    return(cueArr);
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
      video.muted = true;
      video.currentTime = 0;
      var metaTrack  = video.textTracks[0];
      
      
      
      metaTrack.mode = "hidden"; 
      metaTrack.oncuechange = function(e) {
          if(!cuesLoaded){
            cues = parseRawCues(this.cues);
            console.log(cues);
            cuesLoaded = true;
          }
          
        
          cue = this.activeCues[0];
          if(cue){
              cue.data = JSON.parse(cue.text);
              cue.forcedExit = false;
              activeOverlayClass = cue.data.displayClass;
              if(activeOverlayClass){
                  activeOverlay = document.getElementById(activeOverlayClass);
                  activeOverlay.className = activeOverlayClass;
              }
              
              cue.onexit = function(e){
                  if(this.data.type == "loop"){
                    if(!this.forcedExit){
                        video.currentTime = this.startTime;
                    }
                    else{activeOverlay.className ="hidden";}
                    
                  }
                  if(this.data.type == "intro"){
                    if(activeOverlay){
                        activeOverlay.className ="hidden";
                    }
                  }
                  if(this.data.type == "question"){
                    if(activeOverlay){
                        activeOverlay.className ="hidden";
                        goToChapter(this.previousChapterID);
                    }
                  }
                  
              }
          }
      }
      video.play();
      
  });
 }

 