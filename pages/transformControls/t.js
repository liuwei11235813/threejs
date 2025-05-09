import * as THREE  from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { BoxHelper } from 'three';

import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

// 创建一个场景
const scene = new THREE.Scene();

// 创建一个相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 10);
const renderer = new THREE.WebGLRenderer({antialias: true});
const a = document.getElementById('a');
renderer.setSize(a.clientWidth, a.clientHeight);
a.appendChild(renderer.domElement);


const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
const gridHelper = new THREE.GridHelper( 20, 20 );
scene.add( gridHelper );

const controls = new OrbitControls(camera, renderer.domElement )
controls.update()




const camera1 = new THREE.OrthographicCamera(-20, 20, 20, -20, 0, 100);
camera1.position.set(0, 30, 10);
const renderer1 = new THREE.WebGLRenderer({antialias: true});
const b = document.getElementById('b');
renderer1.setSize(b.clientWidth, b.clientHeight);
b.appendChild(renderer1.domElement);
const controls1 = new OrbitControls(camera1, renderer1.domElement )
controls1.update()





const cubeGeometry = new THREE.BoxGeometry(10,5,1)
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc, side: THREE.BackSide})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.y = 2.5



scene.add(cube)

const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.setSize(1);
scene.add(transformControls);

transformControls.addEventListener('dragging-changed', function (event) {
    controls.enabled = !event.value;
})
transformControls.attach(cube);

const transformControls1 = new TransformControls(camera1, renderer1.domElement);
transformControls1.setSize(1);
scene.add(transformControls1);
transformControls1.addEventListener('dragging-changed', function (event) {
    controls1.enabled = !event.value;
})
transformControls1.attach(cube);


let activeTransform = transformControls; // 默认激活div 'a'的控件
transformControls1.addEventListener('mouseDown', () => {
    activeTransform = transformControls1;
    transformControls1.enabled = true;
    transformControls.enabled = false; // 禁用另一个
});
transformControls.addEventListener('mouseDown', () => {
    activeTransform = transformControls;
    transformControls1.enabled = false;
    transformControls.enabled = true;
});



// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
    renderer1.render(scene, camera1);
}
animate();
