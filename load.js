import * as THREE  from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as math from 'mathjs'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
    new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: .5})
)

// scene.add(mesh)
mesh.visible= false


const mesh1 = new THREE.Mesh(
    new THREE.BoxGeometry(.5,.5,.5),
    new THREE.MeshBasicMaterial({color: 0xffff00})
)
mesh.add(mesh1)
mesh1.userData.isHidden  = true
mesh1.visible = false


// const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry)
// const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
// const edges = new THREE.LineSegments(edgesGeometry, lineMaterial);
// mesh.add(edges)













export function saveScene() {
    const data = scene.toJSON()

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    a.click();
    URL.revokeObjectURL(url);
}


// 可选：自定义导出选项
const options = {
    // 例如，包含或排除特定对象
};
export function saveSceneGLTF() {
    const exporter = new GLTFExporter();

    // 导出场景或对象
    exporter.parse(mesh, function (gltf) {
        // 处理导出的GLTF数据
        console.log(gltf);
        const output = JSON.stringify(gltf, null, 2);
        downloadJSON(output, 'scene.gltf');
    }, options);
}
// // 助手函数来下载JSON文件
function downloadJSON(content, fileName) {
    const blob = new Blob([content], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.download = fileName;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.click();
    window.URL.revokeObjectURL(anchor.href);
}

export function loadGLTF(url) {
    const loader = new GLTFLoader();
    loader.load(
        url,
        function (gltf) {
            // 添加到场景中
            gltf.scene.traverse((object) => {
                if (object.userData.isHidden) {
                    console.log('888888');
                    object.visible = false;
                }
            });

            console.log(gltf.scene);
            scene.add(gltf.scene)
        },
        undefined,
        function (error) {
            console.error('An error happened:', error);
        }
    );
}




export function createSceneFromJSON(jsonString) {
    const json = JSON.parse(jsonString);

    const loader = new THREE.ObjectLoader();

    const newScene = loader.parse(json, function (object) {
        if (object instanceof THREE.LineSegments) {
        }
    });
    console.log('createSceneFromJSON',newScene);

    scene = newScene

}





// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
