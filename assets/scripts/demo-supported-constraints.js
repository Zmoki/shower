const demo = '#demo-supported-constraints'

const $parent = document.querySelector(demo)
const $output = $parent.querySelector('.demo-output')

const supportedConstraints = navigator.mediaDevices.getSupportedConstraints()

for (let constraint in supportedConstraints) {
  if (supportedConstraints.hasOwnProperty(constraint)) {
    let elem = document.createElement("li");

    elem.innerHTML = "<code>" + constraint + "</code>";
    $output.appendChild(elem);
  }
}
