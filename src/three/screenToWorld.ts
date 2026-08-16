import * as THREE from 'three'

/**
 * Unprojects a browser client (x, y) coordinate onto a plane at a
 * fixed world-space depth in front of the camera. Shared by
 * `ClickBurst3D` and `NavBurst3D`, both of which need to turn a real
 * DOM click position into a point in the WebGL scene to spawn an
 * effect at.
 */
export function screenToWorld(
  clientX: number,
  clientY: number,
  camera: THREE.Camera,
  size: { width: number; height: number },
  depth: number,
): THREE.Vector3 {
  const ndcX = (clientX / size.width) * 2 - 1
  const ndcY = -(clientY / size.height) * 2 + 1

  const point = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera)
  const direction = point.sub(camera.position).normalize()
  const distance = (depth - camera.position.z) / direction.z

  return camera.position.clone().add(direction.multiplyScalar(distance))
}
