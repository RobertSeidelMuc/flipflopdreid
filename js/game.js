const sphereRadius = 3;
const goalSphereRadius = 6;

const leftEdge = -75;
const rightEdge = 75;
const topEdge = 32;
const bottomEdge = -32;

var loader = new THREE.FontLoader();

var pointsGeometry;

var punkte = 0;
var mouseX = 0;
var mouseY = 0;
var startX = -50;
var startY = 30;
var startZ = (Math.random() * 30);
var zielX = (Math.random() * ((rightEdge-leftEdge) - (rightEdge-leftEdge)/3) + 1 - (goalSphereRadius * 2) + leftEdge + (rightEdge-leftEdge)/3);
var zielY = (Math.random() * ((topEdge-bottomEdge) - (topEdge-bottomEdge)/3) + 1 - (goalSphereRadius * 2) + bottomEdge + (topEdge-bottomEdge)/3);
var gameStarted = false;
var screenWidth = 1024;
var screenHeight = 600;

document.addEventListener("DOMContentLoaded", function() {
  document.addEventListener("click", (event) => startGame(event));
  document.querySelector("canvas").addEventListener("mousemove", (event) => setMousePosition(event));
});


function setMousePosition(event) {
  var rect = event.target.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 50, screenWidth / screenHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer( { antialias: false } );

var ambientLight = new THREE.AmbientLight( 0x404040, 0.2 ); // soft white light
const pointLight = new THREE.PointLight( 0x404040 , 12, 175 );


var lineMaterial = new THREE.LineDashedMaterial( { color: 'green' } );
var linePoints = [];
linePoints.push( new THREE.Vector3( startX, startY, 20 ) );
linePoints.push( new THREE.Vector3( 0, 0, 0 ) );
var lineGeometry = new THREE.BufferGeometry().setFromPoints( linePoints );
var line = new THREE.Line( lineGeometry, lineMaterial );

var sphereGeometry = new THREE.SphereBufferGeometry(sphereRadius, 10, 10);
var sphereMaterial = new THREE.MeshStandardMaterial( {color: 'red'} );
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );

var sphere2Geometry = new THREE.SphereBufferGeometry(goalSphereRadius, 12, 12);
var sphere2Material = new THREE.MeshStandardMaterial( {color: 'yellow'} );
var goalSphere = new THREE.Mesh( sphere2Geometry, sphere2Material );

var wallMaterial = new THREE.MeshStandardMaterial( {color: 'blue'} );

var wallBackGeometry = new THREE.BoxBufferGeometry(150, 106, 1);
var wallBack = new THREE.Mesh( wallBackGeometry, wallMaterial );

var wallSideGeometry = new THREE.BoxBufferGeometry(1, 106, 60);
var wallLeft = new THREE.Mesh( wallSideGeometry, wallMaterial );
var wallRight = new THREE.Mesh( wallSideGeometry, wallMaterial );

var wallHorizontalGeometry = new THREE.BoxBufferGeometry(150, 1, 60);
var wallTop = new THREE.Mesh( wallHorizontalGeometry, wallMaterial );
var wallBottom = new THREE.Mesh( wallHorizontalGeometry, wallMaterial );

var geschwX = 0.0;
var geschwY = 0.0;

function setup() {
  // loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

  //   pointsGeometry = new THREE.TextGeometry( '1', {
  //     font: font,
  //     size: 80,
  //     height: 5,
  //     curveSegments: 12,
  //     bevelEnabled: true,
  //     bevelThickness: 10,
  //     bevelSize: 8,
  //     bevelOffset: 0,
  //     bevelSegments: 5
  //   } );

  //   var pointsMaterial = new THREE.MeshStandardMaterial( 
  //     { color: 0xff0000, specular: 0xffffff }
  //   );
  //   var points = new THREE.Mesh( pointsGeometry, pointsMaterial );
  //   scene.add( points );
  // } );


  scene.background = new THREE.Color( 'skyblue' );
  camera.position.set( 0, 0, 125 );

  renderer.setSize( screenWidth, screenHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  document.body.appendChild( renderer.domElement );

  scene.add( ambientLight );

  pointLight.position.set( 0, 15, 120 );
  pointLight.shadow.mapSize.width = 800;  // default
  pointLight.shadow.mapSize.height = 800; // default
  pointLight.castShadow = true;
  pointLight.shadow.camera.fov = 89;
  scene.add( pointLight );

  wallLeft.position.set(leftEdge, 10, 0);
  wallRight.position.set(rightEdge, 10, 0);
  wallBack.position.set(0, 10, -10);
  wallTop.position.set(0, 63, 0);
  wallBottom.position.set(0, -43, 0);
  wallBack.receiveShadow = true;
  wallTop.receiveShadow = true;
  wallBottom.receiveShadow = true;
  wallLeft.receiveShadow = true;
  wallRight.receiveShadow = true;

  scene.add( wallLeft );
  scene.add( wallBack );
  scene.add( wallRight );
  scene.add( wallTop );
  scene.add( wallBottom );

  scene.add( line );

  sphere.castShadow = true;
  sphere.receiveShadow = true;
  sphere.position.set(startX, startY, startZ)
  scene.add( sphere );

  goalSphere.castShadow = true;
  goalSphere.receiveShadow = true;
  goalSphere.position.set(zielX, zielY, sphere.position.z);
  scene.add( goalSphere );
}

function startGame(event) {
  gameStarted = true;
  scene.remove( line );

  zielX = (Math.random() * rightEdge-leftEdge) - goalSphereRadius * 2;

  sphere.position.x = startX;
  sphere.position.y = startY;
  
  var rect = event.target.getBoundingClientRect();
  mouseX = event.clientX -rect.left;
  mouseY = event.clientY - rect.top;

  geschwX = ((mouseX - screenWidth/2)/10 - startX) / 25;
  geschwY = ((mouseY - screenHeight/2)/-10 - startY)  / 25;
}

function gameReset() {
  zielX = (Math.random() * ((rightEdge-leftEdge) - (rightEdge-leftEdge)/3) + 1 - (goalSphereRadius * 2) + leftEdge + (rightEdge-leftEdge)/3);
  zielY = (Math.random() * ((topEdge-bottomEdge) - (topEdge-bottomEdge)/3) + 1 - (goalSphereRadius * 2) + bottomEdge + (topEdge-bottomEdge)/3);
  startZ = (Math.random() * 30);
  sphere.position.x = startX;
  sphere.position.y = startY;
  sphere.position.z = startZ;
  goalSphere.position.x = zielX;
  goalSphere.position.y = zielY;
  goalSphere.position.z = sphere.position.z;
  scene.add(line);
}

function collisionCheck() {
  if (sphere.position.distanceTo(goalSphere.position) <= sphereRadius + goalSphereRadius + 1) {
    gameStarted = false;
    punkte++;
    gameReset();
  }
}

function animate() {
  requestAnimationFrame( animate );

  if (!gameStarted) {
    linePoints = [];
    linePoints.push( new THREE.Vector3( sphere.position.x, sphere.position.y, sphere.position.z ) );
    linePoints.push( new THREE.Vector3( (mouseX - screenWidth/2)*0.1, (mouseY - screenHeight/2)*-0.1, 60 ) );
    line.geometry = new THREE.BufferGeometry().setFromPoints( linePoints );
  }
  else {
    if (sphere.position.y > -42 + sphereRadius) {
      geschwY -= 0.06;
    }

    sphere.position.x += geschwX;
    sphere.position.y += geschwY;

    collisionCheck();
  
    if (sphere.position.x > 74 - sphereRadius) {
      sphere.position.x = 74 - sphereRadius - 0.1;
      geschwX = geschwX * -0.9;
    }
    if (sphere.position.x < -74 + sphereRadius) {
      sphere.position.x = -74 + sphereRadius + 0.1;
      geschwX = geschwX * -0.9;
    }
    if (sphere.position.y > 62 - sphereRadius) {
      sphere.position.y = 62 - sphereRadius - 0.1;
      geschwY = geschwY * -0.9;
    }
    if (sphere.position.y < -42 + sphereRadius) {
      sphere.position.y = -42 + sphereRadius + 0.1;
      geschwY = geschwY * -0.9;
    }
  }

  renderer.render( scene, camera );
}
setup();
animate();