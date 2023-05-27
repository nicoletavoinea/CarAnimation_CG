//Variables for setup
let container;
let camera;
let renderer;
let scene;
let isRotating = false;
let rotationInterval;

//Load Models
let cars = []; // array to store all the cars
let activeCarIndex = 0; // variable to keep track of the active car

let prev = { x: 0, y: 0 };
let mouse = { x: 0, y: 0 };
let isDragging = false;
const sensitivity = 0.005;

let rotateButton = document.getElementById("myButton"); 

function init() {
  container = document.querySelector(".scene");
  rotateButton.addEventListener("click", rotateCar);

  //Create scene
  scene = new THREE.Scene();

  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 1000;

  //Camera setup
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.set(0, 3, 30);
  const cameraHeight = 8; // Adjust the camera height
  camera.position.set(0, cameraHeight, 40);
  camera.lookAt(new THREE.Vector3(0, 0, 0)); // Set the camera's target

  const ambient = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(-5, 10, 5);
  scene.add(light);

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  //first car
  let loader1 = new THREE.GLTFLoader();
  loader1.load("./models/car1.glb", function (gltf) {
    scene.add(gltf.scene);
    car = gltf.scene.children[0];
    car.scale.set(33, 33, 33); // <-- add this line to make the car bigger
    car.rotation.z=0.5;
    car.position.set(-1.5,0,15)
    car.visible=true;
    cars.push(car);
    animate();
  });

  //second car
  let loader2 = new THREE.GLTFLoader();
  loader2.load("./models/car2.glb", function (gltf) {
    scene.add(gltf.scene);
    car = gltf.scene.children[0];
    car.scale.set(5, 5, 5); // <-- add this line to make the car bigger
    car.rotation.z=0.5;
    car.position.set(-1.5,0.5,15)
    car.visible=false;
    cars.push(car);
    animate();
  });

  //third car
  let loader3 = new THREE.GLTFLoader();
  loader3.load("./models/car3.glb", function (gltf) {
    scene.add(gltf.scene);
    car = gltf.scene.children[0];
    car.scale.set(2, 2, 2); // <-- add this line to make the car bigger
    car.rotation.z=0.5;
    car.position.set(-1.5,0.6,15)
    car.visible=false;
    cars.push(car);
    animate();
  });

  //load track
  let loader = new THREE.GLTFLoader();
  loader.load("./models/track.glb", function (gltf) {
    scene.add(gltf.scene);
    track = gltf.scene.children[0];
    track.scale.set(3, 3, 3); // <-- add this line to make the car bigger
    track.rotation.z=-0.4;
    track.visible=true;
    track.position.set(-3,0,0);
    animate();
  });

  //Key events
  document.addEventListener("keydown", onKeyDown);

  // Mouse events
  container.addEventListener("mousedown", onMouseDown);
  container.addEventListener("mousemove", onMouseMove);
  container.addEventListener("mouseup", onMouseUp);
  container.addEventListener("mouseleave", onMouseLeave);
  container.addEventListener("wheel", onMouseScroll);

  
  // console.log("Cars loaded. Ready to use.");
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onMouseDown(event) {
  isDragging = true;
  mouse.x = event.clientX;
}

function onMouseMove(event) {
  if (!isDragging) return;

  const deltaX = event.clientX - mouse.x;
  mouse.x = event.clientX;


  const rotZ = cars[activeCarIndex].rotation.z + deltaX * sensitivity;
  cars[activeCarIndex].rotation.z = rotZ;

  renderer.render(scene, camera);
}

function onMouseUp(event) {
  isDragging = false;
}

function onMouseLeave(event) {
  isDragging = false;
}

function onKeyDown(event) {
  let key=event.keyCode;
  console.log('keypressed: '+key);
  if (event.keyCode == 37) { // left arrow
    activeCarIndex--;
    if (activeCarIndex < 0) {
      activeCarIndex = cars.length - 1;
    }
  } else if (event.keyCode == 39) { // right arrow
    activeCarIndex++;
    if (activeCarIndex >= cars.length) {
      activeCarIndex = 0;
    }
  }

  // hide all the cars except for the active one
  for (let i = 0; i < cars.length; i++) {
    if (i === activeCarIndex) {
      cars[i].visible = true;
    } else {
      cars[i].visible = false;
    }
  }
}
function onMouseScroll(event) {
  const delta = event.deltaY;
  const scaleFactor = delta > 0 ? 0.5 : 1.5; // Adjust the scaling factor based on scroll direction

  const targetCameraHeight = camera.position.y * scaleFactor;

    // Define the minimum and maximum height for the camera position
    const minHeight = 1; // Set your desired minimum height
    const maxHeight = 300; // Set your desired maximum height
    const clampedCameraHeight = Math.max(minHeight, Math.min(maxHeight, targetCameraHeight));

console.log("Height:" + targetCameraHeight);
  // Create a TWEEN animation for smooth camera height transition
  new TWEEN.Tween(camera.position)
    .to({ y: clampedCameraHeight }, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      camera.lookAt(new THREE.Vector3(0, 0, 0));
    })
    .start();

  animate(); // Start the animation loop
}

function rotateCar(){
  if(!isRotating){
    rotateButton.textContent = "Click Stop Rotate";
    isRotating = true;
    rotationInterval = setInterval(() => {
      cars[activeCarIndex].rotation.z += 0.05;
    },50);
  }
  else{
    rotateButton.textContent = "Click Start Rotate";
    isRotating = false;
    clearInterval(rotationInterval);
  }
  
}
function animate() {
  requestAnimationFrame(animate);
  TWEEN.update(); // Update the tween animation
  renderer.render(scene, camera);
}


init();



function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);
