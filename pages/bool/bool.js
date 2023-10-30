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


const cubeGeometry = new THREE.BoxGeometry(10,6,1)
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe:true, transparent:true})
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
const vGroup = geo.groups
console.log(vGroup[0]);






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
vInfo.forEach((item)=>{
    if (item.normal.equals(new THREE.Vector3(1, 0, 0))) {
        rightV.push(item.point)
    }
})

console.log('rightVrightVrightV',rightV);



const pg1 = pointsArray.slice(vGroup[0].start, vGroup[0].count)
console.log(pg1);







const pointsGeometry = new THREE.BufferGeometry()
const edges1 = new THREE.EdgesGeometry(geo);
const pointMaterial = new THREE.PointsMaterial({color:0xff0000, size: .3})
const pointss = new THREE.Points(edges1, pointMaterial)
// subRes.add(pointss)



function drawPoints(points) {
    const pointMaterial = new THREE.PointsMaterial({color:0xff0000, size: .3})
    const pointss = new THREE.Points(points, pointMaterial)
    subRes.add(pointss)
}
function drawLine(points) {
    const geometry = new THREE.BufferGeometry().setFromPoints( points.slice(0,18) );
    const wireframe1 = new THREE.LineSegments(geometry, edgeMaterial);
    subRes.add(wireframe1)
}
geo.attributes.position.array = geo.attributes.position.array.subarray(0,54)
geo.attributes.position.count = 18


// drawPoints(geo)
// drawLine(pointsArray)
// 创建线框网格对象





const material = new THREE.LineBasicMaterial({
	color: 0xffffff
});

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
scene.add( line );






// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
