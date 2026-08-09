import * as THREE from "three";

// Dựng sàn + viền LED + đèn màu di chuyển cho 1 preset sàn 3D — tách khỏi component chính để dễ đọc.
export function buildStageEnvironment(preset) {
  const group = new THREE.Group();

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(6, 48),
    new THREE.MeshStandardMaterial({ color: preset.floorColor, roughness: 0.3, metalness: 0.5 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  const led = new THREE.Mesh(
    new THREE.TorusGeometry(6, 0.06, 8, 64),
    new THREE.MeshBasicMaterial({ color: preset.lightColors[0] })
  );
  led.rotation.x = -Math.PI / 2;
  led.position.y = 0.02;
  group.add(led);

  group.add(new THREE.AmbientLight("#ffffff", 0.4));
  group.add(new THREE.HemisphereLight(preset.lightColors[0], "#050505", 0.5));

  const movingLights = preset.lightColors.map((color, i) => {
    const light = new THREE.PointLight(color, 14, 16);
    light.position.set(Math.cos(i) * 4, 4, Math.sin(i) * 4);
    group.add(light);
    return light;
  });

  return { group, led, movingLights };
}

// Gọi mỗi khung hình để đèn "chạy" quanh sàn — hiệu ứng đèn LED vũ trường thật, không phải ảnh tĩnh.
export function animateStageLights(env, elapsedSeconds) {
  env.movingLights.forEach((light, i) => {
    const angle = elapsedSeconds * 0.6 + (i * Math.PI * 2) / env.movingLights.length;
    light.position.x = Math.cos(angle) * 4.2;
    light.position.z = Math.sin(angle) * 4.2;
    light.position.y = 3.4 + Math.sin(elapsedSeconds * 2 + i) * 0.6;
  });
  env.led.rotation.z = elapsedSeconds * 0.15;
}
