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

let textMesh
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
    textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textMesh.geometry.computeBoundingBox()
    const textCenterOffset = textMesh.geometry.boundingBox.getCenter(new THREE.Vector3()).negate();
    console.log(textCenterOffset,'PPPPPPPPP');
    textMesh.translateX(textCenterOffset.x)
    // 添加到场景
    // scene.add(textMesh)
    line.add(textMesh)

});


const labelPoints = [
    new THREE.Vector3(-3, 0 ,0), 
    new THREE.Vector3(0, 0, 0)
]
const labelGeometry = new THREE.BufferGeometry().setFromPoints(labelPoints)
const lineMaterial = new THREE.LineBasicMaterial({color: 0xff0000})
const line = new THREE.Line(labelGeometry, lineMaterial)
line.translateX(10)

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(5, 3, 1),
    new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.BackSide})
)
scene.add(cube)
cube.translateZ(-2)
cube.translateY(1.5)

cube.add(line)






const group = new THREE.Group();

const mesh1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 0xff0000})
);
const mesh2 = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
group.add(mesh1);
group.add(mesh2);
scene.add(group);


// 设置光线等...

renderer.domElement.addEventListener('pointerdown', function (event) {
    const mouse = {}
    mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1
    mouse.y = -(event.clientY  / renderer.domElement.height) * 2 + 1

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects([group], true);

    if (intersects.length > 0) {
        // 选中了 group 中的一个对象
        console.log("Hit: ", intersects[0].object);
    }

})



















// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
