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
const cubeMaterial = new THREE.MeshBasicMaterial({color: 0xffff00})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
scene.add(cube)


const cube1Geometry = new THREE.BoxGeometry(2,2,2)
const cubeMaterial1 = new THREE.MeshBasicMaterial({color: 0xff0000})
const cube1 = new THREE.Mesh(cube1Geometry, cubeMaterial1)
scene.add(cube1)
// cube1.position.set(5,2,0)
const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });

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
// subRes.material.wireframe = true
scene.add(subRes)
subRes.translateY(-10)

//处理顶点
const geo = subRes.geometry.clone()
geo.index.array =  geo.index.array.subarray(30,120)

console.log(geo.index.array);

console.log('geogeo',geo);


console.log(cube.geometry);



const edges1 = new THREE.EdgesGeometry(geo);
console.log('eeeeeeeeeeeeeeeeeeeeeeee',edges1);

const vertcesArray = edges1.attributes.position.array

const pointsArray = []

for (let index = 0; index < vertcesArray.length; index+=3) {
    const element0 = vertcesArray[index];
    const element1 = vertcesArray[index+1];
    const element2 = vertcesArray[index+2];

    pointsArray.push(new THREE.Vector3(element0, element1, element2))
}



const pointsGeometry = new THREE.BufferGeometry()
// pointsGeometry.setAttribute('position', new THREE.BufferAttribute())
const pointMaterial = new THREE.PointsMaterial({color:0xff0000, size: .3})
const pointss = new THREE.Points(edges1, pointMaterial)
subRes.add(pointss)



// 创建线框网格对象
const wireframe1 = new THREE.LineSegments(edges1, edgeMaterial);
subRes.add(wireframe1)




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




function test(cube1, cube2) {
    const cube1Width = cube1.geometry.parameters.width
    const cube1Height = cube1.geometry.parameters.height
    const cube1Depth = cube1.geometry.parameters.depth
    const cube2Width = cube2.geometry.parameters.width
    const cube2Height = cube2.geometry.parameters.width
    const cube2Depth = cube2.geometry.parameters.width
    cube1_v1 = 

   console.log(111); 
}





// 创建一个材质
var material2 = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});

// 创建一个立方体几何形状
var size = 1;
var thickness = 0.1;

// 

// 创建一个立方体剖面
function createCubeFace(x, y, width, height) {
    var shape = new THREE.Shape();
    shape.moveTo(x, y);
    shape.lineTo(x + width, y);
    shape.lineTo(x + width, y + height);
    shape.lineTo(x, y + height);
    shape.lineTo(x, y);
    return shape;
}

// 创建一个挖空的立方体剖面
function createEmptyFace(x, y, width, height) {
    var shape = createCubeFace(x, y, width, height);
    var hole = createCubeFace(x + thickness, y + thickness, width - 2 * thickness, height - 2 * thickness);
    shape.holes.push(hole);
    return shape;
}

// 创建挖空立方体的六个面
var frontFace = createEmptyFace(0, 0, size, size);
var frontGeometry = new THREE.ShapeGeometry(frontFace);
var front = new THREE.Mesh(frontGeometry, material2);


front.position.set(0,8,0)
const extrudeSettings = {
	depth: 1,
    bevelSize: 0,
    bevelThickness: 0,
    bevelOffset: 0
};
const geometry2 = new THREE.ExtrudeGeometry( frontFace, extrudeSettings );
const mesh = new THREE.Mesh( geometry2, material2 ) ;
// scene.add(mesh)
mesh.translateY(2)
mesh.translateZ(-.5)

const edges2 = new THREE.EdgesGeometry(mesh.geometry);
const horTimberDMaterial2 = new THREE.LineBasicMaterial({ color: 0xff0000 });
// 创建线框网格对象
const wireframe2 = new THREE.LineSegments(edges2, horTimberDMaterial2);
// mesh.add(wireframe2)





// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();
