import { DxfParser } from 'dxf-parser';


import * as THREE  from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'


// 创建一个场景
var scene = new THREE.Scene();

// 创建一个相机
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 1000, 1000);

// 创建一个渲染器
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth/2, window.innerHeight/2);
document.body.appendChild(renderer.domElement);


const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
const gridHelper = new THREE.GridHelper( 10, 10 );
scene.add( gridHelper );

//
const controls = new OrbitControls(camera, renderer.domElement )
controls.update()





// 加载一个dxf文件
const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);


scene.add(mesh);










// 创建一个渲染循环
function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render(scene, camera);
}
animate();






document.getElementById('upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const fileText = e.target.result;

        const parser = new DxfParser();
        try {
            const dxf = parser.parseSync(fileText);
            console.log(dxf); // 处理解析后的数据
            const group = new THREE.Group();

            dxf.entities.forEach(entity => {
                if (entity.type === 'LINE' || entity.type === 'LWPOLYLINE') {
                    
                    const color = decimalToHexColor(entity.color);

                    const vertices = [...entity.vertices];
                    if (entity.shape) {
                        vertices.push(vertices[0]);
                    }

                    const line = createLineFromVertices(vertices, color);
                    
                    group.add(line);
                } else if (entity.type === 'ARC') {
                    const center = new THREE.Vector3().copy(entity.center);
                    const radius = entity.radius;
                    const startAngle = entity.startAngle; // 以弧度为单位
                    const endAngle = entity.endAngle;
                    const color = decimalToHexColor(entity.color); // 16776960 转换为 0xFFFF00
            
                    // 创建材质
                    const material = new THREE.LineBasicMaterial({ color: color });
            
                    // 创建椭圆曲线 (实际上是圆弧的一部分)
                    const arcCurve = new THREE.EllipseCurve(
                        center.x, center.y,  // 圆心位置
                        radius, radius,      // X轴和Y轴半径相同
                        startAngle, endAngle,// 起始角度和结束角度
                        false,                // 顺时针绘制
                        0                    // 无旋转
                    );
            
                    // 获取曲线的点
                    const points = arcCurve.getPoints(50); // 可以根据需要调整点的数量
            
                    // 创建几何体并将其与材质结合
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const arcLine = new THREE.Line(geometry, material);
                    material.dispose();
            
                    group.add(arcLine);
                }
            
            
            
            
            });


            scene.add(group);


            
        } catch (err) {
            console.error("Error parsing the DXF file:", err.stack);
        }
    };
    
    reader.readAsText(file);
});


const obj = {
    "header": {
        "$ACADVER": "AC1032",
        "$ACADMAINTVER": 155,
        "$DWGCODEPAGE": "ANSI_936",
        "$LASTSAVEDBY": "12993",
        "$REQUIREDVERSIONS": 0,
        "$INSBASE": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$EXTMIN": {
            "x": 300,
            "y": -1865.286514794998,
            "z": 0
        },
        "$EXTMAX": {
            "x": 21230.85868163172,
            "y": 9750,
            "z": 0
        },
        "$LIMMIN": {
            "x": 0,
            "y": 0
        },
        "$LIMMAX": {
            "x": 420,
            "y": 297
        },
        "$ORTHOMODE": 0,
        "$REGENMODE": 1,
        "$FILLMODE": 1,
        "$QTEXTMODE": 0,
        "$MIRRTEXT": 1,
        "$LTSCALE": 1,
        "$ATTMODE": 1,
        "$TEXTSIZE": 2.5,
        "$TRACEWID": 1,
        "$TEXTSTYLE": "Standard",
        "$CLAYER": "0",
        "$CELTYPE": "ByLayer",
        "$CECOLOR": 256,
        "$CELTSCALE": 1,
        "$DISPSILH": 0,
        "$DIMSCALE": 20,
        "$DIMASZ": 2.5,
        "$DIMEXO": 0.625,
        "$DIMDLI": 3.75,
        "$DIMRND": 0,
        "$DIMDLE": 0,
        "$DIMEXE": 1.25,
        "$DIMTP": 0,
        "$DIMTM": 0,
        "$DIMTXT": 2.5,
        "$DIMCEN": 2.5,
        "$DIMTSZ": 0,
        "$DIMTOL": 0,
        "$DIMLIM": 0,
        "$DIMTIH": 0,
        "$DIMTOH": 0,
        "$DIMSE1": 0,
        "$DIMSE2": 0,
        "$DIMTAD": 1,
        "$DIMZIN": 8,
        "$DIMTOFFSET": 1,
        "$DIMBLK": "",
        "$DIMASO": 1,
        "$DIMSHO": 1,
        "$DIMPOST": "",
        "$DIMAPOST": "",
        "$DIMALT": 0,
        "$DIMALTD": 3,
        "$DIMALTF": 0.03937007874016,
        "$DIMLFAC": 1,
        "$DIMTOFL": 1,
        "$DIMTVP": 0,
        "$DIMTIX": 0,
        "$DIMSOXD": 0,
        "$DIMSAH": 0,
        "$DIMBLK1": "",
        "$DIMBLK2": "",
        "$DIMSTYLE": "ISO-25",
        "$DIMCLRD": 0,
        "$DIMCLRE": 0,
        "$DIMCLRT": 0,
        "$DIMTFAC": 1,
        "$DIMGAP": 0.625,
        "$DIMJUST": 0,
        "$DIMSD1": 0,
        "$DIMSD2": 0,
        "$DIMTOLJ": 0,
        "$DIMTZIN": 8,
        "$DIMALTZ": 0,
        "$DIMALTTZ": 0,
        "$DIMUPT": 0,
        "$DIMDEC": 2,
        "$DIMTDEC": 2,
        "$DIMALTU": 2,
        "$DIMALTTD": 3,
        "$DIMTXSTY": "Standard",
        "$DIMAUNIT": 0,
        "$DIMADEC": 0,
        "$DIMALTRND": 0,
        "$DIMAZIN": 0,
        "$DIMDSEP": 44,
        "$DIMATFIT": 3,
        "$DIMFRAC": 0,
        "$DIMLDRBLK": "",
        "$DIMLUNIT": 2,
        "$DIMLWD": -2,
        "$DIMLWE": -2,
        "$DIMTMOVE": 0,
        "$DIMFXL": 1,
        "$DIMFXLON": 0,
        "$DIMJOGANG": 0.7853981633974483,
        "$DIMTFILL": 0,
        "$DIMTFILLCLR": 0,
        "$DIMARCSYM": 0,
        "$DIMLTYPE": "",
        "$DIMLTEX1": "",
        "$DIMLTEX2": "",
        "$DIMTXTDIRECTION": 0,
        "$LUNITS": 2,
        "$LUPREC": 4,
        "$SKETCHINC": 1,
        "$FILLETRAD": 0,
        "$AUNITS": 0,
        "$AUPREC": 0,
        "$MENU": ".",
        "$ELEVATION": 0,
        "$PELEVATION": 0,
        "$THICKNESS": 0,
        "$LIMCHECK": 0,
        "$CHAMFERA": 10,
        "$CHAMFERB": 10,
        "$CHAMFERC": 20,
        "$CHAMFERD": 0,
        "$SKPOLY": 0,
        "$TDCREATE": 2452535.536567268,
        "$TDUCREATE": 2452535.203233935,
        "$TDUPDATE": 2460538.654551123,
        "$TDUUPDATE": 2460538.321217789,
        "$TDINDWG": 0.0447636227,
        "$TDUSRTIMER": 0.0447633102,
        "$USRTIMER": 1,
        "$ANGBASE": 0,
        "$ANGDIR": 0,
        "$PDMODE": 0,
        "$PDSIZE": 0,
        "$PLINEWID": 0,
        "$SPLFRAME": 0,
        "$SPLINETYPE": 6,
        "$SPLINESEGS": 8,
        "$HANDSEED": "1731",
        "$SURFTAB1": 6,
        "$SURFTAB2": 6,
        "$SURFTYPE": 6,
        "$SURFU": 6,
        "$SURFV": 6,
        "$UCSBASE": "",
        "$UCSNAME": "",
        "$UCSORG": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$UCSXDIR": {
            "x": 1,
            "y": 0,
            "z": 0
        },
        "$UCSYDIR": {
            "x": 0,
            "y": 1,
            "z": 0
        },
        "$UCSORTHOREF": "",
        "$UCSORTHOVIEW": 0,
        "$UCSORGTOP": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$UCSORGBOTTOM": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$UCSORGLEFT": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$UCSORGRIGHT": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$UCSORGFRONT": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$UCSORGBACK": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$PUCSBASE": "",
        "$PUCSNAME": "",
        "$PUCSORG": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$PUCSXDIR": {
            "x": 1,
            "y": 0,
            "z": 0
        },
        "$PUCSYDIR": {
            "x": 0,
            "y": 1,
            "z": 0
        },
        "$PUCSORTHOREF": "",
        "$PUCSORTHOVIEW": 0,
        "$PUCSORGTOP": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$PUCSORGBOTTOM": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$PUCSORGLEFT": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$PUCSORGRIGHT": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$PUCSORGFRONT": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$PUCSORGBACK": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$USERI1": 0,
        "$USERI2": 0,
        "$USERI3": 0,
        "$USERI4": 0,
        "$USERI5": 0,
        "$USERR1": 0,
        "$USERR2": 0,
        "$USERR3": 0,
        "$USERR4": 0,
        "$USERR5": 0,
        "$WORLDVIEW": 1,
        "$SHADEDGE": 3,
        "$SHADEDIF": 70,
        "$TILEMODE": 1,
        "$MAXACTVP": 64,
        "$PINSBASE": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "$PLIMCHECK": 0,
        "$PEXTMIN": {
            "x": 100000000000000000000,
            "y": 100000000000000000000,
            "z": 100000000000000000000
        },
        "$PEXTMAX": {
            "x": -100000000000000000000,
            "y": -100000000000000000000,
            "z": -100000000000000000000
        },
        "$PLIMMIN": {
            "x": 0,
            "y": 0
        },
        "$PLIMMAX": {
            "x": 420,
            "y": 297
        },
        "$UNITMODE": 0,
        "$VISRETAIN": 1,
        "$PLINEGEN": 0,
        "$PSLTSCALE": 1,
        "$TREEDEPTH": 3020,
        "$CMLSTYLE": "Standard",
        "$CMLJUST": 0,
        "$CMLSCALE": 20,
        "$PROXYGRAPHICS": 1,
        "$MEASUREMENT": 1,
        "$CELWEIGHT": -1,
        "$ENDCAPS": 0,
        "$JOINSTYLE": 0,
        "$LWDISPLAY": false,
        "$INSUNITS": 4,
        "$HYPERLINKBASE": "",
        "$STYLESHEET": "",
        "$XEDIT": true,
        "$CEPSNTYPE": 0,
        "$PSTYLEMODE": true,
        "$FINGERPRINTGUID": "{FDEAD578-A652-11D2-9A35-0060089B3A3F}",
        "$VERSIONGUID": "{487CC7A6-D970-A24E-835E-55F9CB967B71}",
        "$EXTNAMES": true,
        "$PSVPSCALE": 0,
        "$OLESTARTUP": false,
        "$SORTENTS": 127,
        "$INDEXCTL": 0,
        "$HIDETEXT": 0,
        "$XCLIPFRAME": 2,
        "$HALOGAP": 0,
        "$OBSCOLOR": 257,
        "$OBSLTYPE": 0,
        "$INTERSECTIONDISPLAY": 0,
        "$INTERSECTIONCOLOR": 257,
        "$DIMASSOC": 1,
        "$PROJECTNAME": "",
        "$CAMERADISPLAY": false,
        "$LENSLENGTH": 50,
        "$CAMERAHEIGHT": 0,
        "$STEPSPERSEC": 2,
        "$STEPSIZE": 6,
        "$3DDWFPREC": 2,
        "$PSOLWIDTH": 0.25,
        "$PSOLHEIGHT": 4,
        "$LOFTANG1": 1.570796326794897,
        "$LOFTANG2": 1.570796326794897,
        "$LOFTMAG1": 0,
        "$LOFTMAG2": 0,
        "$LOFTPARAM": 7,
        "$LOFTNORMALS": 1,
        "$LATITUDE": 37.795,
        "$LONGITUDE": -122.394,
        "$NORTHDIRECTION": 0,
        "$TIMEZONE": -8000,
        "$LIGHTGLYPHDISPLAY": 1,
        "$TILEMODELIGHTSYNCH": 1,
        "$CMATERIAL": "965",
        "$SOLIDHIST": 0,
        "$SHOWHIST": 1,
        "$DWFFRAME": 2,
        "$DGNFRAME": 0,
        "$REALWORLDSCALE": true,
        "$INTERFERECOLOR": 1,
        "$INTERFEREOBJVS": "972",
        "$INTERFEREVPVS": "10AF",
        "$CSHADOW": 0,
        "$SHADOWPLANELOCATION": 0
    },
    "tables": {
        "viewPort": {
            "handle": "8",
            "ownerHandle": "0",
            "viewPorts": [
                {
                    "ownerHandle": "8",
                    "name": "*Active",
                    "lowerLeftCorner": {
                        "x": 0,
                        "y": 0
                    },
                    "upperRightCorner": {
                        "x": 1,
                        "y": 1
                    },
                    "center": {
                        "x": 11724.0984611888,
                        "y": 2078.401000115452
                    },
                    "snapBasePoint": {
                        "x": 0,
                        "y": 0
                    },
                    "snapSpacing": {
                        "x": 10,
                        "y": 10
                    },
                    "gridSpacing": {
                        "x": 10,
                        "y": 10
                    },
                    "viewDirectionFromTarget": {
                        "x": 0,
                        "y": 0,
                        "z": 1
                    },
                    "viewTarget": {
                        "x": 0,
                        "y": 0,
                        "z": 0
                    },
                    "lensLength": 50,
                    "frontClippingPlane": 0,
                    "backClippingPlane": 0,
                    "snapRotationAngle": 0,
                    "viewTwistAngle": 0,
                    "renderMode": 0,
                    "ucsOrigin": {
                        "x": 0,
                        "y": 0,
                        "z": 0
                    },
                    "ucsXAxis": {
                        "x": 1,
                        "y": 0,
                        "z": 0
                    },
                    "ucsYAxis": {
                        "x": 0,
                        "y": 1,
                        "z": 0
                    },
                    "orthographicType": 0,
                    "defaultLightingOn": true,
                    "ambientColor": 3355443
                }
            ]
        },
        "lineType": {
            "handle": "5",
            "ownerHandle": "0",
            "lineTypes": {
                "ByBlock": {
                    "name": "ByBlock",
                    "description": "",
                    "patternLength": 0
                },
                "ByLayer": {
                    "name": "ByLayer",
                    "description": "",
                    "patternLength": 0
                },
                "Continuous": {
                    "name": "Continuous",
                    "description": "Solid line",
                    "patternLength": 0
                }
            }
        },
        "layer": {
            "handle": "2",
            "ownerHandle": "0",
            "layers": {
                "0": {
                    "name": "0",
                    "frozen": false,
                    "visible": true,
                    "colorIndex": 7,
                    "color": 16777215
                },
                "AD2": {
                    "name": "AD2",
                    "frozen": true,
                    "visible": true,
                    "colorIndex": 3,
                    "color": 65280
                }
            }
        }
    },
    "blocks": {
        "*Model_Space": {
            "handle": "20",
            "ownerHandle": "1F",
            "layer": "0",
            "name": "*Model_Space",
            "position": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "name2": "*Model_Space",
            "xrefPath": ""
        },
        "*Paper_Space": {
            "handle": "1C",
            "ownerHandle": "1B",
            "paperSpace": true,
            "layer": "0",
            "name": "*Paper_Space",
            "position": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "name2": "*Paper_Space",
            "xrefPath": ""
        },
        "*Paper_Space0": {
            "handle": "24",
            "ownerHandle": "23",
            "layer": "0",
            "name": "*Paper_Space0",
            "position": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "name2": "*Paper_Space0",
            "xrefPath": ""
        },
        "_OBLIQUE": {
            "handle": "941",
            "ownerHandle": "93F",
            "layer": "0",
            "name": "_OBLIQUE",
            "position": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "name2": "_OBLIQUE",
            "xrefPath": "",
            "entities": [
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": -0.5,
                            "y": -0.5,
                            "z": 0
                        },
                        {
                            "x": 0.5,
                            "y": 0.5,
                            "z": 0
                        }
                    ],
                    "handle": "940",
                    "ownerHandle": "93F",
                    "layer": "0",
                    "lineType": "ByBlock",
                    "colorIndex": 0,
                    "color": 0,
                    "lineweight": -1
                }
            ]
        },
        "A$C468B1B28": {
            "handle": "95D",
            "ownerHandle": "955",
            "layer": "0",
            "name": "A$C468B1B28",
            "position": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "name2": "A$C468B1B28",
            "xrefPath": "",
            "entities": [
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 346.2131647456845,
                            "y": 52.88808663539385,
                            "z": 0
                        },
                        {
                            "x": 1049.279295531916,
                            "y": 52.88808663539385,
                            "z": 0
                        }
                    ],
                    "handle": "956",
                    "ownerHandle": "955",
                    "layer": "AD2",
                    "lineType": "Continuous",
                    "colorIndex": 3,
                    "color": 65280
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": -0.0000280066033156,
                            "y": 39.99998108922591,
                            "z": 0
                        },
                        {
                            "x": 99.99997199339668,
                            "y": 39.99998108922591,
                            "z": 0
                        }
                    ],
                    "handle": "957",
                    "ownerHandle": "955",
                    "layer": "AD2",
                    "lineType": "Continuous",
                    "colorIndex": 3,
                    "color": 65280
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": -0.0000280066033156,
                            "y": -0.000018910774088,
                            "z": 0
                        },
                        {
                            "x": 99.99997199339668,
                            "y": -0.000018910774088,
                            "z": 0
                        }
                    ],
                    "handle": "958",
                    "ownerHandle": "955",
                    "layer": "AD2",
                    "lineType": "Continuous",
                    "colorIndex": 3,
                    "color": 65280
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 99.99997199339668,
                            "y": 39.99998108922591,
                            "z": 0
                        },
                        {
                            "x": 99.99997199339668,
                            "y": -0.000018910774088,
                            "z": 0
                        }
                    ],
                    "handle": "959",
                    "ownerHandle": "955",
                    "layer": "AD2",
                    "lineType": "Continuous",
                    "colorIndex": 3,
                    "color": 65280
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 799.9999719933967,
                            "y": 39.99998108922591,
                            "z": 0
                        },
                        {
                            "x": 1799.999971993399,
                            "y": 39.99998108922591,
                            "z": 0
                        }
                    ],
                    "handle": "95A",
                    "ownerHandle": "955",
                    "layer": "AD2",
                    "lineType": "Continuous",
                    "colorIndex": 3,
                    "color": 65280
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 799.9999719933967,
                            "y": -0.000018910774088,
                            "z": 0
                        },
                        {
                            "x": 1799.999971993399,
                            "y": -0.000018910774088,
                            "z": 0
                        }
                    ],
                    "handle": "95B",
                    "ownerHandle": "955",
                    "layer": "AD2",
                    "lineType": "Continuous",
                    "colorIndex": 3,
                    "color": 65280
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 799.9999719933967,
                            "y": 39.99998108922591,
                            "z": 0
                        },
                        {
                            "x": 799.9999719933967,
                            "y": -0.000018910774088,
                            "z": 0
                        }
                    ],
                    "handle": "95C",
                    "ownerHandle": "955",
                    "layer": "AD2",
                    "lineType": "Continuous",
                    "colorIndex": 3,
                    "color": 65280
                }
            ]
        },
        "一层平面图": {
            "handle": "1668",
            "ownerHandle": "1667",
            "layer": "0",
            "name": "一层平面图",
            "position": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "name2": "一层平面图",
            "xrefPath": "",
            "entities": [
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 4139.110079743725,
                            "y": -12258.05438589118
                        },
                        {
                            "x": 5074.110079743725,
                            "y": -12258.05438589118
                        }
                    ],
                    "handle": "1669",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 7474.110079743725,
                            "y": -12258.05438589118
                        },
                        {
                            "x": 8499.110079743725,
                            "y": -12258.05438589118
                        },
                        {
                            "x": 8499.110079743725,
                            "y": -9923.054385891184
                        }
                    ],
                    "handle": "166A",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 8499.110079743725,
                            "y": -9783.054385891184
                        },
                        {
                            "x": 8499.110079743725,
                            "y": -9633.054385891184
                        }
                    ],
                    "handle": "166B",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 8499.110079743725,
                            "y": -8433.054385891184
                        },
                        {
                            "x": 8499.110079743725,
                            "y": -4983.054385891184
                        }
                    ],
                    "handle": "166C",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 8499.110079743725,
                            "y": -4843.054385891182
                        },
                        {
                            "x": 8499.110079743725,
                            "y": -2508.054385891184
                        },
                        {
                            "x": 6544.110079743725,
                            "y": -2508.054385891184
                        }
                    ],
                    "handle": "166D",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 8499.110079743725,
                            "y": -9783.054385891184
                        },
                        {
                            "x": 9399.110079743727,
                            "y": -9783.054385891184
                        }
                    ],
                    "handle": "166E",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 10599.11007974373,
                            "y": -9783.054385891184
                        },
                        {
                            "x": 11499.11007974373,
                            "y": -9783.054385891184
                        },
                        {
                            "x": 11499.11007974372,
                            "y": -4983.054385891186
                        },
                        {
                            "x": 8499.110079743725,
                            "y": -4983.054385891184
                        }
                    ],
                    "handle": "166F",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 8499.110079743725,
                            "y": -9923.054385891184
                        },
                        {
                            "x": 9399.110079743727,
                            "y": -9923.054385891184
                        }
                    ],
                    "handle": "1670",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 10599.11007974373,
                            "y": -9923.054385891184
                        },
                        {
                            "x": 11639.11007974373,
                            "y": -9923.054385891184
                        },
                        {
                            "x": 11639.11007974372,
                            "y": -4843.054385891185
                        },
                        {
                            "x": 8499.110079743725,
                            "y": -4843.054385891184
                        }
                    ],
                    "handle": "1671",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 4444.110079743725,
                            "y": -2508.054385891184
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -2508.054385891184
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -4115.554385891184
                        }
                    ],
                    "handle": "1672",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -5715.554385891184
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -9050.554385891184
                        }
                    ],
                    "handle": "1673",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -10650.55438589118
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -12258.05438589118
                        },
                        {
                            "x": 3039.110079743725,
                            "y": -12258.05438589118
                        }
                    ],
                    "handle": "1674",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 4139.110079743725,
                            "y": -12118.05438589118
                        },
                        {
                            "x": 5074.110079743725,
                            "y": -12118.05438589118
                        }
                    ],
                    "handle": "1675",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 7474.110079743725,
                            "y": -12118.05438589118
                        },
                        {
                            "x": 8359.110079743725,
                            "y": -12118.05438589118
                        },
                        {
                            "x": 8359.110079743725,
                            "y": -9633.054385891182
                        }
                    ],
                    "handle": "1676",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 8359.110079743725,
                            "y": -8433.054385891184
                        },
                        {
                            "x": 8359.110079743725,
                            "y": -7383.054385891184
                        }
                    ],
                    "handle": "1677",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 8359.110079743725,
                            "y": -7294.054385891184
                        },
                        {
                            "x": 8359.110079743725,
                            "y": -2648.054385891184
                        },
                        {
                            "x": 6544.110079743725,
                            "y": -2648.054385891184
                        }
                    ],
                    "handle": "1678",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 4444.110079743725,
                            "y": -2648.054385891184
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -2648.054385891184
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -4115.554385891184
                        }
                    ],
                    "handle": "1679",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 2629.110079743725,
                            "y": -5715.554385891182
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -7294.054385891184
                        }
                    ],
                    "handle": "167A",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 2629.110079743725,
                            "y": -7383.054385891184
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -9050.554385891186
                        }
                    ],
                    "handle": "167B",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 2629.110079743725,
                            "y": -10650.55438589118
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -12118.05438589118
                        },
                        {
                            "x": 3039.110079743725,
                            "y": -12118.05438589118
                        }
                    ],
                    "handle": "167C",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3039.110079743725,
                            "y": -12118.05438589118,
                            "z": 0
                        },
                        {
                            "x": 3039.110079743725,
                            "y": -12258.05438589118,
                            "z": 0
                        }
                    ],
                    "handle": "167D",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 4139.110079743725,
                            "y": -12118.05438589118,
                            "z": 0
                        },
                        {
                            "x": 4139.110079743725,
                            "y": -12258.05438589118,
                            "z": 0
                        }
                    ],
                    "handle": "167E",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 7474.110079743725,
                            "y": -12118.05438589118,
                            "z": 0
                        },
                        {
                            "x": 7474.110079743725,
                            "y": -12258.05438589118,
                            "z": 0
                        }
                    ],
                    "handle": "167F",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 5074.110079743725,
                            "y": -12118.05438589118,
                            "z": 0
                        },
                        {
                            "x": 5074.110079743725,
                            "y": -12258.05438589118,
                            "z": 0
                        }
                    ],
                    "handle": "1680",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -5715.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -5715.554385891184,
                            "z": 0
                        }
                    ],
                    "handle": "1681",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -4115.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -4115.554385891184,
                            "z": 0
                        }
                    ],
                    "handle": "1682",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 6544.110079743725,
                            "y": -2648.054385891184,
                            "z": 0
                        },
                        {
                            "x": 6544.110079743725,
                            "y": -2508.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "1683",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 4444.110079743725,
                            "y": -2648.054385891184,
                            "z": 0
                        },
                        {
                            "x": 4444.110079743725,
                            "y": -2508.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "1684",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 3059.110079743725,
                            "y": -12258.05438589118
                        },
                        {
                            "x": 3099.110079743725,
                            "y": -12258.05438589118
                        },
                        {
                            "x": 3099.110079743725,
                            "y": -12118.05438589118
                        },
                        {
                            "x": 3059.110079743725,
                            "y": -12118.05438589118
                        }
                    ],
                    "handle": "1685",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 4119.110079743725,
                            "y": -12258.05438589118
                        },
                        {
                            "x": 4079.110079743725,
                            "y": -12258.05438589118
                        },
                        {
                            "x": 4079.110079743725,
                            "y": -12118.05438589118
                        },
                        {
                            "x": 4119.110079743725,
                            "y": -12118.05438589118
                        }
                    ],
                    "handle": "1686",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 7454.110079743725,
                            "y": -12258.05438589118
                        },
                        {
                            "x": 7414.110079743725,
                            "y": -12258.05438589118
                        },
                        {
                            "x": 7414.110079743725,
                            "y": -12118.05438589118
                        },
                        {
                            "x": 7454.110079743725,
                            "y": -12118.05438589118
                        }
                    ],
                    "handle": "1687",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 5094.110079743725,
                            "y": -12258.05438589118
                        },
                        {
                            "x": 5134.110079743725,
                            "y": -12258.05438589118
                        },
                        {
                            "x": 5134.110079743725,
                            "y": -12118.05438589118
                        },
                        {
                            "x": 5094.110079743725,
                            "y": -12118.05438589118
                        }
                    ],
                    "handle": "1688",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 5134.110079743725,
                            "y": -12258.05438589118,
                            "z": 0
                        },
                        {
                            "x": 7414.110079743725,
                            "y": -12258.05438589118,
                            "z": 0
                        }
                    ],
                    "handle": "1689",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 5134.110079743725,
                            "y": -12118.05438589118,
                            "z": 0
                        },
                        {
                            "x": 7414.110079743725,
                            "y": -12118.05438589118,
                            "z": 0
                        }
                    ],
                    "handle": "168A",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 5134.110079743725,
                            "y": -12164.72105255785,
                            "z": 0
                        },
                        {
                            "x": 7414.110079743725,
                            "y": -12164.72105255785,
                            "z": 0
                        }
                    ],
                    "handle": "168B",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 5134.110079743725,
                            "y": -12211.38771922452,
                            "z": 0
                        },
                        {
                            "x": 7414.110079743725,
                            "y": -12211.38771922452,
                            "z": 0
                        }
                    ],
                    "handle": "168C",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -4115.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -4115.554385891184,
                            "z": 0
                        }
                    ],
                    "handle": "168D",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -5715.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -5715.554385891184,
                            "z": 0
                        }
                    ],
                    "handle": "168E",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2629.110079743725,
                            "y": -4115.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -4115.554385891184,
                            "z": 0
                        }
                    ],
                    "handle": "168F",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2629.110079743725,
                            "y": -5715.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -5715.554385891184,
                            "z": 0
                        }
                    ],
                    "handle": "1690",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -4135.554385891184
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -4175.554385891184
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -4175.554385891184
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -4135.554385891184
                        }
                    ],
                    "handle": "1691",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -5695.554385891184
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -5655.554385891184
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -5655.554385891184
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -5695.554385891184
                        }
                    ],
                    "handle": "1692",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -5655.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -4175.554385891184,
                            "z": 0
                        }
                    ],
                    "handle": "1693",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2629.110079743725,
                            "y": -5655.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -4175.554385891184,
                            "z": 0
                        }
                    ],
                    "handle": "1694",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2582.443413077057,
                            "y": -5655.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2582.443413077057,
                            "y": -4175.554385891184,
                            "z": 0
                        }
                    ],
                    "handle": "1695",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2535.776746410393,
                            "y": -5655.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2535.776746410393,
                            "y": -4175.554385891184,
                            "z": 0
                        }
                    ],
                    "handle": "1696",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 6544.110079743725,
                            "y": -2508.054385891184,
                            "z": 0
                        },
                        {
                            "x": 6544.110079743725,
                            "y": -2648.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "1697",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 4444.110079743725,
                            "y": -2508.054385891184,
                            "z": 0
                        },
                        {
                            "x": 4444.110079743725,
                            "y": -2648.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "1698",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 6524.110079743725,
                            "y": -2648.054385891184
                        },
                        {
                            "x": 6484.110079743725,
                            "y": -2648.054385891184
                        },
                        {
                            "x": 6484.110079743725,
                            "y": -2508.054385891184
                        },
                        {
                            "x": 6524.110079743725,
                            "y": -2508.054385891184
                        }
                    ],
                    "handle": "1699",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 4464.110079743725,
                            "y": -2648.054385891184
                        },
                        {
                            "x": 4504.110079743725,
                            "y": -2648.054385891184
                        },
                        {
                            "x": 4504.110079743725,
                            "y": -2508.054385891184
                        },
                        {
                            "x": 4464.110079743725,
                            "y": -2508.054385891184
                        }
                    ],
                    "handle": "169A",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 4504.110079743725,
                            "y": -2648.054385891184,
                            "z": 0
                        },
                        {
                            "x": 6484.110079743725,
                            "y": -2648.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "169B",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 4504.110079743725,
                            "y": -2508.054385891184,
                            "z": 0
                        },
                        {
                            "x": 6484.110079743725,
                            "y": -2508.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "169C",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 4504.110079743725,
                            "y": -2554.721052557852,
                            "z": 0
                        },
                        {
                            "x": 6484.110079743725,
                            "y": -2554.721052557852,
                            "z": 0
                        }
                    ],
                    "handle": "169D",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 4504.110079743725,
                            "y": -2601.387719224516,
                            "z": 0
                        },
                        {
                            "x": 6484.110079743725,
                            "y": -2601.387719224516,
                            "z": 0
                        }
                    ],
                    "handle": "169E",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -9050.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -9050.554385891184,
                            "z": 0
                        }
                    ],
                    "handle": "169F",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -10650.55438589118,
                            "z": 0
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -10650.55438589118,
                            "z": 0
                        }
                    ],
                    "handle": "16A0",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -10650.55438589118,
                            "z": 0
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -10650.55438589118,
                            "z": 0
                        }
                    ],
                    "handle": "16A1",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -9050.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -9050.554385891184,
                            "z": 0
                        }
                    ],
                    "handle": "16A2",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2629.110079743725,
                            "y": -10650.55438589118,
                            "z": 0
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -10650.55438589118,
                            "z": 0
                        }
                    ],
                    "handle": "16A3",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2629.110079743725,
                            "y": -9050.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -9050.554385891184,
                            "z": 0
                        }
                    ],
                    "handle": "16A4",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -10630.55438589118
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -10590.55438589118
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -10590.55438589118
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -10630.55438589118
                        }
                    ],
                    "handle": "16A5",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -9070.554385891184
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -9110.554385891184
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -9110.554385891184
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -9070.554385891184
                        }
                    ],
                    "handle": "16A6",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2489.110079743725,
                            "y": -9110.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2489.110079743725,
                            "y": -10590.55438589118,
                            "z": 0
                        }
                    ],
                    "handle": "16A7",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2629.110079743725,
                            "y": -9110.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2629.110079743725,
                            "y": -10590.55438589118,
                            "z": 0
                        }
                    ],
                    "handle": "16A8",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2582.443413077057,
                            "y": -9110.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2582.443413077057,
                            "y": -10590.55438589118,
                            "z": 0
                        }
                    ],
                    "handle": "16A9",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2535.776746410393,
                            "y": -9110.554385891184,
                            "z": 0
                        },
                        {
                            "x": 2535.776746410393,
                            "y": -10590.55438589118,
                            "z": 0
                        }
                    ],
                    "handle": "16AA",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2629.110079743725,
                            "y": -7383.054385891184,
                            "z": 0
                        },
                        {
                            "x": 3039.110079743728,
                            "y": -7383.054385891182,
                            "z": 0
                        }
                    ],
                    "handle": "16AB",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3989.110079743728,
                            "y": -7383.054385891182,
                            "z": 0
                        },
                        {
                            "x": 8359.110079743725,
                            "y": -7383.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "16AC",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2629.110079743725,
                            "y": -7294.054385891184,
                            "z": 0
                        },
                        {
                            "x": 3039.110079743728,
                            "y": -7294.054385891182,
                            "z": 0
                        }
                    ],
                    "handle": "16AD",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3989.110079743728,
                            "y": -7294.054385891182,
                            "z": 0
                        },
                        {
                            "x": 8359.110079743725,
                            "y": -7294.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "16AE",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3039.110079743725,
                            "y": -7383.054385891184,
                            "z": 0
                        },
                        {
                            "x": 3039.110079743725,
                            "y": -7294.054385891182,
                            "z": 0
                        }
                    ],
                    "handle": "16AF",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3989.110079743725,
                            "y": -7383.054385891184,
                            "z": 0
                        },
                        {
                            "x": 3989.110079743725,
                            "y": -7294.054385891182,
                            "z": 0
                        }
                    ],
                    "handle": "16B0",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 3099.110079743725,
                            "y": -12188.05438589118
                        },
                        {
                            "x": 3124.110079743725,
                            "y": -12188.05438589118
                        },
                        {
                            "x": 3124.110079743725,
                            "y": -13143.05438589118
                        },
                        {
                            "x": 3099.110079743725,
                            "y": -13143.05438589118
                        }
                    ],
                    "handle": "16B1",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 2,
                    "color": 16776960,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "ARC",
                    "handle": "16B2",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 2,
                    "color": 16776960,
                    "center": {
                        "x": 3124.110079743725,
                        "y": -12188.05438589118,
                        "z": 0
                    },
                    "radius": 955,
                    "startAngle": 4.71238898038469,
                    "endAngle": 0,
                    "angleLength": -4.71238898038469
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 3059.110079743725,
                            "y": -7383.054385891182
                        },
                        {
                            "x": 3099.110079743725,
                            "y": -7383.054385891182
                        },
                        {
                            "x": 3099.110079743725,
                            "y": -7294.054385891182
                        },
                        {
                            "x": 3059.110079743725,
                            "y": -7294.054385891182
                        }
                    ],
                    "handle": "16B3",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 2,
                    "color": 16776960,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 3969.110079743725,
                            "y": -7383.054385891182
                        },
                        {
                            "x": 3929.110079743725,
                            "y": -7383.054385891182
                        },
                        {
                            "x": 3929.110079743725,
                            "y": -7294.054385891182
                        },
                        {
                            "x": 3969.110079743725,
                            "y": -7294.054385891182
                        }
                    ],
                    "handle": "16B4",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 2,
                    "color": 16776960,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 3099.110079743725,
                            "y": -7338.554385891182
                        },
                        {
                            "x": 3124.110079743725,
                            "y": -7338.554385891182
                        },
                        {
                            "x": 3124.110079743725,
                            "y": -6533.554385891182
                        },
                        {
                            "x": 3099.110079743725,
                            "y": -6533.554385891182
                        }
                    ],
                    "handle": "16B5",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 2,
                    "color": 16776960,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "ARC",
                    "handle": "16B6",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 2,
                    "color": 16776960,
                    "center": {
                        "x": 3124.110079743725,
                        "y": -7338.554385891182,
                        "z": 0
                    },
                    "radius": 805,
                    "startAngle": 0,
                    "endAngle": 1.5707963267948966,
                    "angleLength": 1.5707963267948966
                },
                {
                    "type": "MTEXT",
                    "handle": "16B7",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "position": {
                        "x": 3884.450988968441,
                        "y": -13732.83810739009,
                        "z": 0
                    },
                    "height": 300,
                    "width": 2489.791670313556,
                    "attachmentPoint": 1,
                    "drawingDirection": 5,
                    "text": "{\\fSimSun|b0|i0|c134|p2;一层平面图}"
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 8499.110079743725,
                            "y": -9633.054385891184,
                            "z": 0
                        },
                        {
                            "x": 8359.110079743725,
                            "y": -9633.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "16B8",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 8499.110079743725,
                            "y": -8433.054385891184,
                            "z": 0
                        },
                        {
                            "x": 8359.110079743725,
                            "y": -8433.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "16B9",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 8499.110079743725,
                            "y": -9783.054385891184,
                            "z": 0
                        },
                        {
                            "x": 11499.11007974372,
                            "y": -4983.054385891186,
                            "z": 0
                        }
                    ],
                    "handle": "16BA",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 252,
                    "color": 8684676
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 8499.110079743725,
                            "y": -4983.054385891184,
                            "z": 0
                        },
                        {
                            "x": 11499.11007974373,
                            "y": -9783.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "16BB",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 252,
                    "color": 8684676
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 9399.110079743727,
                            "y": -9783.054385891184,
                            "z": 0
                        },
                        {
                            "x": 9399.110079743727,
                            "y": -9923.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "16BC",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 10599.11007974373,
                            "y": -9783.054385891184,
                            "z": 0
                        },
                        {
                            "x": 10599.11007974373,
                            "y": -9923.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "16BD",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 9399.110079743727,
                            "y": -9783.054385891184,
                            "z": 0
                        },
                        {
                            "x": 9399.110079743727,
                            "y": -9923.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "16BE",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 10599.11007974373,
                            "y": -9783.054385891184,
                            "z": 0
                        },
                        {
                            "x": 10599.11007974373,
                            "y": -9923.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "16BF",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 9419.110079743727,
                            "y": -9923.054385891184
                        },
                        {
                            "x": 9459.110079743727,
                            "y": -9923.054385891184
                        },
                        {
                            "x": 9459.110079743727,
                            "y": -9783.054385891184
                        },
                        {
                            "x": 9419.110079743727,
                            "y": -9783.054385891184
                        }
                    ],
                    "handle": "16C0",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 10579.11007974373,
                            "y": -9923.054385891184
                        },
                        {
                            "x": 10539.11007974373,
                            "y": -9923.054385891184
                        },
                        {
                            "x": 10539.11007974373,
                            "y": -9783.054385891184
                        },
                        {
                            "x": 10579.11007974373,
                            "y": -9783.054385891184
                        }
                    ],
                    "handle": "16C1",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 9459.110079743727,
                            "y": -9923.054385891184,
                            "z": 0
                        },
                        {
                            "x": 10539.11007974373,
                            "y": -9923.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "16C2",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 9459.110079743727,
                            "y": -9783.054385891184,
                            "z": 0
                        },
                        {
                            "x": 10539.11007974373,
                            "y": -9783.054385891184,
                            "z": 0
                        }
                    ],
                    "handle": "16C3",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 9459.110079743727,
                            "y": -9829.72105255785,
                            "z": 0
                        },
                        {
                            "x": 10539.11007974373,
                            "y": -9829.72105255785,
                            "z": 0
                        }
                    ],
                    "handle": "16C4",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 9459.110079743727,
                            "y": -9876.387719224516,
                            "z": 0
                        },
                        {
                            "x": 10539.11007974373,
                            "y": -9876.387719224516,
                            "z": 0
                        }
                    ],
                    "handle": "16C5",
                    "ownerHandle": "1667",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                }
            ]
        },
        "二层平面图": {
            "handle": "16C8",
            "ownerHandle": "16C7",
            "layer": "0",
            "name": "二层平面图",
            "position": {
                "x": 0,
                "y": 0,
                "z": 0
            },
            "name2": "二层平面图",
            "xrefPath": "",
            "entities": [
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 3173.296871595354,
                            "y": -12457.17066486255
                        },
                        {
                            "x": 4108.296871595354,
                            "y": -12457.17066486255
                        }
                    ],
                    "handle": "16C9",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 6208.296871595354,
                            "y": -12457.17066486255
                        },
                        {
                            "x": 7533.296871595354,
                            "y": -12457.17066486255
                        },
                        {
                            "x": 7533.296871595354,
                            "y": -10122.17066486255
                        }
                    ],
                    "handle": "16CA",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 7533.296871595354,
                            "y": -9982.170664862555
                        },
                        {
                            "x": 7533.296871595354,
                            "y": -9832.170664862553
                        }
                    ],
                    "handle": "16CB",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 7533.296871595354,
                            "y": -8632.170664862555
                        },
                        {
                            "x": 7533.296871595354,
                            "y": -5182.170664862555
                        }
                    ],
                    "handle": "16CC",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 7533.296871595354,
                            "y": -5042.170664862555
                        },
                        {
                            "x": 7533.296871595354,
                            "y": -2707.170664862555
                        },
                        {
                            "x": 5578.296871595354,
                            "y": -2707.170664862555
                        }
                    ],
                    "handle": "16CD",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 3478.296871595354,
                            "y": -2707.170664862555
                        },
                        {
                            "x": 1523.296871595354,
                            "y": -2707.170664862555
                        },
                        {
                            "x": 1523.296871595352,
                            "y": -4314.670664862555
                        }
                    ],
                    "handle": "16CE",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 1523.296871595352,
                            "y": -5914.670664862555
                        },
                        {
                            "x": 1523.296871595354,
                            "y": -9249.670664862555
                        }
                    ],
                    "handle": "16CF",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 1523.296871595354,
                            "y": -10849.67066486255
                        },
                        {
                            "x": 1523.296871595354,
                            "y": -12457.17066486255
                        },
                        {
                            "x": 2073.296871595354,
                            "y": -12457.17066486255
                        }
                    ],
                    "handle": "16D0",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 3173.296871595354,
                            "y": -12317.17066486255
                        },
                        {
                            "x": 4108.296871595354,
                            "y": -12317.17066486255
                        }
                    ],
                    "handle": "16D1",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 6208.296871595354,
                            "y": -12317.17066486255
                        },
                        {
                            "x": 7393.296871595354,
                            "y": -12317.17066486255
                        },
                        {
                            "x": 7393.296871595354,
                            "y": -9832.170664862553
                        }
                    ],
                    "handle": "16D2",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 7393.296871595354,
                            "y": -8632.170664862555
                        },
                        {
                            "x": 7393.296871595354,
                            "y": -7582.170664862555
                        }
                    ],
                    "handle": "16D3",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 7393.296871595354,
                            "y": -7493.170664862555
                        },
                        {
                            "x": 7393.296871595354,
                            "y": -2847.170664862555
                        },
                        {
                            "x": 5578.296871595354,
                            "y": -2847.170664862555
                        }
                    ],
                    "handle": "16D4",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 3478.296871595354,
                            "y": -2847.170664862555
                        },
                        {
                            "x": 1663.296871595354,
                            "y": -2847.170664862555
                        },
                        {
                            "x": 1663.296871595352,
                            "y": -4314.670664862555
                        }
                    ],
                    "handle": "16D5",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 1663.296871595352,
                            "y": -5914.670664862555
                        },
                        {
                            "x": 1663.296871595352,
                            "y": -7493.170664862553
                        }
                    ],
                    "handle": "16D6",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 1663.296871595352,
                            "y": -7582.170664862553
                        },
                        {
                            "x": 1663.296871595354,
                            "y": -9249.670664862555
                        }
                    ],
                    "handle": "16D7",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 1663.296871595354,
                            "y": -10849.67066486255
                        },
                        {
                            "x": 1663.296871595354,
                            "y": -12317.17066486255
                        },
                        {
                            "x": 2073.296871595354,
                            "y": -12317.17066486255
                        }
                    ],
                    "handle": "16D8",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2073.296871595354,
                            "y": -12317.17066486255,
                            "z": 0
                        },
                        {
                            "x": 2073.296871595354,
                            "y": -12457.17066486255,
                            "z": 0
                        }
                    ],
                    "handle": "16D9",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3173.296871595354,
                            "y": -12317.17066486255,
                            "z": 0
                        },
                        {
                            "x": 3173.296871595354,
                            "y": -12457.17066486255,
                            "z": 0
                        }
                    ],
                    "handle": "16DA",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 6208.296871595354,
                            "y": -12317.17066486255,
                            "z": 0
                        },
                        {
                            "x": 6208.296871595354,
                            "y": -12457.17066486255,
                            "z": 0
                        }
                    ],
                    "handle": "16DB",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 4108.296871595354,
                            "y": -12317.17066486255,
                            "z": 0
                        },
                        {
                            "x": 4108.296871595354,
                            "y": -12457.17066486255,
                            "z": 0
                        }
                    ],
                    "handle": "16DC",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1523.296871595352,
                            "y": -5914.670664862555,
                            "z": 0
                        },
                        {
                            "x": 1663.296871595352,
                            "y": -5914.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16DD",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1523.296871595352,
                            "y": -4314.670664862555,
                            "z": 0
                        },
                        {
                            "x": 1663.296871595352,
                            "y": -4314.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16DE",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1523.296871595354,
                            "y": -9249.670664862555,
                            "z": 0
                        },
                        {
                            "x": 1663.296871595354,
                            "y": -9249.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16DF",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1523.296871595354,
                            "y": -10849.67066486255,
                            "z": 0
                        },
                        {
                            "x": 1663.296871595354,
                            "y": -10849.67066486255,
                            "z": 0
                        }
                    ],
                    "handle": "16E0",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 5578.296871595354,
                            "y": -2847.170664862555,
                            "z": 0
                        },
                        {
                            "x": 5578.296871595354,
                            "y": -2707.170664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16E1",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3478.296871595354,
                            "y": -2847.170664862555,
                            "z": 0
                        },
                        {
                            "x": 3478.296871595354,
                            "y": -2707.170664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16E2",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 2093.296871595354,
                            "y": -12457.17066486255
                        },
                        {
                            "x": 2133.296871595354,
                            "y": -12457.17066486255
                        },
                        {
                            "x": 2133.296871595354,
                            "y": -12317.17066486255
                        },
                        {
                            "x": 2093.296871595354,
                            "y": -12317.17066486255
                        }
                    ],
                    "handle": "16E3",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 3153.296871595354,
                            "y": -12457.17066486255
                        },
                        {
                            "x": 3113.296871595354,
                            "y": -12457.17066486255
                        },
                        {
                            "x": 3113.296871595354,
                            "y": -12317.17066486255
                        },
                        {
                            "x": 3153.296871595354,
                            "y": -12317.17066486255
                        }
                    ],
                    "handle": "16E4",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 6188.296871595354,
                            "y": -12457.17066486255
                        },
                        {
                            "x": 6148.296871595354,
                            "y": -12457.17066486255
                        },
                        {
                            "x": 6148.296871595354,
                            "y": -12317.17066486255
                        },
                        {
                            "x": 6188.296871595354,
                            "y": -12317.17066486255
                        }
                    ],
                    "handle": "16E5",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 4128.296871595354,
                            "y": -12457.17066486255
                        },
                        {
                            "x": 4168.296871595354,
                            "y": -12457.17066486255
                        },
                        {
                            "x": 4168.296871595354,
                            "y": -12317.17066486255
                        },
                        {
                            "x": 4128.296871595354,
                            "y": -12317.17066486255
                        }
                    ],
                    "handle": "16E6",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 4168.296871595354,
                            "y": -12457.17066486255,
                            "z": 0
                        },
                        {
                            "x": 6148.296871595354,
                            "y": -12457.17066486255,
                            "z": 0
                        }
                    ],
                    "handle": "16E7",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 4168.296871595354,
                            "y": -12317.17066486255,
                            "z": 0
                        },
                        {
                            "x": 6148.296871595354,
                            "y": -12317.17066486255,
                            "z": 0
                        }
                    ],
                    "handle": "16E8",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 4168.296871595354,
                            "y": -12363.83733152922,
                            "z": 0
                        },
                        {
                            "x": 6148.296871595354,
                            "y": -12363.83733152922,
                            "z": 0
                        }
                    ],
                    "handle": "16E9",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 4168.296871595354,
                            "y": -12410.50399819589,
                            "z": 0
                        },
                        {
                            "x": 6148.296871595354,
                            "y": -12410.50399819589,
                            "z": 0
                        }
                    ],
                    "handle": "16EA",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1663.296871595354,
                            "y": -9249.670664862555,
                            "z": 0
                        },
                        {
                            "x": 1523.296871595354,
                            "y": -9249.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16EB",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1663.296871595354,
                            "y": -10849.67066486255,
                            "z": 0
                        },
                        {
                            "x": 1523.296871595354,
                            "y": -10849.67066486255,
                            "z": 0
                        }
                    ],
                    "handle": "16EC",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 1523.296871595354,
                            "y": -9269.670664862555
                        },
                        {
                            "x": 1523.296871595354,
                            "y": -9309.670664862555
                        },
                        {
                            "x": 1663.296871595354,
                            "y": -9309.670664862555
                        },
                        {
                            "x": 1663.296871595354,
                            "y": -9269.670664862555
                        }
                    ],
                    "handle": "16ED",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 1523.296871595354,
                            "y": -10829.67066486255
                        },
                        {
                            "x": 1523.296871595354,
                            "y": -10789.67066486255
                        },
                        {
                            "x": 1663.296871595354,
                            "y": -10789.67066486255
                        },
                        {
                            "x": 1663.296871595354,
                            "y": -10829.67066486255
                        }
                    ],
                    "handle": "16EE",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1523.296871595354,
                            "y": -10789.67066486255,
                            "z": 0
                        },
                        {
                            "x": 1523.296871595354,
                            "y": -9309.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16EF",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1663.296871595354,
                            "y": -10789.67066486255,
                            "z": 0
                        },
                        {
                            "x": 1663.296871595354,
                            "y": -9309.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16F0",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1616.630204928686,
                            "y": -10789.67066486255,
                            "z": 0
                        },
                        {
                            "x": 1616.630204928686,
                            "y": -9309.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16F1",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1569.963538262022,
                            "y": -10789.67066486255,
                            "z": 0
                        },
                        {
                            "x": 1569.963538262022,
                            "y": -9309.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16F2",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1523.296871595352,
                            "y": -4314.670664862555,
                            "z": 0
                        },
                        {
                            "x": 1663.296871595352,
                            "y": -4314.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16F3",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1523.296871595352,
                            "y": -5914.670664862554,
                            "z": 0
                        },
                        {
                            "x": 1663.296871595352,
                            "y": -5914.670664862554,
                            "z": 0
                        }
                    ],
                    "handle": "16F4",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1663.296871595352,
                            "y": -4314.670664862555,
                            "z": 0
                        },
                        {
                            "x": 1523.296871595352,
                            "y": -4314.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16F5",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1663.296871595352,
                            "y": -5914.670664862554,
                            "z": 0
                        },
                        {
                            "x": 1523.296871595352,
                            "y": -5914.670664862554,
                            "z": 0
                        }
                    ],
                    "handle": "16F6",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 1523.296871595352,
                            "y": -4334.670664862555
                        },
                        {
                            "x": 1523.296871595352,
                            "y": -4374.670664862555
                        },
                        {
                            "x": 1663.296871595352,
                            "y": -4374.670664862555
                        },
                        {
                            "x": 1663.296871595352,
                            "y": -4334.670664862555
                        }
                    ],
                    "handle": "16F7",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 1523.296871595352,
                            "y": -5894.670664862554
                        },
                        {
                            "x": 1523.296871595352,
                            "y": -5854.670664862554
                        },
                        {
                            "x": 1663.296871595352,
                            "y": -5854.670664862554
                        },
                        {
                            "x": 1663.296871595352,
                            "y": -5894.670664862554
                        }
                    ],
                    "handle": "16F8",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1523.296871595352,
                            "y": -5854.670664862554,
                            "z": 0
                        },
                        {
                            "x": 1523.296871595352,
                            "y": -4374.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16F9",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1663.296871595352,
                            "y": -5854.670664862554,
                            "z": 0
                        },
                        {
                            "x": 1663.296871595352,
                            "y": -4374.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16FA",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1616.630204928684,
                            "y": -5854.670664862554,
                            "z": 0
                        },
                        {
                            "x": 1616.630204928684,
                            "y": -4374.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16FB",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1569.96353826202,
                            "y": -5854.670664862554,
                            "z": 0
                        },
                        {
                            "x": 1569.96353826202,
                            "y": -4374.670664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16FC",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 5578.296871595354,
                            "y": -2707.170664862555,
                            "z": 0
                        },
                        {
                            "x": 5578.296871595354,
                            "y": -2847.170664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16FD",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3478.296871595354,
                            "y": -2707.170664862555,
                            "z": 0
                        },
                        {
                            "x": 3478.296871595354,
                            "y": -2847.170664862555,
                            "z": 0
                        }
                    ],
                    "handle": "16FE",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 5558.296871595354,
                            "y": -2847.170664862555
                        },
                        {
                            "x": 5518.296871595354,
                            "y": -2847.170664862555
                        },
                        {
                            "x": 5518.296871595354,
                            "y": -2707.170664862555
                        },
                        {
                            "x": 5558.296871595354,
                            "y": -2707.170664862555
                        }
                    ],
                    "handle": "16FF",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 3498.296871595354,
                            "y": -2847.170664862555
                        },
                        {
                            "x": 3538.296871595354,
                            "y": -2847.170664862555
                        },
                        {
                            "x": 3538.296871595354,
                            "y": -2707.170664862555
                        },
                        {
                            "x": 3498.296871595354,
                            "y": -2707.170664862555
                        }
                    ],
                    "handle": "1700",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3538.296871595354,
                            "y": -2847.170664862555,
                            "z": 0
                        },
                        {
                            "x": 5518.296871595354,
                            "y": -2847.170664862555,
                            "z": 0
                        }
                    ],
                    "handle": "1701",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3538.296871595354,
                            "y": -2707.170664862555,
                            "z": 0
                        },
                        {
                            "x": 5518.296871595354,
                            "y": -2707.170664862555,
                            "z": 0
                        }
                    ],
                    "handle": "1702",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3538.296871595354,
                            "y": -2753.837331529221,
                            "z": 0
                        },
                        {
                            "x": 5518.296871595354,
                            "y": -2753.837331529221,
                            "z": 0
                        }
                    ],
                    "handle": "1703",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3538.296871595354,
                            "y": -2800.503998195889,
                            "z": 0
                        },
                        {
                            "x": 5518.296871595354,
                            "y": -2800.503998195889,
                            "z": 0
                        }
                    ],
                    "handle": "1704",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2133.296871595354,
                            "y": -12457.17066486255,
                            "z": 0
                        },
                        {
                            "x": 3113.296871595354,
                            "y": -12457.17066486255,
                            "z": 0
                        }
                    ],
                    "handle": "1705",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2133.296871595354,
                            "y": -12317.17066486255,
                            "z": 0
                        },
                        {
                            "x": 3113.296871595354,
                            "y": -12317.17066486255,
                            "z": 0
                        }
                    ],
                    "handle": "1706",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2133.296871595354,
                            "y": -12363.83733152922,
                            "z": 0
                        },
                        {
                            "x": 3113.296871595354,
                            "y": -12363.83733152922,
                            "z": 0
                        }
                    ],
                    "handle": "1707",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2133.296871595354,
                            "y": -12410.50399819589,
                            "z": 0
                        },
                        {
                            "x": 3113.296871595354,
                            "y": -12410.50399819589,
                            "z": 0
                        }
                    ],
                    "handle": "1708",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "MTEXT",
                    "handle": "1709",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "position": {
                        "x": 3380.848103821685,
                        "y": -13931.95438636146,
                        "z": 0
                    },
                    "height": 300,
                    "width": 2489.791670313556,
                    "attachmentPoint": 1,
                    "drawingDirection": 5,
                    "text": "{\\fSimSun|b0|i0|c134|p2;二层平面图}"
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 7533.296871595354,
                            "y": -9982.170664862555
                        },
                        {
                            "x": 8433.296871595354,
                            "y": -9982.170664862555
                        }
                    ],
                    "handle": "170A",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 9633.296871595354,
                            "y": -9982.170664862555
                        },
                        {
                            "x": 10533.29687159535,
                            "y": -9982.170664862555
                        },
                        {
                            "x": 10533.29687159535,
                            "y": -5182.170664862557
                        },
                        {
                            "x": 7533.296871595354,
                            "y": -5182.170664862555
                        }
                    ],
                    "handle": "170B",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 7533.296871595354,
                            "y": -10122.17066486255
                        },
                        {
                            "x": 8433.296871595354,
                            "y": -10122.17066486255
                        }
                    ],
                    "handle": "170C",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 9633.296871595354,
                            "y": -10122.17066486255
                        },
                        {
                            "x": 10673.29687159535,
                            "y": -10122.17066486255
                        },
                        {
                            "x": 10673.29687159535,
                            "y": -5042.170664862556
                        },
                        {
                            "x": 7533.296871595354,
                            "y": -5042.170664862555
                        }
                    ],
                    "handle": "170D",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1663.296871595352,
                            "y": -7582.170664862553,
                            "z": 0
                        },
                        {
                            "x": 2073.296871595352,
                            "y": -7582.170664862553,
                            "z": 0
                        }
                    ],
                    "handle": "170E",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3023.296871595354,
                            "y": -7582.170664862554,
                            "z": 0
                        },
                        {
                            "x": 7393.296871595354,
                            "y": -7582.170664862555,
                            "z": 0
                        }
                    ],
                    "handle": "170F",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 1663.296871595352,
                            "y": -7493.170664862553,
                            "z": 0
                        },
                        {
                            "x": 2073.296871595352,
                            "y": -7493.170664862552,
                            "z": 0
                        }
                    ],
                    "handle": "1710",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3023.296871595354,
                            "y": -7493.170664862553,
                            "z": 0
                        },
                        {
                            "x": 7393.296871595354,
                            "y": -7493.170664862555,
                            "z": 0
                        }
                    ],
                    "handle": "1711",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 7393.296871595354,
                            "y": -9832.170664862555,
                            "z": 0
                        },
                        {
                            "x": 7533.296871595354,
                            "y": -9832.170664862555,
                            "z": 0
                        }
                    ],
                    "handle": "1712",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 7393.296871595354,
                            "y": -8632.170664862555,
                            "z": 0
                        },
                        {
                            "x": 7533.296871595354,
                            "y": -8632.170664862555,
                            "z": 0
                        }
                    ],
                    "handle": "1713",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 2073.296871595352,
                            "y": -7582.170664862553,
                            "z": 0
                        },
                        {
                            "x": 2073.296871595352,
                            "y": -7493.170664862551,
                            "z": 0
                        }
                    ],
                    "handle": "1714",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 3023.296871595352,
                            "y": -7582.170664862553,
                            "z": 0
                        },
                        {
                            "x": 3023.296871595352,
                            "y": -7493.170664862551,
                            "z": 0
                        }
                    ],
                    "handle": "1715",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 2093.296871595352,
                            "y": -7582.170664862551
                        },
                        {
                            "x": 2133.296871595352,
                            "y": -7582.170664862551
                        },
                        {
                            "x": 2133.296871595352,
                            "y": -7493.170664862551
                        },
                        {
                            "x": 2093.296871595352,
                            "y": -7493.170664862551
                        }
                    ],
                    "handle": "1716",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 2,
                    "color": 16776960,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 3003.296871595352,
                            "y": -7582.170664862551
                        },
                        {
                            "x": 2963.296871595352,
                            "y": -7582.170664862551
                        },
                        {
                            "x": 2963.296871595352,
                            "y": -7493.170664862551
                        },
                        {
                            "x": 3003.296871595352,
                            "y": -7493.170664862551
                        }
                    ],
                    "handle": "1717",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 2,
                    "color": 16776960,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 2133.296871595352,
                            "y": -7537.670664862551
                        },
                        {
                            "x": 2158.296871595352,
                            "y": -7537.670664862551
                        },
                        {
                            "x": 2158.296871595352,
                            "y": -6732.670664862551
                        },
                        {
                            "x": 2133.296871595352,
                            "y": -6732.670664862551
                        }
                    ],
                    "handle": "1718",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 2,
                    "color": 16776960,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "ARC",
                    "handle": "1719",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 2,
                    "color": 16776960,
                    "center": {
                        "x": 2158.296871595352,
                        "y": -7537.670664862551,
                        "z": 0
                    },
                    "radius": 805,
                    "startAngle": 0,
                    "endAngle": 1.5707963267948966,
                    "angleLength": 1.5707963267948966
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 8433.296871595354,
                            "y": -9982.170664862555,
                            "z": 0
                        },
                        {
                            "x": 8433.296871595354,
                            "y": -10122.17066486255,
                            "z": 0
                        }
                    ],
                    "handle": "171A",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 9633.296871595354,
                            "y": -9982.170664862555,
                            "z": 0
                        },
                        {
                            "x": 9633.296871595354,
                            "y": -10122.17066486255,
                            "z": 0
                        }
                    ],
                    "handle": "171B",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 8433.296871595354,
                            "y": -9982.170664862555,
                            "z": 0
                        },
                        {
                            "x": 8433.296871595354,
                            "y": -10122.17066486255,
                            "z": 0
                        }
                    ],
                    "handle": "171C",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 9633.296871595354,
                            "y": -9982.170664862555,
                            "z": 0
                        },
                        {
                            "x": 9633.296871595354,
                            "y": -10122.17066486255,
                            "z": 0
                        }
                    ],
                    "handle": "171D",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 7,
                    "color": 16777215
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 8453.296871595354,
                            "y": -10122.17066486255
                        },
                        {
                            "x": 8493.296871595354,
                            "y": -10122.17066486255
                        },
                        {
                            "x": 8493.296871595354,
                            "y": -9982.170664862555
                        },
                        {
                            "x": 8453.296871595354,
                            "y": -9982.170664862555
                        }
                    ],
                    "handle": "171E",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 9613.296871595354,
                            "y": -10122.17066486255
                        },
                        {
                            "x": 9573.296871595354,
                            "y": -10122.17066486255
                        },
                        {
                            "x": 9573.296871595354,
                            "y": -9982.170664862555
                        },
                        {
                            "x": 9613.296871595354,
                            "y": -9982.170664862555
                        }
                    ],
                    "handle": "171F",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535,
                    "shape": true,
                    "hasContinuousLinetypePattern": false
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 8493.296871595354,
                            "y": -10122.17066486255,
                            "z": 0
                        },
                        {
                            "x": 9573.296871595354,
                            "y": -10122.17066486255,
                            "z": 0
                        }
                    ],
                    "handle": "1720",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 8493.296871595354,
                            "y": -9982.170664862555,
                            "z": 0
                        },
                        {
                            "x": 9573.296871595354,
                            "y": -9982.170664862555,
                            "z": 0
                        }
                    ],
                    "handle": "1721",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 8493.296871595354,
                            "y": -10028.83733152922,
                            "z": 0
                        },
                        {
                            "x": 9573.296871595354,
                            "y": -10028.83733152922,
                            "z": 0
                        }
                    ],
                    "handle": "1722",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LINE",
                    "vertices": [
                        {
                            "x": 8493.296871595354,
                            "y": -10075.50399819589,
                            "z": 0
                        },
                        {
                            "x": 9573.296871595354,
                            "y": -10075.50399819589,
                            "z": 0
                        }
                    ],
                    "handle": "1723",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 4,
                    "color": 65535
                },
                {
                    "type": "LWPOLYLINE",
                    "vertices": [
                        {
                            "x": 7533.296871595354,
                            "y": -9982.170664862555
                        },
                        {
                            "x": 8272.718542021488,
                            "y": -5960.885131740459
                        },
                        {
                            "x": 10533.29687159535,
                            "y": -5182.170664862557
                        }
                    ],
                    "handle": "1724",
                    "ownerHandle": "16C7",
                    "layer": "0",
                    "colorIndex": 252,
                    "color": 8684676,
                    "shape": false,
                    "hasContinuousLinetypePattern": false
                }
            ]
        }
    },
    "entities": [
        {
            "type": "INSERT",
            "handle": "960",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "name": "A$C468B1B28",
            "position": {
                "x": 8584.680526148573,
                "y": 11603.68914916333,
                "z": 0
            }
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 13730.85868163172,
                    "y": 0
                },
                {
                    "x": 14665.85868163172,
                    "y": 0
                }
            ],
            "handle": "9EA",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 16765.85868163172,
                    "y": 0
                },
                {
                    "x": 18090.85868163172,
                    "y": 0
                },
                {
                    "x": 18090.85868163172,
                    "y": 2335.000000000001
                }
            ],
            "handle": "9EB",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 14035.85868163172,
                    "y": 9750
                },
                {
                    "x": 12080.85868163172,
                    "y": 9750
                },
                {
                    "x": 12080.85868163172,
                    "y": 8142.5
                }
            ],
            "handle": "9EC",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 6542.5
                },
                {
                    "x": 12080.85868163172,
                    "y": 3207.5
                }
            ],
            "handle": "9ED",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 1607.499999999999
                },
                {
                    "x": 12080.85868163172,
                    "y": 0
                },
                {
                    "x": 12630.85868163172,
                    "y": 0
                }
            ],
            "handle": "9EE",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 13730.85868163172,
                    "y": 140
                },
                {
                    "x": 14665.85868163172,
                    "y": 140
                }
            ],
            "handle": "9EF",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 16765.85868163172,
                    "y": 140
                },
                {
                    "x": 17950.85868163172,
                    "y": 140
                },
                {
                    "x": 17950.85868163172,
                    "y": 2625.000000000001
                }
            ],
            "handle": "9F0",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 14035.85868163172,
                    "y": 9610
                },
                {
                    "x": 12220.85868163172,
                    "y": 9610
                },
                {
                    "x": 12220.85868163172,
                    "y": 8142.5
                }
            ],
            "handle": "9F1",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 12220.85868163172,
                    "y": 6542.5
                },
                {
                    "x": 12220.85868163172,
                    "y": 4964.000000000002
                }
            ],
            "handle": "9F2",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 12220.85868163172,
                    "y": 1607.499999999999
                },
                {
                    "x": 12220.85868163172,
                    "y": 140
                },
                {
                    "x": 12630.85868163172,
                    "y": 140
                }
            ],
            "handle": "9F3",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12630.85868163172,
                    "y": 140,
                    "z": 0
                },
                {
                    "x": 12630.85868163172,
                    "y": 0,
                    "z": 0
                }
            ],
            "handle": "9F4",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 13730.85868163172,
                    "y": 140,
                    "z": 0
                },
                {
                    "x": 13730.85868163172,
                    "y": 0,
                    "z": 0
                }
            ],
            "handle": "9F5",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 16765.85868163172,
                    "y": 140,
                    "z": 0
                },
                {
                    "x": 16765.85868163172,
                    "y": 0,
                    "z": 0
                }
            ],
            "handle": "9F6",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 14665.85868163172,
                    "y": 140,
                    "z": 0
                },
                {
                    "x": 14665.85868163172,
                    "y": 0,
                    "z": 0
                }
            ],
            "handle": "9F7",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 6542.5,
                    "z": 0
                },
                {
                    "x": 12220.85868163172,
                    "y": 6542.5,
                    "z": 0
                }
            ],
            "handle": "9F8",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 8142.5,
                    "z": 0
                },
                {
                    "x": 12220.85868163172,
                    "y": 8142.5,
                    "z": 0
                }
            ],
            "handle": "9F9",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 3207.5,
                    "z": 0
                },
                {
                    "x": 12220.85868163172,
                    "y": 3207.5,
                    "z": 0
                }
            ],
            "handle": "9FA",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 1607.5,
                    "z": 0
                },
                {
                    "x": 12220.85868163172,
                    "y": 1607.5,
                    "z": 0
                }
            ],
            "handle": "9FB",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 16135.85868163172,
                    "y": 9610,
                    "z": 0
                },
                {
                    "x": 16135.85868163172,
                    "y": 9750,
                    "z": 0
                }
            ],
            "handle": "9FC",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 14035.85868163172,
                    "y": 9610,
                    "z": 0
                },
                {
                    "x": 14035.85868163172,
                    "y": 9750,
                    "z": 0
                }
            ],
            "handle": "9FD",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 12650.85868163172,
                    "y": 0
                },
                {
                    "x": 12690.85868163172,
                    "y": 0
                },
                {
                    "x": 12690.85868163172,
                    "y": 140
                },
                {
                    "x": 12650.85868163172,
                    "y": 140
                }
            ],
            "handle": "9FE",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 13710.85868163172,
                    "y": 0
                },
                {
                    "x": 13670.85868163172,
                    "y": 0
                },
                {
                    "x": 13670.85868163172,
                    "y": 140
                },
                {
                    "x": 13710.85868163172,
                    "y": 140
                }
            ],
            "handle": "9FF",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 16745.85868163172,
                    "y": 0
                },
                {
                    "x": 16705.85868163172,
                    "y": 0
                },
                {
                    "x": 16705.85868163172,
                    "y": 140
                },
                {
                    "x": 16745.85868163172,
                    "y": 140
                }
            ],
            "handle": "A00",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 14685.85868163172,
                    "y": 0
                },
                {
                    "x": 14725.85868163172,
                    "y": 0
                },
                {
                    "x": 14725.85868163172,
                    "y": 140
                },
                {
                    "x": 14685.85868163172,
                    "y": 140
                }
            ],
            "handle": "A01",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 14725.85868163172,
                    "y": 0,
                    "z": 0
                },
                {
                    "x": 16705.85868163172,
                    "y": 0,
                    "z": 0
                }
            ],
            "handle": "A02",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 14725.85868163172,
                    "y": 140,
                    "z": 0
                },
                {
                    "x": 16705.85868163172,
                    "y": 140,
                    "z": 0
                }
            ],
            "handle": "A03",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 14725.85868163172,
                    "y": 93.33333333333331,
                    "z": 0
                },
                {
                    "x": 16705.85868163172,
                    "y": 93.33333333333331,
                    "z": 0
                }
            ],
            "handle": "A04",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 14725.85868163172,
                    "y": 46.66666666666669,
                    "z": 0
                },
                {
                    "x": 16705.85868163172,
                    "y": 46.66666666666669,
                    "z": 0
                }
            ],
            "handle": "A05",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12220.85868163172,
                    "y": 3207.5,
                    "z": 0
                },
                {
                    "x": 12080.85868163172,
                    "y": 3207.5,
                    "z": 0
                }
            ],
            "handle": "A06",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12220.85868163172,
                    "y": 1607.5,
                    "z": 0
                },
                {
                    "x": 12080.85868163172,
                    "y": 1607.5,
                    "z": 0
                }
            ],
            "handle": "A07",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 3187.5
                },
                {
                    "x": 12080.85868163172,
                    "y": 3147.5
                },
                {
                    "x": 12220.85868163172,
                    "y": 3147.5
                },
                {
                    "x": 12220.85868163172,
                    "y": 3187.5
                }
            ],
            "handle": "A08",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 1627.5
                },
                {
                    "x": 12080.85868163172,
                    "y": 1667.5
                },
                {
                    "x": 12220.85868163172,
                    "y": 1667.5
                },
                {
                    "x": 12220.85868163172,
                    "y": 1627.5
                }
            ],
            "handle": "A09",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 1667.5,
                    "z": 0
                },
                {
                    "x": 12080.85868163172,
                    "y": 3147.5,
                    "z": 0
                }
            ],
            "handle": "A0A",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12220.85868163172,
                    "y": 1667.5,
                    "z": 0
                },
                {
                    "x": 12220.85868163172,
                    "y": 3147.5,
                    "z": 0
                }
            ],
            "handle": "A0B",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12174.19201496505,
                    "y": 1667.5,
                    "z": 0
                },
                {
                    "x": 12174.19201496505,
                    "y": 3147.5,
                    "z": 0
                }
            ],
            "handle": "A0C",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12127.52534829839,
                    "y": 1667.5,
                    "z": 0
                },
                {
                    "x": 12127.52534829839,
                    "y": 3147.5,
                    "z": 0
                }
            ],
            "handle": "A0D",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 8142.5,
                    "z": 0
                },
                {
                    "x": 12220.85868163172,
                    "y": 8142.5,
                    "z": 0
                }
            ],
            "handle": "A0E",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 6542.500000000001,
                    "z": 0
                },
                {
                    "x": 12220.85868163172,
                    "y": 6542.500000000001,
                    "z": 0
                }
            ],
            "handle": "A0F",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12220.85868163172,
                    "y": 8142.5,
                    "z": 0
                },
                {
                    "x": 12080.85868163172,
                    "y": 8142.5,
                    "z": 0
                }
            ],
            "handle": "A10",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12220.85868163172,
                    "y": 6542.500000000001,
                    "z": 0
                },
                {
                    "x": 12080.85868163172,
                    "y": 6542.500000000001,
                    "z": 0
                }
            ],
            "handle": "A11",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 8122.5
                },
                {
                    "x": 12080.85868163172,
                    "y": 8082.5
                },
                {
                    "x": 12220.85868163172,
                    "y": 8082.5
                },
                {
                    "x": 12220.85868163172,
                    "y": 8122.5
                }
            ],
            "handle": "A12",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 6562.500000000001
                },
                {
                    "x": 12080.85868163172,
                    "y": 6602.500000000001
                },
                {
                    "x": 12220.85868163172,
                    "y": 6602.500000000001
                },
                {
                    "x": 12220.85868163172,
                    "y": 6562.500000000001
                }
            ],
            "handle": "A13",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12080.85868163172,
                    "y": 6602.500000000001,
                    "z": 0
                },
                {
                    "x": 12080.85868163172,
                    "y": 8082.5,
                    "z": 0
                }
            ],
            "handle": "A14",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12220.85868163172,
                    "y": 6602.500000000001,
                    "z": 0
                },
                {
                    "x": 12220.85868163172,
                    "y": 8082.5,
                    "z": 0
                }
            ],
            "handle": "A15",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12174.19201496505,
                    "y": 6602.500000000001,
                    "z": 0
                },
                {
                    "x": 12174.19201496505,
                    "y": 8082.5,
                    "z": 0
                }
            ],
            "handle": "A16",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12127.52534829838,
                    "y": 6602.500000000001,
                    "z": 0
                },
                {
                    "x": 12127.52534829838,
                    "y": 8082.5,
                    "z": 0
                }
            ],
            "handle": "A17",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 16135.85868163172,
                    "y": 9750,
                    "z": 0
                },
                {
                    "x": 16135.85868163172,
                    "y": 9610,
                    "z": 0
                }
            ],
            "handle": "A18",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 14035.85868163172,
                    "y": 9750,
                    "z": 0
                },
                {
                    "x": 14035.85868163172,
                    "y": 9610,
                    "z": 0
                }
            ],
            "handle": "A19",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 16115.85868163172,
                    "y": 9610
                },
                {
                    "x": 16075.85868163172,
                    "y": 9610
                },
                {
                    "x": 16075.85868163172,
                    "y": 9750
                },
                {
                    "x": 16115.85868163172,
                    "y": 9750
                }
            ],
            "handle": "A1A",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 14055.85868163172,
                    "y": 9610
                },
                {
                    "x": 14095.85868163172,
                    "y": 9610
                },
                {
                    "x": 14095.85868163172,
                    "y": 9750
                },
                {
                    "x": 14055.85868163172,
                    "y": 9750
                }
            ],
            "handle": "A1B",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 14095.85868163172,
                    "y": 9610,
                    "z": 0
                },
                {
                    "x": 16075.85868163172,
                    "y": 9610,
                    "z": 0
                }
            ],
            "handle": "A1C",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 14095.85868163172,
                    "y": 9750,
                    "z": 0
                },
                {
                    "x": 16075.85868163172,
                    "y": 9750,
                    "z": 0
                }
            ],
            "handle": "A1D",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 14095.85868163172,
                    "y": 9703.333333333334,
                    "z": 0
                },
                {
                    "x": 16075.85868163172,
                    "y": 9703.333333333334,
                    "z": 0
                }
            ],
            "handle": "A1E",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 14095.85868163172,
                    "y": 9656.666666666666,
                    "z": 0
                },
                {
                    "x": 16075.85868163172,
                    "y": 9656.666666666666,
                    "z": 0
                }
            ],
            "handle": "A1F",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12690.85868163172,
                    "y": 0,
                    "z": 0
                },
                {
                    "x": 13670.85868163172,
                    "y": 0,
                    "z": 0
                }
            ],
            "handle": "A20",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12690.85868163172,
                    "y": 140,
                    "z": 0
                },
                {
                    "x": 13670.85868163172,
                    "y": 140,
                    "z": 0
                }
            ],
            "handle": "A21",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12690.85868163172,
                    "y": 93.33333333333331,
                    "z": 0
                },
                {
                    "x": 13670.85868163172,
                    "y": 93.33333333333333,
                    "z": 0
                }
            ],
            "handle": "A22",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12690.85868163172,
                    "y": 46.66666666666669,
                    "z": 0
                },
                {
                    "x": 13670.85868163172,
                    "y": 46.66666666666669,
                    "z": 0
                }
            ],
            "handle": "A23",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 1950,
                    "y": 0
                },
                {
                    "x": 2885,
                    "y": 0
                }
            ],
            "handle": "AB9",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 5285,
                    "y": 0
                },
                {
                    "x": 6310,
                    "y": 0
                },
                {
                    "x": 6310,
                    "y": 2335
                }
            ],
            "handle": "ABA",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 2255,
                    "y": 9750
                },
                {
                    "x": 300,
                    "y": 9750
                },
                {
                    "x": 300,
                    "y": 8142.5
                }
            ],
            "handle": "ABB",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 6542.5
                },
                {
                    "x": 300,
                    "y": 3207.5
                }
            ],
            "handle": "ABC",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 1607.5
                },
                {
                    "x": 300,
                    "y": 0
                },
                {
                    "x": 850,
                    "y": 0
                }
            ],
            "handle": "ABD",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 1950,
                    "y": 140
                },
                {
                    "x": 2885,
                    "y": 140
                }
            ],
            "handle": "ABE",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 5285,
                    "y": 140
                },
                {
                    "x": 6170,
                    "y": 140
                },
                {
                    "x": 6170,
                    "y": 2625.000000000001
                }
            ],
            "handle": "ABF",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 6170,
                    "y": 4964
                },
                {
                    "x": 6170,
                    "y": 9610
                },
                {
                    "x": 4355,
                    "y": 9610
                }
            ],
            "handle": "AC0",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 2255,
                    "y": 9610
                },
                {
                    "x": 440,
                    "y": 9610
                },
                {
                    "x": 440,
                    "y": 8142.5
                }
            ],
            "handle": "AC1",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 440,
                    "y": 6542.500000000002
                },
                {
                    "x": 440,
                    "y": 4964
                }
            ],
            "handle": "AC2",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 440,
                    "y": 4875
                },
                {
                    "x": 440,
                    "y": 3207.499999999998
                }
            ],
            "handle": "AC3",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 440,
                    "y": 1607.5
                },
                {
                    "x": 440,
                    "y": 140
                },
                {
                    "x": 850,
                    "y": 140
                }
            ],
            "handle": "AC4",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 850,
                    "y": 140,
                    "z": 0
                },
                {
                    "x": 850,
                    "y": 0,
                    "z": 0
                }
            ],
            "handle": "AC5",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 1950,
                    "y": 140,
                    "z": 0
                },
                {
                    "x": 1950,
                    "y": 0,
                    "z": 0
                }
            ],
            "handle": "AC6",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 5285,
                    "y": 140,
                    "z": 0
                },
                {
                    "x": 5285,
                    "y": 0,
                    "z": 0
                }
            ],
            "handle": "AC7",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 2885,
                    "y": 140,
                    "z": 0
                },
                {
                    "x": 2885,
                    "y": 0,
                    "z": 0
                }
            ],
            "handle": "AC8",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 6542.5,
                    "z": 0
                },
                {
                    "x": 440,
                    "y": 6542.5,
                    "z": 0
                }
            ],
            "handle": "AC9",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 8142.5,
                    "z": 0
                },
                {
                    "x": 440,
                    "y": 8142.5,
                    "z": 0
                }
            ],
            "handle": "ACA",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 4355,
                    "y": 9610,
                    "z": 0
                },
                {
                    "x": 4355,
                    "y": 9750,
                    "z": 0
                }
            ],
            "handle": "ACB",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 2255,
                    "y": 9610,
                    "z": 0
                },
                {
                    "x": 2255,
                    "y": 9750,
                    "z": 0
                }
            ],
            "handle": "ACC",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 870,
                    "y": 0
                },
                {
                    "x": 910,
                    "y": 0
                },
                {
                    "x": 910,
                    "y": 140
                },
                {
                    "x": 870,
                    "y": 140
                }
            ],
            "handle": "ACD",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 1930,
                    "y": 0
                },
                {
                    "x": 1890,
                    "y": 0
                },
                {
                    "x": 1890,
                    "y": 140
                },
                {
                    "x": 1930,
                    "y": 140
                }
            ],
            "handle": "ACE",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 5265,
                    "y": 0
                },
                {
                    "x": 5225,
                    "y": 0
                },
                {
                    "x": 5225,
                    "y": 140
                },
                {
                    "x": 5265,
                    "y": 140
                }
            ],
            "handle": "ACF",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 2905,
                    "y": 0
                },
                {
                    "x": 2945,
                    "y": 0
                },
                {
                    "x": 2945,
                    "y": 140
                },
                {
                    "x": 2905,
                    "y": 140
                }
            ],
            "handle": "AD0",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 2945,
                    "y": 0,
                    "z": 0
                },
                {
                    "x": 5225,
                    "y": 0,
                    "z": 0
                }
            ],
            "handle": "AD1",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 2945,
                    "y": 140,
                    "z": 0
                },
                {
                    "x": 5225,
                    "y": 140,
                    "z": 0
                }
            ],
            "handle": "AD2",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 2945,
                    "y": 93.33333333333394,
                    "z": 0
                },
                {
                    "x": 5225,
                    "y": 93.33333333333394,
                    "z": 0
                }
            ],
            "handle": "AD3",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 2945,
                    "y": 46.66666666666606,
                    "z": 0
                },
                {
                    "x": 5225,
                    "y": 46.66666666666606,
                    "z": 0
                }
            ],
            "handle": "AD4",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 8142.5,
                    "z": 0
                },
                {
                    "x": 440,
                    "y": 8142.5,
                    "z": 0
                }
            ],
            "handle": "AD5",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 6542.5,
                    "z": 0
                },
                {
                    "x": 440,
                    "y": 6542.5,
                    "z": 0
                }
            ],
            "handle": "AD6",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 440,
                    "y": 8142.5,
                    "z": 0
                },
                {
                    "x": 300,
                    "y": 8142.5,
                    "z": 0
                }
            ],
            "handle": "AD7",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 440,
                    "y": 6542.5,
                    "z": 0
                },
                {
                    "x": 300,
                    "y": 6542.5,
                    "z": 0
                }
            ],
            "handle": "AD8",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 8122.5
                },
                {
                    "x": 300,
                    "y": 8082.5
                },
                {
                    "x": 440,
                    "y": 8082.5
                },
                {
                    "x": 440,
                    "y": 8122.5
                }
            ],
            "handle": "AD9",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 6562.5
                },
                {
                    "x": 300,
                    "y": 6602.5
                },
                {
                    "x": 440,
                    "y": 6602.5
                },
                {
                    "x": 440,
                    "y": 6562.5
                }
            ],
            "handle": "ADA",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 6602.5,
                    "z": 0
                },
                {
                    "x": 300,
                    "y": 8082.5,
                    "z": 0
                }
            ],
            "handle": "ADB",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 440,
                    "y": 6602.5,
                    "z": 0
                },
                {
                    "x": 440,
                    "y": 8082.5,
                    "z": 0
                }
            ],
            "handle": "ADC",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 393.3333333333321,
                    "y": 6602.5,
                    "z": 0
                },
                {
                    "x": 393.3333333333321,
                    "y": 8082.5,
                    "z": 0
                }
            ],
            "handle": "ADD",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 346.6666666666679,
                    "y": 6602.5,
                    "z": 0
                },
                {
                    "x": 346.6666666666679,
                    "y": 8082.5,
                    "z": 0
                }
            ],
            "handle": "ADE",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 4355,
                    "y": 9750,
                    "z": 0
                },
                {
                    "x": 4355,
                    "y": 9610,
                    "z": 0
                }
            ],
            "handle": "ADF",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 2255,
                    "y": 9750,
                    "z": 0
                },
                {
                    "x": 2255,
                    "y": 9610,
                    "z": 0
                }
            ],
            "handle": "AE0",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 4335,
                    "y": 9610
                },
                {
                    "x": 4295,
                    "y": 9610
                },
                {
                    "x": 4295,
                    "y": 9750
                },
                {
                    "x": 4335,
                    "y": 9750
                }
            ],
            "handle": "AE1",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 2275,
                    "y": 9610
                },
                {
                    "x": 2315,
                    "y": 9610
                },
                {
                    "x": 2315,
                    "y": 9750
                },
                {
                    "x": 2275,
                    "y": 9750
                }
            ],
            "handle": "AE2",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 2315,
                    "y": 9610,
                    "z": 0
                },
                {
                    "x": 4295,
                    "y": 9610,
                    "z": 0
                }
            ],
            "handle": "AE3",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 2315,
                    "y": 9750,
                    "z": 0
                },
                {
                    "x": 4295,
                    "y": 9750,
                    "z": 0
                }
            ],
            "handle": "AE4",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 2315,
                    "y": 9703.333333333332,
                    "z": 0
                },
                {
                    "x": 4295,
                    "y": 9703.333333333332,
                    "z": 0
                }
            ],
            "handle": "AE5",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 2315,
                    "y": 9656.666666666668,
                    "z": 0
                },
                {
                    "x": 4295,
                    "y": 9656.666666666668,
                    "z": 0
                }
            ],
            "handle": "AE6",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 3207.5,
                    "z": 0
                },
                {
                    "x": 440,
                    "y": 3207.5,
                    "z": 0
                }
            ],
            "handle": "AE7",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 1607.5,
                    "z": 0
                },
                {
                    "x": 440,
                    "y": 1607.5,
                    "z": 0
                }
            ],
            "handle": "AE8",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 1607.5,
                    "z": 0
                },
                {
                    "x": 440,
                    "y": 1607.5,
                    "z": 0
                }
            ],
            "handle": "AE9",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 3207.5,
                    "z": 0
                },
                {
                    "x": 440,
                    "y": 3207.5,
                    "z": 0
                }
            ],
            "handle": "AEA",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 440,
                    "y": 1607.5,
                    "z": 0
                },
                {
                    "x": 300,
                    "y": 1607.5,
                    "z": 0
                }
            ],
            "handle": "AEB",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 440,
                    "y": 3207.5,
                    "z": 0
                },
                {
                    "x": 300,
                    "y": 3207.5,
                    "z": 0
                }
            ],
            "handle": "AEC",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 1627.5
                },
                {
                    "x": 300,
                    "y": 1667.5
                },
                {
                    "x": 440,
                    "y": 1667.5
                },
                {
                    "x": 440,
                    "y": 1627.5
                }
            ],
            "handle": "AED",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 3187.5
                },
                {
                    "x": 300,
                    "y": 3147.5
                },
                {
                    "x": 440,
                    "y": 3147.5
                },
                {
                    "x": 440,
                    "y": 3187.5
                }
            ],
            "handle": "AEE",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 300,
                    "y": 3147.5,
                    "z": 0
                },
                {
                    "x": 300,
                    "y": 1667.5,
                    "z": 0
                }
            ],
            "handle": "AEF",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 440,
                    "y": 3147.5,
                    "z": 0
                },
                {
                    "x": 440,
                    "y": 1667.5,
                    "z": 0
                }
            ],
            "handle": "AF0",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 393.3333333333321,
                    "y": 3147.5,
                    "z": 0
                },
                {
                    "x": 393.3333333333321,
                    "y": 1667.5,
                    "z": 0
                }
            ],
            "handle": "AF1",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 346.6666666666679,
                    "y": 3147.5,
                    "z": 0
                },
                {
                    "x": 346.6666666666679,
                    "y": 1667.5,
                    "z": 0
                }
            ],
            "handle": "AF2",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 440,
                    "y": 4875,
                    "z": 0
                },
                {
                    "x": 850.0000000000036,
                    "y": 4875.000000000002,
                    "z": 0
                }
            ],
            "handle": "AF3",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 1800.000000000004,
                    "y": 4875.000000000002,
                    "z": 0
                },
                {
                    "x": 6170,
                    "y": 4875,
                    "z": 0
                }
            ],
            "handle": "AF4",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 440,
                    "y": 4964,
                    "z": 0
                },
                {
                    "x": 850.0000000000036,
                    "y": 4964.000000000002,
                    "z": 0
                }
            ],
            "handle": "AF5",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 1800.000000000004,
                    "y": 4964.000000000002,
                    "z": 0
                },
                {
                    "x": 6170,
                    "y": 4964,
                    "z": 0
                }
            ],
            "handle": "AF6",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 850,
                    "y": 4875,
                    "z": 0
                },
                {
                    "x": 850,
                    "y": 4964.000000000002,
                    "z": 0
                }
            ],
            "handle": "AF7",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 1800,
                    "y": 4875,
                    "z": 0
                },
                {
                    "x": 1800,
                    "y": 4964.000000000002,
                    "z": 0
                }
            ],
            "handle": "AF8",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 910,
                    "y": 70
                },
                {
                    "x": 935,
                    "y": 70
                },
                {
                    "x": 935,
                    "y": -885
                },
                {
                    "x": 910,
                    "y": -885
                }
            ],
            "handle": "AF9",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 2,
            "color": 16776960,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "ARC",
            "handle": "AFA",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 2,
            "color": 16776960,
            "center": {
                "x": 935,
                "y": 70,
                "z": 0
            },
            "radius": 955,
            "startAngle": 4.71238898038469,
            "endAngle": 0,
            "angleLength": -4.71238898038469
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 870,
                    "y": 4875.000000000002
                },
                {
                    "x": 910,
                    "y": 4875.000000000002
                },
                {
                    "x": 910,
                    "y": 4964.000000000002
                },
                {
                    "x": 870,
                    "y": 4964.000000000002
                }
            ],
            "handle": "AFB",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 2,
            "color": 16776960,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 1780,
                    "y": 4875.000000000002
                },
                {
                    "x": 1740,
                    "y": 4875.000000000002
                },
                {
                    "x": 1740,
                    "y": 4964.000000000002
                },
                {
                    "x": 1780,
                    "y": 4964.000000000002
                }
            ],
            "handle": "AFC",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 2,
            "color": 16776960,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 910,
                    "y": 4919.500000000002
                },
                {
                    "x": 935,
                    "y": 4919.500000000002
                },
                {
                    "x": 935,
                    "y": 5724.500000000002
                },
                {
                    "x": 910,
                    "y": 5724.500000000002
                }
            ],
            "handle": "AFD",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 2,
            "color": 16776960,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "ARC",
            "handle": "AFE",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 2,
            "color": 16776960,
            "center": {
                "x": 935,
                "y": 4919.500000000002,
                "z": 0
            },
            "radius": 805,
            "startAngle": 0,
            "endAngle": 1.5707963267948966,
            "angleLength": 1.5707963267948966
        },
        {
            "type": "MTEXT",
            "handle": "B13",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "position": {
                "x": 1695.340909224717,
                "y": -1474.783721498909,
                "z": 0
            },
            "height": 300,
            "width": 2489.791670313556,
            "attachmentPoint": 1,
            "drawingDirection": 5,
            "text": "{\\fSimSun|b0|i0|c134|p2;一层平面图}"
        },
        {
            "type": "MTEXT",
            "handle": "B14",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "position": {
                "x": 13938.40991385805,
                "y": -1474.783721498909,
                "z": 0
            },
            "height": 300,
            "width": 2489.791670313556,
            "attachmentPoint": 1,
            "drawingDirection": 5,
            "text": "{\\fSimSun|b0|i0|c134|p2;二层平面图}"
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 6310,
                    "y": 2475
                },
                {
                    "x": 7210.000000000002,
                    "y": 2475
                }
            ],
            "handle": "CDB",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 6310,
                    "y": 2335
                },
                {
                    "x": 7210.000000000002,
                    "y": 2335
                }
            ],
            "handle": "CDC",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 6310,
                    "y": 7415.000000000002
                },
                {
                    "x": 6310,
                    "y": 9750
                },
                {
                    "x": 4355,
                    "y": 9750
                }
            ],
            "handle": "CDD",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 6310,
                    "y": 2475.000000000001
                },
                {
                    "x": 6310,
                    "y": 2625.000000000001
                }
            ],
            "handle": "CDE",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 6310,
                    "y": 2625.000000000001,
                    "z": 0
                },
                {
                    "x": 6170,
                    "y": 2625.000000000001,
                    "z": 0
                }
            ],
            "handle": "CE8",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 6310,
                    "y": 3825.000000000001,
                    "z": 0
                },
                {
                    "x": 6170,
                    "y": 3825.000000000001,
                    "z": 0
                }
            ],
            "handle": "CE9",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 6170,
                    "y": 3825
                },
                {
                    "x": 6170,
                    "y": 4875
                }
            ],
            "handle": "CEA",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 6310,
                    "y": 3825.000000000001
                },
                {
                    "x": 6310,
                    "y": 7275
                }
            ],
            "handle": "CEB",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 18090.85868163172,
                    "y": 2475
                },
                {
                    "x": 18990.85868163172,
                    "y": 2475
                }
            ],
            "handle": "CFE",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 18090.85868163172,
                    "y": 2335
                },
                {
                    "x": 18990.85868163172,
                    "y": 2335
                }
            ],
            "handle": "CFF",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12220.85868163172,
                    "y": 4875.000000000002,
                    "z": 0
                },
                {
                    "x": 12630.85868163172,
                    "y": 4875.000000000002,
                    "z": 0
                }
            ],
            "handle": "D00",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12220.85868163172,
                    "y": 4964.000000000002,
                    "z": 0
                },
                {
                    "x": 12630.85868163172,
                    "y": 4964.000000000003,
                    "z": 0
                }
            ],
            "handle": "D01",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 17950.85868163172,
                    "y": 2625.000000000001,
                    "z": 0
                },
                {
                    "x": 18090.85868163172,
                    "y": 2625.000000000001,
                    "z": 0
                }
            ],
            "handle": "D02",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 17950.85868163172,
                    "y": 3825,
                    "z": 0
                },
                {
                    "x": 18090.85868163172,
                    "y": 3825,
                    "z": 0
                }
            ],
            "handle": "D03",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 17950.85868163172,
                    "y": 3825
                },
                {
                    "x": 17950.85868163172,
                    "y": 4875
                }
            ],
            "handle": "D05",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 18090.85868163172,
                    "y": 3825
                },
                {
                    "x": 18090.85868163172,
                    "y": 7275
                }
            ],
            "handle": "D06",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 18090.85868163172,
                    "y": 2475
                },
                {
                    "x": 18090.85868163172,
                    "y": 2625.000000000001
                }
            ],
            "handle": "D07",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 18090.85868163172,
                    "y": 7415
                },
                {
                    "x": 18090.85868163172,
                    "y": 9750
                },
                {
                    "x": 16135.85868163172,
                    "y": 9750
                }
            ],
            "handle": "D08",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 17950.85868163172,
                    "y": 4964
                },
                {
                    "x": 17950.85868163172,
                    "y": 9610
                },
                {
                    "x": 16135.85868163172,
                    "y": 9610
                }
            ],
            "handle": "D09",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 12220.85868163172,
                    "y": 4875.000000000002
                },
                {
                    "x": 12220.85868163172,
                    "y": 3207.500000000001
                }
            ],
            "handle": "D0A",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 12630.85868163172,
                    "y": 4875.000000000002,
                    "z": 0
                },
                {
                    "x": 12630.85868163172,
                    "y": 4964.000000000004,
                    "z": 0
                }
            ],
            "handle": "D2F",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 13580.85868163172,
                    "y": 4875.000000000002,
                    "z": 0
                },
                {
                    "x": 13580.85868163172,
                    "y": 4964.000000000004,
                    "z": 0
                }
            ],
            "handle": "D30",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 12650.85868163172,
                    "y": 4875.000000000004
                },
                {
                    "x": 12690.85868163172,
                    "y": 4875.000000000004
                },
                {
                    "x": 12690.85868163172,
                    "y": 4964.000000000004
                },
                {
                    "x": 12650.85868163172,
                    "y": 4964.000000000004
                }
            ],
            "handle": "D31",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 2,
            "color": 16776960,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 13560.85868163172,
                    "y": 4875.000000000004
                },
                {
                    "x": 13520.85868163172,
                    "y": 4875.000000000004
                },
                {
                    "x": 13520.85868163172,
                    "y": 4964.000000000004
                },
                {
                    "x": 13560.85868163172,
                    "y": 4964.000000000004
                }
            ],
            "handle": "D32",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 2,
            "color": 16776960,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 12690.85868163172,
                    "y": 4919.500000000004
                },
                {
                    "x": 12715.85868163172,
                    "y": 4919.500000000004
                },
                {
                    "x": 12715.85868163172,
                    "y": 5724.500000000004
                },
                {
                    "x": 12690.85868163172,
                    "y": 5724.500000000004
                }
            ],
            "handle": "D33",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 2,
            "color": 16776960,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "ARC",
            "handle": "D34",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 2,
            "color": 16776960,
            "center": {
                "x": 12715.85868163172,
                "y": 4919.500000000004,
                "z": 0
            },
            "radius": 805,
            "startAngle": 0,
            "endAngle": 1.5707963267948966,
            "angleLength": 1.5707963267948966
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 13580.85868163172,
                    "y": 4964.000000000002,
                    "z": 0
                },
                {
                    "x": 17950.85868163172,
                    "y": 4964,
                    "z": 0
                }
            ],
            "handle": "D35",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 13580.85868163172,
                    "y": 4875.000000000001,
                    "z": 0
                },
                {
                    "x": 17950.85868163172,
                    "y": 4875,
                    "z": 0
                }
            ],
            "handle": "D36",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 20190.85868163172,
                    "y": 2475.000000000001,
                    "z": 0
                },
                {
                    "x": 20190.85868163172,
                    "y": 2335.000000000001,
                    "z": 0
                }
            ],
            "handle": "D5C",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 18990.85868163172,
                    "y": 2475.000000000001,
                    "z": 0
                },
                {
                    "x": 18990.85868163172,
                    "y": 2335,
                    "z": 0
                }
            ],
            "handle": "D5D",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 20190.85868163172,
                    "y": 2335.000000000001
                },
                {
                    "x": 21230.85868163172,
                    "y": 2335.000000000001
                },
                {
                    "x": 21230.85868163172,
                    "y": 7414.999999999999
                },
                {
                    "x": 18090.85868163172,
                    "y": 7415
                }
            ],
            "handle": "D5E",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 20190.85868163172,
                    "y": 2475.000000000001
                },
                {
                    "x": 21090.85868163172,
                    "y": 2475.000000000001
                },
                {
                    "x": 21090.85868163172,
                    "y": 7274.999999999998
                },
                {
                    "x": 18090.85868163172,
                    "y": 7275
                }
            ],
            "handle": "D5F",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 18990.85868163172,
                    "y": 2475,
                    "z": 0
                },
                {
                    "x": 18990.85868163172,
                    "y": 2335,
                    "z": 0
                }
            ],
            "handle": "D60",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 20190.85868163172,
                    "y": 2475.000000000001,
                    "z": 0
                },
                {
                    "x": 20190.85868163172,
                    "y": 2335.000000000001,
                    "z": 0
                }
            ],
            "handle": "D61",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 19010.85868163172,
                    "y": 2335
                },
                {
                    "x": 19050.85868163172,
                    "y": 2335
                },
                {
                    "x": 19050.85868163172,
                    "y": 2475
                },
                {
                    "x": 19010.85868163172,
                    "y": 2475
                }
            ],
            "handle": "D62",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 20170.85868163172,
                    "y": 2335.000000000001
                },
                {
                    "x": 20130.85868163172,
                    "y": 2335.000000000001
                },
                {
                    "x": 20130.85868163172,
                    "y": 2475.000000000001
                },
                {
                    "x": 20170.85868163172,
                    "y": 2475.000000000001
                }
            ],
            "handle": "D63",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 19050.85868163172,
                    "y": 2335,
                    "z": 0
                },
                {
                    "x": 20130.85868163172,
                    "y": 2335.000000000001,
                    "z": 0
                }
            ],
            "handle": "D64",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 19050.85868163172,
                    "y": 2475,
                    "z": 0
                },
                {
                    "x": 20130.85868163172,
                    "y": 2475.000000000001,
                    "z": 0
                }
            ],
            "handle": "D65",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 19050.85868163172,
                    "y": 2428.333333333334,
                    "z": 0
                },
                {
                    "x": 20130.85868163172,
                    "y": 2428.333333333334,
                    "z": 0
                }
            ],
            "handle": "D66",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 19050.85868163172,
                    "y": 2381.666666666667,
                    "z": 0
                },
                {
                    "x": 20130.85868163172,
                    "y": 2381.666666666667,
                    "z": 0
                }
            ],
            "handle": "D67",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 6310,
                    "y": 2475,
                    "z": 0
                },
                {
                    "x": 9309.999999999998,
                    "y": 7274.999999999998,
                    "z": 0
                }
            ],
            "handle": "D9F",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 252,
            "color": 8684676
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 6310,
                    "y": 7275,
                    "z": 0
                },
                {
                    "x": 9310.000000000002,
                    "y": 2475.000000000001,
                    "z": 0
                }
            ],
            "handle": "DA0",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 252,
            "color": 8684676
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 18090.85868163172,
                    "y": 2475
                },
                {
                    "x": 18830.28035205785,
                    "y": 6496.285533122096
                },
                {
                    "x": 21090.85868163172,
                    "y": 7274.999999999998
                }
            ],
            "handle": "DA1",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 252,
            "color": 8684676,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 7210.000000000002,
                    "y": 2475.000000000001,
                    "z": 0
                },
                {
                    "x": 7210.000000000002,
                    "y": 2335,
                    "z": 0
                }
            ],
            "handle": "DB9",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 8410.000000000002,
                    "y": 2475.000000000001,
                    "z": 0
                },
                {
                    "x": 8410.000000000002,
                    "y": 2335.000000000001,
                    "z": 0
                }
            ],
            "handle": "DBA",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 7210.000000000002,
                    "y": 2475,
                    "z": 0
                },
                {
                    "x": 7210.000000000002,
                    "y": 2335,
                    "z": 0
                }
            ],
            "handle": "DBB",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 8410.000000000002,
                    "y": 2475.000000000001,
                    "z": 0
                },
                {
                    "x": 8410.000000000002,
                    "y": 2335.000000000001,
                    "z": 0
                }
            ],
            "handle": "DBC",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 7230.000000000002,
                    "y": 2335
                },
                {
                    "x": 7270.000000000002,
                    "y": 2335
                },
                {
                    "x": 7270.000000000002,
                    "y": 2475
                },
                {
                    "x": 7230.000000000002,
                    "y": 2475
                }
            ],
            "handle": "DBD",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 8390.000000000002,
                    "y": 2335.000000000001
                },
                {
                    "x": 8350.000000000002,
                    "y": 2335.000000000001
                },
                {
                    "x": 8350.000000000002,
                    "y": 2475.000000000001
                },
                {
                    "x": 8390.000000000002,
                    "y": 2475.000000000001
                }
            ],
            "handle": "DBE",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535,
            "shape": true,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 7270.000000000002,
                    "y": 2335,
                    "z": 0
                },
                {
                    "x": 8350.000000000002,
                    "y": 2335.000000000001,
                    "z": 0
                }
            ],
            "handle": "DBF",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 7270.000000000002,
                    "y": 2475,
                    "z": 0
                },
                {
                    "x": 8350.000000000002,
                    "y": 2475.000000000001,
                    "z": 0
                }
            ],
            "handle": "DC0",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 7270.000000000002,
                    "y": 2428.333333333334,
                    "z": 0
                },
                {
                    "x": 8350.000000000002,
                    "y": 2428.333333333334,
                    "z": 0
                }
            ],
            "handle": "DC1",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LINE",
            "vertices": [
                {
                    "x": 7270.000000000002,
                    "y": 2381.666666666667,
                    "z": 0
                },
                {
                    "x": 8350.000000000002,
                    "y": 2381.666666666667,
                    "z": 0
                }
            ],
            "handle": "DC2",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 4,
            "color": 65535
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 8410.000000000002,
                    "y": 2475.000000000001
                },
                {
                    "x": 9310.000000000002,
                    "y": 2475.000000000001
                },
                {
                    "x": 9309.999999999998,
                    "y": 7274.999999999998
                },
                {
                    "x": 6309.999999999999,
                    "y": 7275
                }
            ],
            "handle": "DC3",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        },
        {
            "type": "LWPOLYLINE",
            "vertices": [
                {
                    "x": 8410.000000000002,
                    "y": 2335.000000000001
                },
                {
                    "x": 9450.000000000002,
                    "y": 2335.000000000001
                },
                {
                    "x": 9449.999999999998,
                    "y": 7414.999999999999
                },
                {
                    "x": 6310.000000000001,
                    "y": 7415
                }
            ],
            "handle": "DC4",
            "ownerHandle": "1F",
            "layer": "0",
            "colorIndex": 7,
            "color": 16777215,
            "shape": false,
            "hasContinuousLinetypePattern": false
        }
    ]
}

const vertices = obj.entities.filter(item => item.vertices && item.vertices.length>2);
console.log(vertices);



const typeCounts = obj.entities.reduce((acc, item) => {
    const type = item.type;
    if (acc[type]) {
        acc[type]++;
    } else {
        acc[type] = 1;
    }
    return acc;
}, {});
// console.log(typeCounts);


const group = new THREE.Group();

obj.entities.forEach(entity => {
    if (entity.type === 'LINE' || entity.type === 'LWPOLYLINE') {
       
        const color = decimalToHexColor(entity.color);

        const vertices = [...entity.vertices];
        if (entity.shape) {
            vertices.push(vertices[0]);
        }

        const line = createLineFromVertices(vertices, color);
        
        group.add(line);
    } else if (entity.type === 'ARC') {
        const center = new THREE.Vector3().copy(entity.center);
        const radius = entity.radius;
        const startAngle = entity.startAngle; // 以弧度为单位
        const endAngle = entity.endAngle;
        const color = decimalToHexColor(entity.color); // 16776960 转换为 0xFFFF00

        // 创建材质
        const material = new THREE.LineBasicMaterial({ color: color });

        // 创建椭圆曲线 (实际上是圆弧的一部分)
        const arcCurve = new THREE.EllipseCurve(
            center.x, center.y,  // 圆心位置
            radius, radius,      // X轴和Y轴半径相同
            startAngle, endAngle,// 起始角度和结束角度
            false,                // 顺时针绘制
            0                    // 无旋转
        );

        // 获取曲线的点
        const points = arcCurve.getPoints(50); // 可以根据需要调整点的数量

        // 创建几何体并将其与材质结合
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const arcLine = new THREE.Line(geometry, material);
        material.dispose();

        group.add(arcLine);
    }

});

scene.add(group);





function createLineFromVertices(vertices, color) {
    // 创建几何体
    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);

    // 创建材质
    const material = new THREE.LineBasicMaterial({ color: color });

    // 创建线条对象
    const line = new THREE.Line(geometry, material);

    material.dispose();

    return line;
}





function decimalToHexColor(decimal) {
    // 将十进制数转换为十六进制字符串，并填充前导零使其长度为6位
    // return parseInt(decimal.toString(16), 16);
    if (!decimal) {
        return 0xffffff;
    }
    const hex = decimal.toString(16).toUpperCase().padStart(6, '0');
    return parseInt(`0x${hex}`);
}