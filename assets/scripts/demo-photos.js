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
        const drawImage = () => {
          const $canvas = document.createElement('canvas')
          const width = $video.videoWidth
          const height = $video.videoHeight
          $canvas.width = width
          $canvas.height = height
          const context = $canvas.getContext('2d')
          context.drawImage($video, 0, 0, width, height)
          $canvas.toBlob(blob => {
            const $img = document.createElement('img')
            $img.src = URL.createObjectURL(blob)
            $img.title = 'drawImage'
            $img.onload = () => URL.revokeObjectURL($img.src)
            imgToResult($img)
          })
        }
        const takePhoto = () => {
          const streamTrack = stream.getVideoTracks()[0]
          const imageCapture = new ImageCapture(streamTrack)
          imageCapture.takePhoto({imageWidth: 200, imageHeight: 100})
            .then(blob => {
              const $img = document.createElement('img')
              $img.src = URL.createObjectURL(blob)
              $img.title = 'takePhoto'
              $img.onload = () => URL.revokeObjectURL(url)
              imgToResult($img)
            })
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
              $canvas.toBlob(blob => {
                const $img = document.createElement('img')
                $img.src = URL.createObjectURL(blob)
                $img.title = 'grabFrame'
                $img.onload = () => URL.revokeObjectURL($img.src)
                imgToResult($img)
              })
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
