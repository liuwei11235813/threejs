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


// 顶点坐标
const vertices = new Float32Array([
    -1, 0, -2,  // 前下左
     0, 0, -1, // 前下右
     0,  3, -1,  // 前上右
    -1,  3, -2,  // 前上左
    0, 0,  -4,  // 后下左
     1, 0,  -2,  // 后下右
     1,  3,  -2,  // 后上右
    0,  3,  -4   // 后上左
  ]);
  
  // 顶点索引
  const indices = new Uint16Array([
    0, 1, 2, 0, 2, 3,  // 前面
    4, 5, 6, 4, 6, 7,  // 后面
    0, 4, 7, 0, 7, 3,  // 左侧
    1, 5, 6, 1, 6, 2,  // 右侧
    3, 2, 6, 3, 6, 7,  // 上面
    0, 1, 5, 0, 5, 4   // 下面
  ]);
  
  // 创建 BufferGeometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));

  // 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });

// 创建立方体网格对象
const cube = new THREE.Mesh(geometry, material);


const boxGeo = new THREE.BoxGeometry(3, 2, 1)
const boxMat = new THREE.MeshBasicMaterial({color: 0x0000ff})
const box = new THREE.Mesh(boxGeo, boxMat)
scene.add(box)

// box.position.set(1,1,0)
box.rotateY(Math.PI/6)

console.log(box.geometry.attributes.position.getX(0));
console.log(box.geometry.attributes.position.getY(0));
console.log(box.geometry.attributes.position.getZ(0));




// 将网格对象添加到场景
// scene.add(cube);

console.log(box);













// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
