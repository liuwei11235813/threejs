import * as Three from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const render = new THREE.WebGL1Renderer()
render.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(render.domElement)
