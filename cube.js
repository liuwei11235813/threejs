import * as THREE  from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'



// 创建一个场景
var scene = new THREE.Scene();

// 创建一个相机
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 创建一个渲染器
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//
const controls = new OrbitControls(camera, renderer.domElement )
controls.update()


// 创建一个材质
var material = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(5, 3, 2),
    material
)

scene.add(cube)

const vertices = cube.geometry.attributes.position;
for (let i = 0; i < vertices.count; i++) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute(vertices, i);
    // 此时，vertex包含了一个顶点的x, y, z坐标
    console.log(vertex);
}




// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
