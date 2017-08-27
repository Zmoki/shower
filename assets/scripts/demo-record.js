window.addEventListener('popstate', () => {
  const demo = ['#demo-record']

  if (!!~demo.indexOf(document.location.hash)) {
    const $parent = document.querySelector(document.location.hash)
    const $preview = $parent.querySelector('.demo-preview')
    const $output = $parent.querySelector('.demo-output')
    const $controls = $parent.querySelector('.demo-controls')
    const $start = $parent.querySelector('.demo-control_start')
    const $stop = $parent.querySelector('.demo-control_stop')

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

          let chunks = []
          const mediaRecorder = new MediaRecorder(stream)

          $start.onclick = () => {
            mediaRecorder.start()
            $start.hidden = true
            $stop.hidden = false
          }

          $stop.onclick = () => {
            mediaRecorder.stop()
          }

          mediaRecorder.onstop = () => {
            const $recordedVideo = document.createElement('video')

            $recordedVideo.src = URL.createObjectURL(new Blob(chunks, {'type': 'video/webm'}))
            $recordedVideo.controls = true
            $recordedVideo.autoplay = true
            $recordedVideo.loop = true

            $output.append($recordedVideo)
            $output.hidden = false

            $video.hidden = true
            $stop.hidden = true
            $start.hidden = false
            $controls.hidden = true
          }

          mediaRecorder.ondataavailable = (e) => chunks.push(e.data)

          $preview.hidden = true
          $video.hidden = false
          $output.hidden = true
          $controls.hidden = false

          $output.innerHTML = ''

          window.addEventListener('popstate', () => {
            (stream.getVideoTracks()[0]).stop()

            $video.hidden = true
            $preview.hidden = false
            $controls.hidden = true
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
