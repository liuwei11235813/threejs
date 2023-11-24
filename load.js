import * as THREE  from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as math from 'mathjs'

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


const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0xff0000})
)

scene.add(mesh)


const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry)
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const edges = new THREE.LineSegments(edgesGeometry, lineMaterial);
mesh.add(edges)

setTimeout(function () {
    const data = mesh.toJSON()

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    a.click();
    URL.revokeObjectURL(url);
},2000)






export function saveScene() {
    
    const sceneJSON = JSON.stringify(scene.toJSON());
    localStorage.setItem('myScene', sceneJSON);
}

export function loadScene() {
    // 从 localStorage 读取场景 JSON 字符串
    const sceneJSON = localStorage.getItem('myScene');

    if (sceneJSON) {
        // 解析 JSON 字符串
        const json = JSON.parse(sceneJSON);

        // 使用 ObjectLoader
        const loader = new THREE.ObjectLoader();
        const loadedScene = loader.parse(json);

        return loadedScene
    }
}










// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
