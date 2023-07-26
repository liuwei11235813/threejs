import * as THREE  from 'three'

// create a scene
const scene = new THREE.Scene()
// crate a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 5)
camera.lookAt(0,0,0)

const renderer = new THREE.WebGL1Renderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


// add cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshPhongMaterial( {color: 0x44aa88} )
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const light = new THREE.DirectionalLight('0x000ff', 1)
light.position.set(-1, 2, 4)
scene.add(light)






function animate() {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.001;
    renderer.render(scene, camera)
}
animate()
