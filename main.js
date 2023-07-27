import * as THREE  from 'three'

// create a scene
const scene = new THREE.Scene()
// crate a camera
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 15)
camera.position.z = 6;


const canvas = document.querySelector('#c')
const renderer = new THREE.WebGLRenderer({antialias: true, canvas})
// renderer.setSize(window.innerWidth, window.innerHeight)


// document.body.appendChild(renderer.domElement)


// add cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshPhongMaterial({color: 0x44aa88})


const light = new THREE.DirectionalLight(0x0000ff, 1)
light.position.set(-1, 2, 4)
scene.add(light)




function makeInstance(geometry, color, x) {
    const material = new THREE.MeshBasicMaterial({color})

    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    cube.position.x = x
    
    return cube
}


const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2)
]

function render(time) {
    time *= 0.001

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
    }

    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()


    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1
        const rot = time * speed
        cube.rotation.x = rot
        cube.rotation.y = rot
    })

    renderer.render(scene, camera);
    
    requestAnimationFrame(render);
}
requestAnimationFrame(render)



function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio

    const width = canvas.clientWidth * pixelRatio | 0
    const height = canvas.clientHeight * pixelRatio | 0
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
        renderer.setSize(width, height, false)
    }
    return needResize
}





// function animate() {
//     requestAnimationFrame(animate)

//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.001;
//     renderer.render(scene, camera)
// }
// animate()