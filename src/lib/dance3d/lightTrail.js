import * as THREE from "three";

// Trail ánh sáng chạy theo tay/chân khi nhân vật chuyển động — vẽ bằng THREE.Line với gradient mờ dần
// dọc theo các điểm gần đây, không cần thư viện VFX ngoài. Chỉ nên gắn cho số ít nhân vật nổi bật
// (gift/VIP) vì mỗi trail tốn 1 draw call riêng — gắn cho cả 50-80 nhân vật sẽ ảnh hưởng hiệu năng.
const MAX_POINTS = 18;

export class LightTrail {
  constructor(color = "#ef4444") {
    this.positions = new Float32Array(MAX_POINTS * 3);
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    this.material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 });
    this.line = new THREE.Line(this.geometry, this.material);
    this.line.frustumCulled = false;
    this.points = [];
  }

  update(worldPosition) {
    this.points.push(worldPosition.clone());
    if (this.points.length > MAX_POINTS) this.points.shift();
    for (let i = 0; i < MAX_POINTS; i++) {
      const p = this.points[i] || this.points[0];
      if (!p) continue;
      this.positions[i * 3] = p.x;
      this.positions[i * 3 + 1] = p.y;
      this.positions[i * 3 + 2] = p.z;
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.material.opacity = Math.min(0.7, this.points.length / MAX_POINTS);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
