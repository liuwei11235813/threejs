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


const cubeGeometry = new THREE.BoxGeometry(1,1,1)
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube)
cube.position.set(10,0, 0)

// console.log(cube);




const shape = new THREE.Shape();
const x = -2.5;
const y = -5;
shape.moveTo(x + 2.5, y + 2.5);
shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);


const extrudeSettings = {
    steps: 2,  
    depth: 2,  
    bevelEnabled: true,  
    bevelThickness: 1,  
    bevelSize: 1,  
    bevelSegments: 2,  
};

const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh)

console.log(mesh);

const verticesOriginArray = mesh.geometry.attributes.position.array
const verticesArrayT = []
for (let index = 0; index < verticesOriginArray.length; index+=3) {
    verticesArrayT.push(verticesOriginArray.slice(index, index+3))
}

verticesArrayT.map((item, index, array) => {
    array[index] = new THREE.Vector3(item[0], item[1], item[2])
})

const verticesArray = []
for (let index = 0; index < verticesArrayT.length; index+=3) {
    verticesArray.push(verticesArrayT.slice(index, index+3))
}

let area = 0
verticesArray.forEach((item) => {
    const [v1, v2, v3] = [item[0], item[1], item[2]]
    const a = v1.distanceTo(v2);
    const b = v2.distanceTo(v3);
    const c = v3.distanceTo(v1);

    const s = (a + b + c) / 2;

    const areaItem = Math.sqrt(s * (s - a) * (s - b) * (s - c));

    area += areaItem
})


function calcArea(mesh) {
    const verticesOriginArray = mesh.geometry.attributes.position.array
    const verticesArrayT = []
    for (let index = 0; index < verticesOriginArray.length; index+=3) {
        verticesArrayT.push(verticesOriginArray.slice(index, index+3))
    }
    console.log(verticesArrayT);


    verticesArrayT.map((item, index, array) => {
        array[index] = new THREE.Vector3(item[0], item[1], item[2])
    })
    const verticesArray = []
    for (let index = 0; index < verticesArrayT.length; index+=3) {
        verticesArray.push(verticesArrayT.slice(index, index+3))
    }
    console.log(verticesArray);
    let area = 0
    verticesArray.forEach((item) => {
        const [v1, v2, v3] = [item[0], item[1], item[2]]
        const a = v1.distanceTo(v2);
        const b = v2.distanceTo(v3);
        const c = v3.distanceTo(v1);
        console.log('==============',a,b,c);

        const s = (a + b + c) / 2;

        const areaItem = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        console.log('areaItem',areaItem);

        area += areaItem
    })
    return area
}

const cubeArea = calcArea(cube)
console.log(cubeArea);














// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
