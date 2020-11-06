function goToChapter(btnID){
    var nextTimepoint = cue.data.nextChapter;
    cue.forcedExit = true;
    video.currentTime = nextTimepoint;
}



if(Hls.isSupported()) {
    var video = document.getElementById('video');
    var activeOverlay;
    var activeOverlayClass;
    var clickedBtn;
    var cue;
    var hls = new Hls({
        debug: false
    });
    hls.loadSource('media/est/master.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MEDIA_ATTACHED, function() {
      video.muted = true;
      video.currentTime = 7;
      var metaTrack = video.textTracks[0];

      
      metaTrack.mode = "hidden"; 
      metaTrack.oncuechange = function(e) {
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
                  if(this.data.endAction == "back2Start"){
                    if(!this.forcedExit){
                        video.currentTime = this.startTime;
                    }
                    else{activeOverlay.className ="hidden";}
                    
                  }
                  if(this.data.endAction == "startNext"){
                    activeOverlay.className ="hidden";
                  }
                  
              }
          }
      }
      video.play();
      
  });
 }