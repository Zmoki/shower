window.addEventListener('popstate', () => {
  const slides = ['#cover', '#spb']

  if (!!~slides.indexOf(document.location.hash)) {
    const $parent = document.querySelector(document.location.hash)

    const constraints = {
      video: {
        height: 200,
      },
      audio: false,
    }

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        const $video = $parent.querySelector('.video')

        $video.srcObject = stream
        $video.onloadedmetadata = () => {
          $video.play()

          $video.hidden = false
        }

        window.addEventListener('popstate', () => {
          (stream.getVideoTracks()[0]).stop()

          $video.hidden = true
        })
      })
      .catch(error => {
        const $el = $parent.querySelector('.video-error')

        $el.innerText = error.message
        $el.hidden = false
      })
  }
})
