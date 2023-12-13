var renderer,
  scene,
  camera,
  BigSphere,
  blob,
  stars,
  controls,
  timeout_Debounce,
  noise = new SimplexNoise(),
  cameraSpeed = 0,
  blobScale = 3;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  camera.position.set(0, 0, 250);

  var directionalLight = new THREE.DirectionalLight("#fff", 2);
  directionalLight.position.set(0, 50, -30);
  scene.add(directionalLight);

  var ambientLight = new THREE.AmbientLight("#ffffff", 1);
  ambientLight.position.set(0, 20, 20);
  scene.add(ambientLight);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  var container = document.getElementById("canvas_container");

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  //OrbitControl
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.maxDistance = 400;
  controls.minDistance = 100;

  var loader = new THREE.TextureLoader();
  var textureBigSphere = loader.load("../dist/space.jpg");
  var textureblob = loader.load("../dist/galaxy.jpg");
  var textureStar = loader.load("../dist/starShape.jpg");
  var texture1 = loader.load("../dist/twinkleStar.png");
  var texture2 = loader.load("../dist/twinkleStar2.png");

  //blob
  var icosahedronGeometry = new THREE.IcosahedronGeometry(35, 10);
  var blobtMaterial = new THREE.MeshPhongMaterial({ map: textureblob });
  blob = new THREE.Mesh(icosahedronGeometry, blobtMaterial);
  scene.add(blob);

  //sphere  background
  var geometryBigSphere = new THREE.SphereBufferGeometry(150, 40, 40);
  var materialBigSphere = new THREE.MeshBasicMaterial({
    //This killed me to figure out
    side: THREE.BackSide,
    map: textureBigSphere,
  });
  BigSphere = new THREE.Mesh(geometryBigSphere, materialBigSphere);
  scene.add(BigSphere);

  //moving stars
  var starsGeometry = new THREE.Geometry();

  for (var i = 0; i < 40; i++) {
    var particleStar = randomPointSphere(200);

    particleStar.velocity = THREE.MathUtils.randInt(50, 300);

    particleStar.startX = particleStar.x;
    particleStar.startY = particleStar.y;
    particleStar.startZ = particleStar.z;

    starsGeometry.vertices.push(particleStar);
  }
  var starsMaterial = new THREE.PointsMaterial({
    size: 4,
    color: "#ffffff",
    transparent: true,
    opacity: 0.75, //more than semi-transparent
    map: textureStar,
    blending: THREE.AdditiveBlending, //found this to make the drinking bird tail more transparent
  });

  stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  //fixed stars
  function createStars(texture, size, total) {
    var pointGeometry = new THREE.Geometry();
    var pointMaterial = new THREE.PointsMaterial({
      size: size,
      map: texture,
      blending: THREE.AdditiveBlending,
    });

    for (var i = 0; i < total; i++) {
      var radius = THREE.MathUtils.randInt(75, 150);
      var particles = randomPointSphere(radius);
      pointGeometry.vertices.push(particles);
    }
    return new THREE.Points(pointGeometry, pointMaterial);
  }
  scene.add(createStars(texture1, 15, 25));
  scene.add(createStars(texture2, 5, 35));
  scene.add(createStars(texture2, 2, 50));

  function randomPointSphere(radius) {
    var theta = 2 * Math.PI * Math.random();
    var phi = Math.acos(2 * Math.random() - 1);
    var dx = 0 + radius * Math.sin(phi) * Math.cos(theta);
    var dy = 0 + radius * Math.sin(phi) * Math.sin(theta);
    var dz = 0 + radius * Math.cos(phi);
    return new THREE.Vector3(dx, dy, dz);
  }
}

function animate() {
  //moving stars
  stars.geometry.vertices.forEach(function (v) {
    //move all the stars to the center
    v.x += (0 - v.x) / v.velocity;
    v.y += (0 - v.y) / v.velocity;
    v.z += (0 - v.z) / v.velocity;

    v.velocity -= 0.2;
    //set back to origin
    if (v.x <= 5 && v.x >= -5 && v.z <= 5 && v.z >= -5) {
      v.x = v.startX;
      v.y = v.startY;
      v.z = v.startZ;
      v.velocity = THREE.MathUtils.randInt(50, 300);
    }
  });

  //blob animation
  blob.geometry.vertices.forEach(function (v) {
    var time = Date.now();
    v.normalize();
    var distance =
      blob.geometry.parameters.radius +
      noise.noise3D(
        //channge to big numbers to make blob dance like crazy
        v.x + time * 0.0006,
        v.y + time * 0.0004,
        v.z + time * 0.0009
      ) *
        blobScale;
    v.multiplyScalar(distance);
  });
  blob.geometry.verticesNeedUpdate = true;
  blob.geometry.normalsNeedUpdate = true;
  blob.geometry.computeVertexNormals();
  blob.geometry.computeFaceNormals();
  blob.rotation.y += 0.002;

  //Sphere background rotation
  BigSphere.rotation.x += 0.001;
  BigSphere.rotation.y += 0.001;
  BigSphere.rotation.z += 0.001;

  controls.update();
  stars.geometry.verticesNeedUpdate = true;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

init();
animate();

//Resize window
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  var canvasWidth = window.innerWidth;
  var canvasHeight = window.innerHeight;

  renderer.setSize(canvasWidth, canvasHeight);

  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();
}
