import * as THREE  from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'



let scene, camera, renderer, controls;
let lineSegmentMesh, ellipseArcMesh;
let lineLength = 10; // 初始线段长度
let extensionR = 5;  // 初始延长距离 r

// 初始化 Three.js 场景
function init() {
    // 场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0); // 浅灰色背景

    // 摄像机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 7, 15); // 设置摄像机位置

    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threejs-container').appendChild(renderer.domElement);

    // 轨道控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 启用阻尼（惯性）
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false; // 禁用屏幕空间平移
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2; // 限制垂直旋转角度

    // 灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // 环境光
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // 方向光
    directionalLight.position.set(5, 10, 7.5).normalize();
    scene.add(directionalLight);

    // 添加辅助线（坐标轴）
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // 创建并添加初始图形
    createGeometry();

    // 监听窗口大小变化
    window.addEventListener('resize', onWindowResize);
}

// 根据参数创建线段和椭圆弧
function createGeometry() {
    // 移除旧的图形（如果存在）
    if (lineSegmentMesh) {
        scene.remove(lineSegmentMesh);
        lineSegmentMesh.geometry.dispose();
        lineSegmentMesh.material.dispose();
    }
    if (ellipseArcMesh) {
        scene.remove(ellipseArcMesh);
        ellipseArcMesh.geometry.dispose();
        ellipseArcMesh.material.dispose();
    }

    // 1. 创建水平线段
    const halfLength = lineLength / 2;
    const linePoints = [
        new THREE.Vector3(-halfLength, 0, 0), // 左端点
        new THREE.Vector3(halfLength, 0, 0)   // 右端点
    ];
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 }); // 蓝色线段
    lineSegmentMesh = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(lineSegmentMesh);

    // 2. 创建椭圆弧
    // EllipseCurve 默认以 (0,0) 为中心
    // xRadius 对应水平半轴，yRadius 对应垂直半轴
    const ellipseCurve = new THREE.EllipseCurve(
        0, 0, // 中心 x, y
        halfLength, // xRadius (半线段长度)
        extensionR, // yRadius (延长距离 r)
        0,            // startAngle (从 0 弧度开始)
        Math.PI,      // endAngle (到 PI 弧度结束，绘制上半部分)
        false,        // clockwise (逆时针)
        0             // rotation (无旋转)
    );

    // 获取曲线上的点
    const curvePoints = ellipseCurve.getPoints(50); // 获取 50 个点来近似曲线

    // 将 2D 点转换为 3D Vector3
    const arcPoints3D = curvePoints.map(p => new THREE.Vector3(p.x, p.y, 0));

    const arcGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints3D);
    const arcMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 3 }); // 红色椭圆弧
    ellipseArcMesh = new THREE.Line(arcGeometry, arcMaterial);
    scene.add(ellipseArcMesh);

    // 3. 绘制三点
    // 左端点
    const leftPointGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const leftPointMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const leftPointMesh = new THREE.Mesh(leftPointGeo, leftPointMat);
    leftPointMesh.position.set(-halfLength, 0, 0);
    scene.add(leftPointMesh);

    // 右端点
    const rightPointGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const rightPointMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const rightPointMesh = new THREE.Mesh(rightPointGeo, rightPointMat);
    rightPointMesh.position.set(halfLength, 0, 0);
    scene.add(rightPointMesh);

    // 延长点
    const topPointGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const topPointMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const topPointMesh = new THREE.Mesh(topPointGeo, topPointMat);
    topPointMesh.position.set(0, extensionR, 0);
    scene.add(topPointMesh);
}

// 窗口大小变化时更新渲染器和摄像机
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // 只有当 controls.enableDamping 设置为 true 时才需要
    renderer.render(scene, camera);
}

// 页面加载完成后初始化
window.onload = () => {
    init();
    animate();

    // 获取输入元素
    const lengthInput = document.getElementById('lineLength');
    const rInput = document.getElementById('extensionR');
    const lengthValueSpan = document.getElementById('lineLengthValue');
    const rValueSpan = document.getElementById('extensionRValue');

    // 初始化显示值
    lengthInput.value = lineLength;
    rInput.value = extensionR;
    lengthValueSpan.textContent = lineLength.toFixed(1);
    rValueSpan.textContent = extensionR.toFixed(1);


    // 监听输入变化事件
    lengthInput.addEventListener('input', (event) => {
        lineLength = parseFloat(event.target.value);
        lengthValueSpan.textContent = lineLength.toFixed(1);
        createGeometry(); // 重新创建几何体
    });

    rInput.addEventListener('input', (event) => {
        extensionR = parseFloat(event.target.value);
        rValueSpan.textContent = extensionR.toFixed(1);
        createGeometry(); // 重新创建几何体
    });
};