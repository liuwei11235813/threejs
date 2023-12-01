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
// scene.add( gridHelper );

//
const controls = new OrbitControls(camera, renderer.domElement )
controls.update()



// 假设蓝色线框定义了一个边界为 x=[-1500, 1500], z=[-1500, 1500] 的区域
const clippingPlanes = [
    new THREE.Plane(new THREE.Vector3(1, 0, 0), 1),   // x = 1500的平面
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1),  // x = -1500的平面
    new THREE.Plane(new THREE.Vector3(0, 0, 1), 1),   // z = 1500的平面
    new THREE.Plane(new THREE.Vector3(0, 0, -1), 1),  // z = -1500的平面
];

// 应用到渲染器
renderer.clippingPlanes = clippingPlanes;
renderer.localClippingEnabled = true;

// 或者应用到特定材质
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    clippingPlanes: clippingPlanes,
    // ...其他材质属性
});

// 创建网格几何体
const gridGeometry = new THREE.PlaneGeometry(12, .5);
const gridMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: false,
    side: THREE.DoubleSide,
    clippingPlanes: clippingPlanes, // 应用剪裁平面到网格材质
});

const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
scene.add(gridMesh);










// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
