//Variables for setup
let container;
let camera;
let renderer;
let scene;
let car;

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
  light.position.set(50, 4, 100);
  scene.add(light);

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  //Load Model
  let loader = new THREE.GLTFLoader();
  loader.load("./car/scene.gltf", function (gltf) {
    scene.add(gltf.scene);
    car = gltf.scene.children[0];
    car.scale.set(50, 50, 50); // <-- add this line to make the car bigger
    animate();
  });

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
  mouse.y = event.clientY;
}

function onMouseMove(event) {
  if (!isDragging) return;

  const deltaX = event.clientX - mouse.x;
  const deltaY = event.clientY - mouse.y;
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  const rotZ = car.rotation.z+ deltaX * sensitivity;
  car.rotation.z = rotZ;

  renderer.render(scene, camera);
}

function onMouseUp(event) {
  isDragging = false;
}

function onMouseLeave(event) {
  isDragging = false;
}

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener("resize", onWindowResize);
