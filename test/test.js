const main       =  document.querySelector('.main');

const player       =  main.querySelector('.player');

const video        =  player.querySelector('.viewer');


// Use fullscreen video button
function toggleFullscreen() {
      if(document.fullscreenElement){
      closeFullscreen();
    }
    else{
      openFullscreen();
    }
  }
  
  /* View in fullscreen */
  function openFullscreen() {
    if (main.requestFullscreen) {
      main.requestFullscreen();
    } else if (main.webkitRequestFullscreen) { /* Safari */
      main.webkitRequestFullscreen();
    } else if (main.msRequestFullscreen) { /* IE11 */
      main.msRequestFullscreen();
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

  // toggle play/pause
function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    video[method]();
  }