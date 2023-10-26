import * as THREE  from 'three'
import { CSG } from 'three-csg-ts'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as math from 'mathjs'

// import { calcArea } from '../../index.js'

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
const gridHelper = new THREE.GridHelper( 20, 20 );
scene.add( gridHelper );

//
const controls = new OrbitControls(camera, renderer.domElement )
controls.update()


const cubeGeometry = new THREE.BoxGeometry(10,5,1)
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.y = 2.5

const doorGeometry = new THREE.BoxGeometry(3, 2, 2)
const doorMaterial = new THREE.MeshBasicMaterial({color: 0xff0000})
const door = new THREE.Mesh(doorGeometry, doorMaterial)

cube.add(door)
scene.add(cube)
cube.position.set(1, 2.5, 0)
door.position.set(0, 2.5, 0)
console.log(cube);

cube.updateMatrix()
door.updateMatrix()

const subRes = CSG.subtract(cube, door)
scene.add(subRes)
subRes.position.set(0, 8, 0)
console.log(subRes);


console.log('area1', calcArea(cube));
console.log('area2', calcArea(subRes));




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
  
    let area = 0
    // faceArray.forEach((ele) => {
    //     ele.forEach((_i) => {
    //         const [v1, v2, v3] = [verticesArray[_i[0]], verticesArray[_i[1]], verticesArray[_i[2]]]
    //         const a = v1.distanceTo(v2);
    //         const b = v2.distanceTo(v3);
    //         const c = v3.distanceTo(v1);

    //         const s =  math.evaluate(`(${a} + ${b} + ${c}) / 2`) ;
    //         const areaTrangle = math.format(math.sqrt(math.evaluate(`${s} * (${s} - ${a}) * (${s} - ${b}) * (${s} - ${c})`)));
    //         area = math.add(areaTrangle, area) 
    //     })
    // })

    faceArray[4].forEach((_i) => {
        const [v1, v2, v3] = [verticesArray[_i[0]], verticesArray[_i[1]], verticesArray[_i[2]]]
        const a = v1.distanceTo(v2);
        const b = v2.distanceTo(v3);
        const c = v3.distanceTo(v1);

        const s =  math.evaluate(`(${a} + ${b} + ${c}) / 2`) ;
        const areaTrangle = math.format(math.sqrt(math.evaluate(`${s} * (${s} - ${a}) * (${s} - ${b}) * (${s} - ${c})`)));
        area = math.add(areaTrangle, area) 
    })



    return area
}









// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
