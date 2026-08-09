import * as THREE from "three";

const FLOOR_RADIUS = 9;

// Dựng sàn + viền LED + đèn màu di chuyển + dàn đèn sân khấu (truss + spotlight quét có nón sáng nhìn
// thấy được) cho 1 preset sàn 3D — tách khỏi component chính để dễ đọc. Sàn rộng (bán kính 9) để đủ chỗ
// cho đội hình nhảy nhóm đông người mà vẫn thoáng, đúng yêu cầu "sàn sân khấu rộng, có ánh sáng, đèn
// sân khấu, hiệu ứng 3d siêu đẹp".
export function buildStageEnvironment(preset) {
  const group = new THREE.Group();

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(FLOOR_RADIUS, 64),
    new THREE.MeshStandardMaterial({ color: preset.floorColor, roughness: 0.3, metalness: 0.5 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  const led = new THREE.Mesh(
    new THREE.TorusGeometry(FLOOR_RADIUS, 0.07, 8, 64),
    new THREE.MeshBasicMaterial({ color: preset.lightColors[0] })
  );
  led.rotation.x = -Math.PI / 2;
  led.position.y = 0.02;
  group.add(led);

  // Vòng LED phụ bên trong tạo chiều sâu sàn — thay vì 1 vòng viền đơn điệu.
  const led2 = new THREE.Mesh(
    new THREE.TorusGeometry(FLOOR_RADIUS * 0.6, 0.04, 8, 48),
    new THREE.MeshBasicMaterial({ color: preset.lightColors[1] || preset.lightColors[0] })
  );
  led2.rotation.x = -Math.PI / 2;
  led2.position.y = 0.02;
  group.add(led2);

  group.add(new THREE.AmbientLight("#ffffff", 0.35));
  group.add(new THREE.HemisphereLight(preset.lightColors[0], "#050505", 0.5));

  // Dàn truss trên cao gắn đèn sân khấu — khung kim loại vòng quanh, đúng phong cách nhà hát/vũ trường thật.
  const trussHeight = 7.2;
  const trussRadius = FLOOR_RADIUS * 0.85;
  const trussMaterial = new THREE.MeshStandardMaterial({ color: "#1a1a1a", metalness: 0.8, roughness: 0.4 });
  const truss = new THREE.Mesh(new THREE.TorusGeometry(trussRadius, 0.09, 6, 48), trussMaterial);
  truss.rotation.x = Math.PI / 2;
  truss.position.y = trussHeight;
  group.add(truss);

  const movingLights = preset.lightColors.map((color, i) => {
    const light = new THREE.PointLight(color, 14, 16);
    light.position.set(Math.cos(i) * 4, 4, Math.sin(i) * 4);
    group.add(light);
    return light;
  });

  // Đèn sân khấu (spotlight) treo từ truss quét xuống sàn — có nón sáng nhìn thấy được (không chỉ ánh
  // sáng chiếu lên vật thể) để đúng cảm giác đèn sân khấu cao cấp thật.
  const spotCount = 4;
  const spotlights = Array.from({ length: spotCount }).map((_, i) => {
    const color = preset.lightColors[i % preset.lightColors.length];
    const angle = (i / spotCount) * Math.PI * 2;
    const fixturePos = new THREE.Vector3(Math.cos(angle) * trussRadius, trussHeight, Math.sin(angle) * trussRadius);

    const spot = new THREE.SpotLight(color, 40, 22, Math.PI / 10, 0.4, 1.2);
    spot.position.copy(fixturePos);
    const target = new THREE.Object3D();
    group.add(target);
    spot.target = target;
    group.add(spot);

    const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.35, 12), trussMaterial);
    fixture.position.copy(fixturePos);
    group.add(fixture);

    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(1.6, 6.5, 24, 1, true),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false })
    );
    group.add(beam);

    return { spot, target, beam, fixturePos };
  });

  return { group, led, movingLights, spotlights, trussRadius };
}

// Gọi mỗi khung hình để đèn "chạy" quanh sàn + đèn sân khấu quét qua lại — hiệu ứng ánh sáng vũ trường/
// nhà hát thật, không phải ảnh tĩnh.
export function animateStageLights(env, elapsedSeconds) {
  env.movingLights.forEach((light, i) => {
    const angle = elapsedSeconds * 0.6 + (i * Math.PI * 2) / env.movingLights.length;
    light.position.x = Math.cos(angle) * 4.2;
    light.position.z = Math.sin(angle) * 4.2;
    light.position.y = 3.4 + Math.sin(elapsedSeconds * 2 + i) * 0.6;
  });
  env.led.rotation.z = elapsedSeconds * 0.15;

  env.spotlights?.forEach((s, i) => {
    const sweepX = Math.sin(elapsedSeconds * 0.5 + i * 1.3) * env.trussRadius * 0.65;
    const sweepZ = Math.cos(elapsedSeconds * 0.4 + i * 1.7) * env.trussRadius * 0.65;
    s.target.position.set(sweepX, 0, sweepZ);
    const dir = s.target.position.clone().sub(s.fixturePos).normalize();
    s.beam.position.copy(s.fixturePos).add(dir.clone().multiplyScalar(3.25));
    s.beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir);
  });
}
