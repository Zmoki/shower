window.addEventListener('popstate', () => {
  const demo = '#demo-constraints'

  if (document.location.hash === demo) {
    const $parent = document.querySelector(demo)
    const $preview = $parent.querySelector('.demo-preview')

    const constraints = {
      video: {
        height: 200,
        aspectRatio: 1,
      },
      audio: false,
    }


    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        const $video = $parent.querySelector('.demo-video')

        $video.srcObject = stream
        $video.onloadedmetadata = () => {
          $video.play()

          $preview.hidden = true
          $video.hidden = false

          window.addEventListener('popstate', () => {
            (stream.getVideoTracks()[0]).stop()

            $video.hidden = true
            $preview.hidden = false
          })
        }
      })
      .catch(error => {
        const $el = $parent.querySelector('.demo-error')

        $preview.hidden = true
        $el.innerText = error.message
        $el.hidden = false
      })
  }
})
