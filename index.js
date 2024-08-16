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


const cubeGeometry = new THREE.BoxGeometry(5,4,2)
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube)
cube.position.set(10,0, 0)


const edgesGeometry = new THREE.EdgesGeometry(cubeGeometry)
const edgesMaterial = new THREE.LineBasicMaterial({color: 0xff0000})
const cubeLine = new THREE.LineSegments(edgesGeometry, edgesMaterial)
cube.add(cubeLine)

console.log('cube=========', cube);
let w = cube.geometry.parameters.width
console.log(w);
cubeGeometry.parameters.width = 7
console.log(w);
console.log(cubeGeometry.parameters.width);





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
mesh.rotateX(Math.PI/2)

// console.log(mesh);

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


export function calcArea(mesh) {
    const verticesOriginArray = mesh.geometry.getAttribute('position').array
    const indexArray = mesh.geometry.index.array
    const groups = mesh.geometry.groups
    // console.log(indexArray);

    const faceArray = []
    groups.forEach((ele) => {
        const temp = indexArray.slice(ele.start, ele.start+ele.count)
        const tempArrayBig = []
        for (let index = 0; index < temp.length; index+=3) {
            const tempArray = []
            tempArray.push(temp[index])
            tempArray.push(temp[index+1])
            tempArray.push(temp[index+2])
            tempArrayBig.push(tempArray)
        }
        faceArray.push(tempArrayBig)

    })
    //处理顶点
    const verticesArray = []
    for (let index = 0; index < verticesOriginArray.length; index+=3) {
        const v = new THREE.Vector3(verticesOriginArray[index], verticesOriginArray[index+1], verticesOriginArray[index+2])
        verticesArray.push(v)
    }
  
    console.log(verticesArray);
    let area = 0
    faceArray.forEach((ele) => {
        let faceArea = 0
        ele.forEach((_i) => {
            const [v1, v2, v3] = [verticesArray[_i[0]], verticesArray[_i[1]], verticesArray[_i[2]]]
            const a = v1.distanceTo(v2);
            const b = v2.distanceTo(v3);
            const c = v3.distanceTo(v1);

            const s =  math.evaluate(`(${a} + ${b} + ${c}) / 2`) ;
            const areaTrangle = math.sqrt(math.evaluate(`${s} * (${s} - ${a}) * (${s} - ${b}) * (${s} - ${c})`));
            faceArea = math.add(areaTrangle, faceArea) 
        })
        console.log(faceArea);
        area += faceArea
    })
    return math.format(area) 
}

const cubeArea = calcArea(cube)
console.log(cubeArea);



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



export function route() {
    console.log('ropute');
    window.open('./route.html')

    // 假设 cube 是你想要序列化的 Mesh 对象
    const cubeData = cube.toJSON();
    const cubeDataString = JSON.stringify(cubeData);

    localStorage.setItem('cubeData', cubeDataString);


}




// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
