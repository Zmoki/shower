/*
 * ASCII Camera
 * http://idevelop.github.com/ascii-camera/
 *
 * Copyright 2013, Andrei Gheorghe (http://github.com/idevelop)
 * Released under the MIT license
 */

window.addEventListener('popstate', () => {
  const demo = ['#demo-ascii']

  if (!!~demo.indexOf(document.location.hash)) {
    var asciiContainer = document.getElementById("ascii-stream");
    var capturing = false;

    camera.init({
      width: 160,
      height: 120,
      fps: 30,
      mirror: true,

      onFrame: function(canvas) {
        ascii.fromCanvas(canvas, {
          // contrast: 128,
          callback: function(asciiString) {
            asciiContainer.innerHTML = asciiString;
          }
        });
      },

      onSuccess: function() {
        document.getElementById("ascii-info").style.display = "none";

        const button = document.getElementById("ascii-button");
        button.style.display = "block";
        button.onclick = function() {
          if (capturing) {
            camera.pause();
            button.innerText = 'resume';
          } else {
            camera.start();
            button.innerText = 'pause';
          }
          capturing = !capturing;
        };
      },

      onError: function(error) {
        // TODO: log error
      },

      onNotSupported: function() {
        document.getElementById("ascii-info").style.display = "none";
        asciiContainer.style.display = "none";
        document.getElementById("ascii-notSupported").style.display = "block";
      }
    });
  }
})

