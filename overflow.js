import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ClippingGroup } from 'three/src/objects/ClippingGroup.js';

// 1. 初始化场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100); // 调整近远裁剪面
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 确保渲染器启用局部裁剪
renderer.localClippingEnabled = true;

// 2. 创建 ClippingGroup
const clippingGroup = new ClippingGroup();
// 可选：设置 clipIntersection 为 true，如果你想裁剪掉平面之外的所有区域，而不是交集之外的。
clippingGroup.clipIntersection = false; // 默认是 false，即裁剪掉所有平面"外部"的部分

// 3. 定义长方形裁剪平面 (世界坐标)
const xMin = 1.0;
const xMax = 1.0;
const yMin = 0.8;
const yMax = 0.8;

const clipPlanes = [
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), xMin), 
    new THREE.Plane(new THREE.Vector3(1, 0, 0), xMax), 
    new THREE.Plane(new THREE.Vector3(0, -1, 0), yMin), 
    new THREE.Plane(new THREE.Vector3(0, 1, 0), yMax) 
];
clippingGroup.clippingPlanes = clipPlanes;
clippingGroup.clipShadows = true; // 如果需要裁剪阴影

// 4. 添加需要被裁剪的对象到 clippingGroup
const cubeGeometry = new THREE.BoxGeometry(3, 3, 3);
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
    polygonOffset: true,
    polygonOffsetFactor: 0.1,
    polygonOffsetUnits: 1,
    // clippingPlanes: clipPlanes,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
clippingGroup.add(cube); // 将立方体添加到裁剪组



// 5. 将裁剪组添加到场景
scene.add(clippingGroup);

const cube1 = cube.clone();
cube1.position.set(0, 3.3, 0);
scene.add(cube1)


const plane1 = new THREE.Plane(new THREE.Vector3(1, 0, 0), 1);
const plane1Helper = new THREE.PlaneHelper(plane1, 10, 0xffff00);
scene.add(
    plane1Helper
)

// 添加光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 15, 5).normalize();
scene.add(directionalLight);





camera.position.z = 5;
// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
// 动画循环
function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}
animate();


