import * as THREE  from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

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









// 创建一个立方体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// 创建一个无限长的直线
const lineGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(2 * 3); // 2个点 * 3个坐标（x, y, z）

// 设置直线的起点和终点，以使它穿过立方体的中心
const startPoint = new THREE.Vector3(-1, 0, 0);
const endPoint = new THREE.Vector3(1, 0, 0);

positions[0] = startPoint.x;
positions[1] = startPoint.y;
positions[2] = startPoint.z;

positions[3] = endPoint.x;
positions[4] = endPoint.y;
positions[5] = endPoint.z;

lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const line = new THREE.Line(lineGeometry, lineMaterial);

// 将立方体和直线添加到场景
scene.add(cube);
scene.add(line);




// 将网格对象添加到场景
// scene.add(cube);














// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
