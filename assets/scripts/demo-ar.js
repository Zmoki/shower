
// <iframe src="/ar.html" frameborder="0" width="640" height="480" class="place"></iframe>
window.addEventListener('popstate', () => {
  const demo = ['#demo-ar']

  if (!!~demo.indexOf(document.location.hash)) {
    const $parent = document.querySelector(document.location.hash)
    const $output = $parent.querySelector('.demo-output')

    const $iframe = document.createElement('iframe')

    $iframe.frameBorder = 0
    $iframe.width = 640
    $iframe.height = 480
    $iframe.src = '/ar.html'

    $output.append($iframe)

    window.addEventListener('popstate', () => {
      $output.removeChild($iframe)
    })
  }
})
