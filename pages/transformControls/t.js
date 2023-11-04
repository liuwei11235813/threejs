import * as THREE  from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { BoxHelper } from 'three';

import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

// 创建一个场景
var scene = new THREE.Scene();

// 创建一个相机
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 10);

// 创建一个渲染器
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
const gridHelper = new THREE.GridHelper( 20, 20 );
scene.add( gridHelper );

//
const controls = new OrbitControls(camera, renderer.domElement )
controls.update()


const cubeGeometry = new THREE.BoxGeometry(10,5,1)
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.BackSide})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.y = 2.5


const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, .6),
    new THREE.MeshBasicMaterial({color: 0xffff00})
)
cube.add(cube1)

scene.add(cube)



// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
