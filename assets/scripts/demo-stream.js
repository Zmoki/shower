window.addEventListener('popstate', () => {
  const demo = ['#demo-stream', '#demo-stream-filter']

  if (!!~demo.indexOf(document.location.hash)) {
    const $parent = document.querySelector(document.location.hash)
    const $preview = $parent.querySelector('.demo-preview')

    const constraints = {
      video: true,
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
        }

        window.addEventListener('popstate', () => {
          (stream.getVideoTracks()[0]).stop()

          $preview.hidden = false
          $video.hidden = true
        })
      })
      .catch(error => {
        const $el = $parent.querySelector('.demo-error')

        $preview.hidden = true
        $el.innerText = error.message
        $el.hidden = false
      })
  }
})
