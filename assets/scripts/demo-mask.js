window.addEventListener('popstate', () => {
  const demo = ['#demo-mask']

  if (!!~demo.indexOf(document.location.hash)) {
    const $parent = document.querySelector(document.location.hash)
    const $preview = $parent.querySelector('.demo-preview')
    const $video = $parent.querySelector('.demo-video')
    const $canvas = $parent.querySelector('.demo-canvas')
    const context = $canvas.getContext('2d')

    const tracker = new tracking.ObjectTracker("face")

    const img = new Image()

    img.src = 'https://ucarecdn.com/58fb3ffc-bcb7-4b07-a087-fdb8dd619928/-/resize/340x340/'

    tracker.setInitialScale(4)
    tracker.setStepSize(2)
    tracker.setEdgesDensity(0.1)

    tracking.track('#demo-mask .demo-video', tracker, {camera: true})

    tracker.on('track', function(event) {
      context.clearRect(0, 0, $canvas.width, $canvas.height)

      event.data.forEach(function(rect) {
        const {x, y, width, height} = rect

        try {
          if (img.complete && width)
            context.drawImage(img, x - 20, y - 50, Math.round(width) + 40, Math.round(width) + 40)
        }
        catch(e) { console.log(e)}
      })
    })

    $preview.hidden = true
    $video.hidden = false
    $canvas.hidden = false
  }
})
