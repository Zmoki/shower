
// <iframe src="/ar.html" frameborder="0" width="640" height="480" class="place"></iframe>
window.addEventListener('popstate', () => {
  const demo = ['#demo-ascii']

  if (!!~demo.indexOf(document.location.hash)) {
    const $parent = document.querySelector(document.location.hash)
    const $output = $parent.querySelector('.demo-output')

    const $iframe = document.createElement('iframe')

    $iframe.frameBorder = 0
    $iframe.width = 1024
    $iframe.height = 600
    $iframe.src = 'https://idevelop.ro/ascii-camera/'

    $output.append($iframe)

    window.addEventListener('popstate', () => {
      $output.removeChild($iframe)
    })
  }
})
