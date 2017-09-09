const hash = '#spb-video'
let player
let playerData

function onYouTubeIframeAPIReady() {
  player = new YT.Player('spb-video-player', {
    videoId: 'xjRr5oRbwpk', // YouTube Video ID
    width: 960,               // Player width (in px)
    height: 540,              // Player height (in px)
    playerVars: {
      controls: 0,        // Show pause/play buttons in player
      showinfo: 0,        // Hide the video title
      modestbranding: 1,  // Hide the Youtube Logo
      loop: 1,            // Run the video in a loop
      fs: 0,              // Hide the full screen button
      cc_load_policy: 0, // Hide closed captions
      iv_load_policy: 3,  // Hide the Video Annotations
      autohide: 0,        // Hide video controls when playing
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  })
}

function onPlayerReady() {
  player.mute()
  player.setPlaybackRate(2)

  window.addEventListener('popstate', () => {
    if (document.location.hash === hash) {
      player.playVideo()
    }
    if (document.location.hash !== hash && (playerData === YT.PlayerState.PLAYING)) {
      player.pauseVideo()
    }
  })

  if (document.location.hash === hash) {
    player.playVideo()
  }
}

function onPlayerStateChange(event) {
  playerData = event.data
}
