window.addEventListener('popstate', () => {
  const demo = ['#demo-canvas']

  if (!!~demo.indexOf(document.location.hash)) {
    const $parent = document.querySelector(document.location.hash)
    const $preview = $parent.querySelector('.demo-preview')

    const constraints = {
      video: true,
      audio: false,
    }


    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        const streamVideoTrack = stream.getVideoTracks()[0]
        const {width, height} = streamVideoTrack.getSettings()
        const $video = document.createElement('video')
        const $canvas = $parent.querySelector('.demo-canvas')
        const context = $canvas.getContext('2d')
        const draw = () => {
          requestAnimationFrame(draw)
          context.drawImage($video, 0, 0, width, height)
        }

        $canvas.width = width
        $canvas.height = height

        $video.src = URL.createObjectURL(stream)
        $video.play()

        requestAnimationFrame(draw)

        $preview.hidden = true
        $canvas.hidden = false
        $parent.querySelector('.demo-notice').hidden = false
      })
      .catch(error => {
        const $el = $parent.querySelector('.demo-error')

        $preview.hidden = true
        $el.innerText = error.message
        $el.hidden = false
      })
  }
})
