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


const loader = new FontLoader();
loader.load('./Alibaba PuHuiTi_Regular.json', function (font) {
    // 创建文字几何体
    const textGeometry = new TextGeometry('你好', {
        font: font,
        size: 1,
        height: 0,
    });
    // 创建材质
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // 创建网格
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // 添加到场景
    scene.add(textMesh);
});





// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
