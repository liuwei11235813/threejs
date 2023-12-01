import * as THREE  from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

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
const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );

//
const controls = new OrbitControls(camera, renderer.domElement )
controls.update()


const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // 红色
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // 绿色
    new THREE.MeshBasicMaterial({ color: 0x0000ff, side:THREE.BackSide}), // 蓝色
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // 黄色
    new THREE.MeshBasicMaterial({ color: 0x00ffff, side:THREE.BackSide}), // 青色
    new THREE.MeshBasicMaterial({ color: 0xff00ff })  // 紫色
];

const materials1 = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // 红色
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // 绿色
    new THREE.MeshBasicMaterial({ color: 0x0000ff}), // 蓝色
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // 黄色
    new THREE.MeshBasicMaterial({ color: 0x00ffff, side:THREE.BackSide }), // 青色
    new THREE.MeshBasicMaterial({ color: 0xff00ff })  // 紫色
];


const box = new THREE.Mesh(
    new THREE.BoxGeometry(4,2,1),
    materials
)
box.translateY(1)

const boxfb = box.clone()
boxfb.geometry = new THREE.BoxGeometry(2,2,1)


const box1 = boxfb.clone()
box1.translateZ(1.5)
const box2 = boxfb.clone()
box2.translateZ(-1.5)
box2.rotateY(Math.PI)

const box3 = box.clone()
box3.rotateY(Math.PI/2)
box3.translateZ(1.5)

const box4 = box.clone()
box4.rotateY(-Math.PI/2)
box4.translateZ(1.5)

scene.add(box1, box2, box3, box4)




// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
