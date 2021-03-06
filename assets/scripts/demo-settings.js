window.addEventListener('popstate', () => {
  const demo = '#demo-settings'

  if (document.location.hash === demo) {
    const $parent = document.querySelector(demo)
    const $preview = $parent.querySelector('.demo-preview')

    const constraints = {
      video: {
        height: 360,
        aspectRatio: 4 /3,
        facingMode: 'environment'
      },
      audio: false,
    }


    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        const $notice = $parent.querySelector('.demo-notice')
        const $video = $parent.querySelector('.demo-video')
        const streamVideoTrack = stream.getVideoTracks()[0]

        $video.srcObject = stream
        $video.onloadedmetadata = () => {
          $video.play()

          const capabilities = streamVideoTrack.getCapabilities()
          const settings = streamVideoTrack.getSettings()

          if (Object.keys(capabilities).length) {
            if (capabilities.torch) {
              const $torch = $parent.querySelector('.demo-torch')

              $torch.hidden = false
              $torch.onclick = () => {
                const currentTorch = (streamVideoTrack.getSettings()).torch

                streamVideoTrack.applyConstraints({advanced: [{torch: !currentTorch}]})
              }
            }

            if (capabilities.zoom) {
              const $zoom = $parent.querySelector('.demo-zoom')
              const {min, max, step} = capabilities.zoom
              const value = settings.zoom

              $zoom.hidden = false
              $zoom.min = min
              $zoom.max = max
              $zoom.step = step
              $zoom.value = value
              $zoom.onchange = () => streamVideoTrack.applyConstraints({advanced: [{zoom: $zoom.value}]})
            }

            $notice.hidden = true
          }
          else {
            $notice.innerHTML = `${streamVideoTrack.label} has <b>no settings</b>`
            $notice.hidden = false
          }

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
