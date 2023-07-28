import * as THREE from 'three'
import resizeRendererToDisplaySize from "./resizeRendererToDisplaySize";

//renderer
const canvas = document.querySelector('#c')
const renderer = new THREE.WebGL1Renderer({antialias: true, canvas})

//camera
const fov = 75
const aspect = 2
const near = 0.1
const far = 1000
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 2

//scene
const scene = new THREE.Scene()

//box
const boxWidth = 1
const boxHeight = 1
const boxDepth = 1
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

const cubes = []
// images show asynchronously
const loadManager = new THREE.LoadingManager()
const loader = new THREE.TextureLoader(loadManager)

function loadColorTexture(path) {
    const texture = loader.load('https://threejs.org/manual/examples/' + path)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
}
//material
const materials = [
    new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/flower-1.jpg')}),
    new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/flower-2.jpg')}),
    new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/flower-3.jpg')}),
    new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/flower-4.jpg')}),
    new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/flower-5.jpg')}),
    new THREE.MeshBasicMaterial({map: loadColorTexture('resources/images/flower-6.jpg')}),
]
// images show asynchronously
const loadingElem = document.querySelector('#loading')
const progressBarElem = loadingElem.querySelector('.progressbar')


loadManager.onLoad = () => {

    const cube = new THREE.Mesh(geometry, materials)
    scene.add(cube)
    cubes.push(cube)
}




function render(time) {
    time *= 0.001
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
    }

    cubes.forEach((cube, ndx) => {
        const speed = .2 + ndx * .1
        const rot = time * speed
        cube.rotation.x = rot
        cube.rotation.y = rot
    })

    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

requestAnimationFrame(render)















