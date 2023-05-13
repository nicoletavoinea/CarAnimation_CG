//Variables for setup
let container;
let camera;
let renderer;
let scene;

//Load Models
let cars = []; // array to store all the cars
let activeCarIndex = 0; // variable to keep track of the active car

let prev = { x: 0, y: 0 };
let mouse = { x: 0, y: 0 };
let isDragging = false;
const sensitivity = 0.005;

function init() {
  container = document.querySelector(".scene");

  //Create scene
  scene = new THREE.Scene();

  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 1000;

  //Camera setup
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 3, 30);

  const ambient = new THREE.AmbientLight(0xffd400, 2);
  scene.add(ambient);

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 10, 30);
  scene.add(light);

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  //first car
  let loader1 = new THREE.GLTFLoader();
  loader1.load("./car1/scene.gltf", function (gltf) {
    scene.add(gltf.scene);
    car = gltf.scene.children[0];
    car.scale.set(55, 55, 55); // <-- add this line to make the car bigger
    car.rotation.z=0.5;
    car.visible=true;
    cars.push(car);
    animate();

    console.log('Car 1 loaded.');
    console.log(car);
  });

  //second car
  let loader2 = new THREE.GLTFLoader();
  loader2.load("./car2/scene.gltf", function (gltf) {
    scene.add(gltf.scene);
    car = gltf.scene.children[0];
    car.scale.set(3.5, 3.5, 3.5); // <-- add this line to make the car bigger
    car.rotation.z=0.5;
    car.visible=false;
    cars.push(car);
    animate();
    console.log('Car 2 loaded.');
    console.log(car);
  });

  console.log(scene.children);

  //Key events
  document.addEventListener("keydown", onKeyDown);

  // Mouse events
  container.addEventListener("mousedown", onMouseDown);
  container.addEventListener("mousemove", onMouseMove);
  container.addEventListener("mouseup", onMouseUp);
  container.addEventListener("mouseleave", onMouseLeave);
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

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);
