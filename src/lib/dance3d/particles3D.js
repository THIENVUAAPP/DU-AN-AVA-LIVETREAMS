import * as THREE from "three";

// Hệ hạt 3D nhẹ cho hiệu ứng (pháo hoa/confetti/mưa...) dùng THREE.Points — 1 draw call cho toàn bộ
// hạt của 1 lần kích hoạt, đủ nhẹ để chạy song song với 50-80 nhân vật procedural.
const PARTICLE_COUNT = 90;

export class ParticleBurst3D {
  constructor(effect, origin) {
    this.life = 0;
    this.maxLife = 2.2;
    this.velocities = [];
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const behavior = effect.particle;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = origin.x;
      positions[i * 3 + 1] = origin.y;
      positions[i * 3 + 2] = origin.z;

      const angle = Math.random() * Math.PI * 2;
      const spread = Math.random() * 3 + 1;
      if (behavior === "burst") {
        this.velocities.push(new THREE.Vector3(Math.cos(angle) * spread, Math.random() * 3 + 1, Math.sin(angle) * spread));
      } else if (behavior === "fall") {
        this.velocities.push(new THREE.Vector3((Math.random() - 0.5) * 1.5, -(Math.random() * 1.5 + 0.5), (Math.random() - 0.5) * 1.5));
        positions[i * 3 + 1] = origin.y + Math.random() * 3 + 2;
      } else {
        this.velocities.push(new THREE.Vector3((Math.random() - 0.5) * 1, Math.random() * 2 + 1, (Math.random() - 0.5) * 1));
      }
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.material = new THREE.PointsMaterial({ color: effect.color, size: 0.12, transparent: true, opacity: 1 });
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false;
  }

  // Trả về false khi hết hạn để component chủ gỡ khỏi scene.
  update(deltaSeconds) {
    this.life += deltaSeconds;
    const positions = this.geometry.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const v = this.velocities[i];
      v.y -= 2.2 * deltaSeconds; // trọng lực nhẹ
      positions[i * 3] += v.x * deltaSeconds;
      positions[i * 3 + 1] += v.y * deltaSeconds;
      positions[i * 3 + 2] += v.z * deltaSeconds;
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.material.opacity = Math.max(0, 1 - this.life / this.maxLife);
    return this.life < this.maxLife;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
