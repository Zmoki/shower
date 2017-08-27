window.addEventListener('popstate', () => {
  const demo = ['#demo-filters']

  if (!!~demo.indexOf(document.location.hash)) {
    const $parent = document.querySelector(document.location.hash)
    const $preview = $parent.querySelector('.demo-preview')
    const $controls = $parent.querySelector('.demo-controls')
    const $output = $parent.querySelector('.demo-output')
    const controls = [].slice.call($parent.querySelectorAll('.demo-control'))

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
          $controls.hidden = false

          controls.forEach(control => control.onclick = (e) =>
            $video.dataset.filter = e.target.dataset.filter)

          const drawImage = () => {
            const $canvas = document.createElement('canvas')
            const context = $canvas.getContext('2d')

            $canvas.width = $video.videoWidth
            $canvas.height = $video.videoHeight

            context.filter = window.getComputedStyle($video, null).getPropertyValue('filter')
            context.drawImage($video, 0, 0)

            $canvas.toBlob(blob => {
              const $img = document.createElement('img')

              $img.src = URL.createObjectURL(blob)
              $img.onload = () => URL.revokeObjectURL($img.src)

              $output.append($img)
              $video.hidden = true
              $controls.hidden = true
              $output.hidden = false
            })
          }

          $parent.querySelector('.demo-take-photo').onclick = drawImage

          window.addEventListener('popstate', () => {
            (stream.getVideoTracks()[0]).stop()

            $video.hidden = true
            $preview.hidden = false
            $controls.hidden = true
            $output.innerHTML = ''
            $output.hidden = true
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
