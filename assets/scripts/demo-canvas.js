window.addEventListener('popstate', () => {
  const demo = ['#demo-canvas', '#demo-canvas-text', '#demo-canvas-image']
  const route = document.location.hash

  if (!!~demo.indexOf(route)) {
    const $parent = document.querySelector(route)
    const $preview = $parent.querySelector('.demo-preview')

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

          const $canvas = $parent.querySelector('.demo-canvas')

          $canvas.width = $video.videoWidth
          $canvas.height = $video.videoHeight

          const context = $canvas.getContext('2d')

          let img

          if (route === '#demo-canvas-image') {
            img = new Image()

            img.src = 'https://ucarecdn.com/f39dbbf9-e728-47c8-a1d4-81e21a070935/-/crop/250x300/center/'
          }

          const draw = () => {
            context.drawImage($video, 0, 0)

            if (!!~['#demo-canvas-text', '#demo-canvas-image'].indexOf(route)) {
              context.fillStyle = 'white'
              context.font = '80px sans-serif'
              context.textBaseline = 'hanging'
              context.fillText('wow', 40, 40)
              context.fillStyle = '#ffd800'
              context.fillText('such text', 300, 300)
            }
            if (route === '#demo-canvas-image' && img.complete) {
              context.drawImage(img, 80, 80, 250, 300)
            }

            requestAnimationFrame(draw)
          }

          requestAnimationFrame(draw)

          $preview.hidden = true
          $canvas.hidden = false
        }

        window.addEventListener('popstate', () => {
          (stream.getVideoTracks()[0]).stop()

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
