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
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

cube.position.set(3.5, .5, .5)


let points = [];
points.push( new THREE.Vector3( 0, 1, 0 ) );
points.push( new THREE.Vector3( 1, 1, 2.5 ) );

let geometry = new THREE.BufferGeometry().setFromPoints( points );
let material = new THREE.LineBasicMaterial({
    color:0xff0000
});
const line = new THREE.Line(geometry, material)
scene.add(line)


const pointer1 = cube.localToWorld(new THREE.Vector3(0.5, 0.5, 0.5))
console.log(pointer1);
// 将网格对象添加到场景
scene.add(cube);



const ray2 = new THREE.Vector3()
ray2.subVectors(new THREE.Vector3(2, 1, 1), new THREE.Vector3(0, 1, 3)).normalize()
console.log(ray2);

const raycaster = new THREE.Raycaster(new THREE.Vector3(0, 1, 3), ray2);
raycaster.params.Line.threshold = 0.05 ;
const intersects = raycaster.intersectObject( line )
console.log(intersects);

















// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
