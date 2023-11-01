import * as THREE  from 'three'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg';
import { CSG } from 'three-csg-ts'

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


const material = new THREE.LineBasicMaterial({
	color: 0xff0000
});

const cubeGeometry = new THREE.BoxGeometry(10,6,1)
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, transparent:true, wireframe:true})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube)
console.log(cube);

const cube1Geometry = new THREE.BoxGeometry(2,2,2)
const cubeMaterial1 = new THREE.MeshBasicMaterial({color: 0xff0000})
const cube1 = new THREE.Mesh(cube1Geometry, cubeMaterial1)
scene.add(cube1)
// cube1.position.set(5,2,0)
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

const cubeEdgesGeometry = new THREE.EdgesGeometry(cubeGeometry);
const cube1EdgesGeometry = new THREE.EdgesGeometry(cube1Geometry);

const cubeEdges = new THREE.LineSegments(cubeEdgesGeometry, edgeMaterial);
const cube1Edges = new THREE.LineSegments(cube1EdgesGeometry, edgeMaterial);
//加线框
cube.add(cubeEdges)
cube1.translateX(4)
cube1.add(cube1Edges)


cube.updateMatrix()
cube1.updateMatrix()



const subRes = CSG.subtract(cube, cube1)
scene.add(subRes)
// subRes.material.wireframe = true
subRes.translateY(-10)



//处理顶点
const geo = subRes.geometry.clone()
console.log(geo);






const vertcesArray = geo.attributes.position.array
const normals = geo.attributes.normal.array

const pointsArray = []
const normalArray = []
const vInfo = []

for (let index = 0; index < vertcesArray.length; index+=3) {
    const element0 = vertcesArray[index];
    const element1 = vertcesArray[index+1];
    const element2 = vertcesArray[index+2];
    const nelement0 = normals[index]
    const nelement1 = normals[index+1] 
    const nelement2 = normals[index+2]

    pointsArray.push(new THREE.Vector3(element0, element1, element2))
    normalArray.push(new THREE.Vector3(nelement0, nelement1, nelement2))
    const a = {point: new THREE.Vector3(element0, element1, element2), normal: new THREE.Vector3(nelement0, nelement1, nelement2) }
    vInfo.push(a)
}
console.log('vInfo', vInfo);


const rightV = []
const leftV = [] 
const upV = []
const downV = []
const forntV = []
const backV = []
vInfo.forEach((item)=>{
    if (item.normal.equals(new THREE.Vector3(1, 0, 0))) {
        rightV.push(item.point)
    }
    if (item.normal.equals(new THREE.Vector3(-1, 0, 0))) {
        leftV.push(item.point)
    }
    if (item.normal.equals(new THREE.Vector3(0, 1, 0))) {
        upV.push(item.point)
    }
    if (item.normal.equals(new THREE.Vector3(0, -1, 0))) {
        downV.push(item.point)
    }
    if (item.normal.equals(new THREE.Vector3(0, 0, 1))) {
        forntV.push(item.point)
    }
    if (item.normal.equals(new THREE.Vector3(0, 0, -1))) {
        backV.push(item.point)
    }
})

//vector3是否存在这个数组中
function vIn(v, array) {
    const res = array.some(item => item.equals(v))
    return res
}

const totalV = [rightV,leftV,upV,downV,forntV,backV]
const Vertices = []
const vMap = new Map()
function countV(v) {
    let count = 0
    totalV.forEach(arr => {
        const isIn = vIn(v, arr)
        if (isIn) {
            count++
        }
    })
    return count
}


console.log('attributes position array', pointsArray);
const pointsArrayU = pointsArray.filter((el, index, selfArr) => {
    return index == selfArr.findIndex(otherEl => el.equals(otherEl))
    //用去重后的顶点删选需要的顶点
}).filter((el)=>countV(el)==3)    
console.log('去重后的所有顶点',pointsArrayU);

const pointsUsed = pointsArrayU


//x轴相同
const frontP = pointsArrayU.filter(item=>item.z == 0.5)


const edgesss = new THREE.EdgesGeometry(subRes.geometry);
console.log('edgessssss', edgesss);
const linettt = new THREE.LineSegments( edgesss, material );
// subRes.add(linettt)
linettt.translateZ(4)

// const lg = linettt.geometry.clone()
// const lpArray = lg.attributes.position.array
// // linettt.geometry.attributes.position.array = lpArray.subarray(0,30)
// // linettt.geometry.attributes.position.count = 10

// const lgVetices = []
// for (let i = 0; i < lpArray.length; i += 3) {
//     const v = new THREE.Vector3(lpArray[i], lpArray[i+1], lpArray[i+2])
//     lgVetices.push(v);
// }
// const bigGroups = [];
// for (let i = 0; i < lgVetices.length; i += 2) {
//     bigGroups.push(lgVetices.slice(i, i + 2));
// }
// // 每组为数组，数组【0】为线段起始点  数组【1】为线段终点
// console.log(bigGroups);


// const usedArray = []
// bigGroups.forEach((ele) => {
//     const isIn0 = vIn(ele[0], pointsUsed)
//     const isIn1 = vIn(ele[1], pointsUsed)
//     if (isIn0 && isIn1) {
//         const temp = [ele[0].x,ele[0].y,ele[0].z,ele[1].x,ele[1].y,ele[1].z]
//         usedArray.push(...temp)
//     }
// })

// console.log('usedArray', usedArray);
// const floatArray = new Float32Array(usedArray);
// linettt.geometry.attributes.position.array = floatArray
// linettt.geometry.attributes.position.count = floatArray.length/3

// console.log(linettt);

let validSegments = [];

let validV = []
let validH = []

// for (let i = 0; i < frontP.length; i++) {
//     for (let j = i + 1; j < frontP.length; j++) {
//         if (i === j) continue;
//         // 检查是否为垂直线段
//         if (frontP[i].x === frontP[j].x) {
//             validSegments.push({
//                 start: frontP[i],
//                 end: frontP[j],
//                 direction: 'vertical'
//             });
//             validV.push(frontP[i], frontP[j])
//         }
//         // 检查是否为水平线段
//         else if (frontP[i].y === frontP[j].y) {
//             validSegments.push({
//                 start: frontP[i],
//                 end: frontP[j],
//                 direction: 'horizontal'
//             });
//             validH.push(frontP[i], frontP[j])
//         }
//     }
// }

for (let i = 0; i < frontP.length; i++) {
    let shortestVertical = null;
    let shortestHorizontal = null;
    for (let j = i + 1; j < frontP.length; j++) {
        if (i === j) continue;
        // 检查是否为垂直线段
        if (frontP[i].x === frontP[j].x) {
            if (!shortestVertical || frontP[i].distanceTo(frontP[j]) < frontP[i].distanceTo(shortestVertical)) {
                shortestVertical = frontP[j];
            }
        }
        // 检查是否为水平线段
        if (frontP[i].y === frontP[j].y) {
            if (!shortestHorizontal || frontP[i].distanceTo(frontP[j]) < frontP[i].distanceTo(shortestHorizontal)) {
                shortestHorizontal = frontP[j];
            }
        }
    }
    if (shortestHorizontal) {
        validH.push(frontP[i], shortestHorizontal)

        validSegments.push([frontP[i], shortestHorizontal]);
    }
    if (shortestVertical) {
        validV.push(frontP[i], shortestVertical)

        validSegments.push([frontP[i], shortestVertical]);
    }
}
console.log('validSegmentsvalidSegments', validSegments);

console.log('validVvalidV',validV);  // 打印所有有效的线段


let validZ = [];
for (let i = 0; i < pointsUsed.length; i++) {
    for (let j = i + 1; j < pointsUsed.length; j++) {
        if (pointsUsed[i].x === pointsUsed[j].x && pointsUsed[i].y === pointsUsed[j].y) {
            validZ.push(pointsUsed[i], pointsUsed[j])
        }
    }
}

// console.log('validZvalidZ', validZ);






const geometryV = new THREE.BufferGeometry().setFromPoints( validV );
const line11 = new THREE.LineSegments( geometryV, material );
subRes.add(line11)
line11.translateZ(6)
//
const line11R = line11.clone()
// subRes.add(line11R)
line11R.position.set(0, 0, -1)
line11R.translateZ(6)


const geometryH = new THREE.BufferGeometry().setFromPoints( validH );
const line22 = new THREE.LineSegments( geometryH, material );
subRes.add(line22)
line22.translateZ(6)
//
const line22R = line22.clone()
// subRes.add(line22R)
line22R.position.set(0, 0, -1)
line22R.translateZ(6)



const geometryZ = new THREE.BufferGeometry().setFromPoints( validZ );
const line33 = new THREE.LineSegments( geometryZ, material );
// subRes.add(line33)
line33.translateZ(6)







const pointMaterial = new THREE.PointsMaterial({color:0xff0000, size: .3})
// subRes.add(pointss)


// 创建线框网格对象







const point1 = new THREE.Vector3( - 10, 0, 0 )
const point2 = new THREE.Vector3( - 10, 10, 0 )
const point3 = new THREE.Vector3(   10, 10, 0 )
const point4 = new THREE.Vector3(   10, 0, 0 )
const point_1 = new THREE.Vector3( - 5, 2.5, 0 )
const point_2 = new THREE.Vector3( - 5, 7.5, 0 )
const point_3 = new THREE.Vector3(   5, 7.5, 0 )
const point_4 = new THREE.Vector3(   5, 2.5, 0 )
const points = [point1,point2, point2,point3,point3,point4,point4,point1,
     point_1,point_2, point_2,point_3,point_3,point_4,point_4,point_1
];






const geometry = new THREE.BufferGeometry().setFromPoints( points );
// console.log('testGeo', geometry);

const line = new THREE.LineSegments( geometry, material );
line.translateZ(4)
line.translateY(8)





// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
