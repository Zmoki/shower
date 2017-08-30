window.addEventListener('popstate', () => {
  const demo = ['#demo-photos']

  if (!!~demo.indexOf(document.location.hash)) {
    const $parent = document.querySelector(document.location.hash)
    const $preview = $parent.querySelector('.demo-preview')
    const $result = $parent.querySelector('.demo-output-result')

    const constraints = {
      video: {
        width: 200,
        height: 100,
      },
      audio: false,
    }


    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        const $video = $parent.querySelector('.demo-video')
        const imgToResult = ($img) => {
          const wrap = document.createElement('span')
          wrap.className = 'demo-img-wrap'
          wrap.title = $img.title
          wrap.append($img)
          $result.append(wrap)
        }
        const blobToImage = (blob, title) => {
          const $img = document.createElement('img')

          $img.src = URL.createObjectURL(blob)
          $img.title = title
          $img.onload = () => URL.revokeObjectURL($img.src)

          imgToResult($img)
        }
        const drawImage = () => {
          const $canvas = document.createElement('canvas')
          const context = $canvas.getContext('2d')

          $canvas.width = $video.videoWidth
          $canvas.height = $video.videoHeight

          context.drawImage($video, 0, 0)

          $canvas.toBlob(blob => blobToImage(blob, 'drawImage'))
        }
        const takePhoto = () => {
          const streamTrack = stream.getVideoTracks()[0]
          const imageCapture = new ImageCapture(streamTrack)
          imageCapture.takePhoto()
            .then(blob => blobToImage(blob, 'takePhoto'))
        }
        const grabFrame = () => {
          const streamTrack = stream.getVideoTracks()[0]
          const imageCapture = new ImageCapture(streamTrack)
          imageCapture.grabFrame()
            .then(imageBitmap => {
              const $canvas = document.createElement('canvas')
              const context = $canvas.getContext('2d')
              $canvas.width = imageBitmap.width;
              $canvas.height = imageBitmap.height;
              $canvas.getContext('2d').drawImage(imageBitmap, 0, 0)
              $canvas.toBlob(blob => blobToImage(blob, 'grabFrame'))
            })
        }

        $video.srcObject = stream
        $video.onloadedmetadata = () => {
          $video.play()
            .then(() => {
              drawImage()
              takePhoto()
              grabFrame()
            })

          $preview.hidden = true
          $video.hidden = false

          window.addEventListener('popstate', () => {
            (stream.getVideoTracks()[0]).stop()

            $video.hidden = true
            $preview.hidden = false
            $result.innerHTML = ''
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
