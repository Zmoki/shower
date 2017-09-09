window.addEventListener('popstate', () => {
  const demo = ['#demo-canvas', '#demo-canvas-text', '#demo-canvas-image']
  const route = document.location.hash

  if (!!~demo.indexOf(route)) {
    const $parent = document.querySelector(route)
    const $preview = $parent.querySelector('.demo-preview')
    const $canvas = $parent.querySelector('.demo-canvas')

    let frameInterval
    let frameDrawed
    const constraints = {
      video: true,
      audio: false,
    }

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        const $video = document.createElement('video')

        $video.srcObject = stream
        $video.onloadedmetadata = () => {
          $video.play()

          $canvas.width = $video.videoWidth
          $canvas.height = $video.videoHeight

          const context = $canvas.getContext('2d')

          let img

          if (route === '#demo-canvas-image') {
            img = new Image()

            img.src = '//ucarecdn.com/605bbee9-71e6-4dae-b737-537c247eb48b/-/resize/x250/'
          }

          const draw = () => {
            context.drawImage($video, 0, 0)

            if (!!~['#demo-canvas-text', '#demo-canvas-image'].indexOf(route)) {
              context.fillStyle = 'red'
              context.font = '80px sans-serif'
              context.textBaseline = 'hanging'
              context.fillText('BA', 40, 40)
              context.font = '120px sans-serif'
              context.fillStyle = '#da4f66'
              context.fillText('BUMP', 40, 100)
            }
            if (route === '#demo-canvas-image' && img.complete) {
              context.drawImage(img, 400, 180, 228, 250)
            }

            frameDrawed = true
          }

          const {frameRate} = (stream.getVideoTracks()[0]).getSettings()

          frameDrawed = true
          frameInterval = setInterval(() => {
            if (!frameDrawed)
              return

            frameDrawed = false
            requestAnimationFrame(draw)
          }, Math.round(1000 / frameRate))

          $preview.hidden = true
          $canvas.hidden = false
        }

        window.addEventListener('popstate', () => {
          clearInterval(frameInterval)
          ;(stream.getVideoTracks()[0]).stop()

          $preview.hidden = false
          $canvas.hidden = true
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
