import * as THREE  from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


// 创建一个场景
var scene = new THREE.Scene();

// 创建一个相机
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 1000, 10000);

// 创建一个渲染器
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth/2, window.innerHeight/2);
document.body.appendChild(renderer.domElement);


const axesHelper = new THREE.AxesHelper( 5000 );
scene.add( axesHelper );
const gridHelper = new THREE.GridHelper( 10000, 10000 );
// scene.add( gridHelper );

//
const controls = new OrbitControls(camera, renderer.domElement )
controls.update()






const textureLoader = new THREE.TextureLoader();
const textureA = textureLoader.load('./static/test1024x768.jpg');
const textureB = textureLoader.load('./static/test1080x1080.jpg');

const wallWidth = 5000;
const wallHeight = 3000;

// 定义纹理的实际像素大小
const textureSizeA = { width: 1024, height: 768 }; // 纹理A的像素大小
const textureSizeB = { width: 1080, height: 1080 }; // 纹理B的像素大小

// 计算纹理在墙面上需要重复的次数
const repeatXA = wallWidth / textureSizeA.width; // 纹理A横向重复次数
const repeatYA = (wallHeight / 2) / textureSizeA.height; // 纹理A纵向重复次数（占据上半部分）

const repeatXB = wallWidth / textureSizeB.width; // 纹理B横向重复次数
const repeatYB = (wallHeight / 2) / textureSizeB.height; // 纹理B纵向重复次数（占据下半部分）



// 设置纹理的重复属性
textureA.wrapS = THREE.RepeatWrapping;
textureA.wrapT = THREE.RepeatWrapping;
textureA.repeat.set(repeatXA, repeatYA);

textureB.wrapS = THREE.RepeatWrapping;
textureB.wrapT = THREE.RepeatWrapping;
textureB.repeat.set(repeatXB, repeatYB);

// 自定义着色器材质
const material = new THREE.ShaderMaterial({
    uniforms: {
        textureA: { value: textureA },
        textureB: { value: textureB }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D textureA;
        uniform sampler2D textureB;
        varying vec2 vUv;
        void main() {
            vec4 color;
            if (vUv.y > 0.5) {
                // 上半部分，使用 textureA
                vec2 uvA = vec2(vUv.x * ${repeatXA}, (vUv.y - 0.5) * ${repeatYA * 2.0});
                color = texture2D(textureA, uvA);
            } else {
                // 下半部分，使用 textureB
                vec2 uvB = vec2(vUv.x * ${repeatXB}, vUv.y * ${repeatYB * 2.0});
                color = texture2D(textureB, uvB);
            }
            gl_FragColor = color;
        }
    `,
});



// 加载一个dxf文件
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(5000, 3000, 2000),
    material
);


scene.add(mesh);


// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();