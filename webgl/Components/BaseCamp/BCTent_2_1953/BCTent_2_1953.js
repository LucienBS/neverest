import { DoubleSide, InstancedMesh, MeshNormalMaterial } from 'three'
import BasicItem from '~/webgl/Modules/Basics/BasicItem'
import { BCTENT_2_1953 } from '~/const/blocking/baseCamp.const'

export default class BCTent_2_1953 extends BasicItem {
  /**
   * Constructor
   */
  constructor({
    position = new Vector3(0, 0, 0),
    rotation = new Vector3(0, 0, 0),
    name = 'BCTent_2_1953',
    visibility = [0, 100],
    isInstances = true,
  }) {
    super()

    // Elements
    this.position = position
    this.rotation = rotation
    this.name = name
    this.visibility = visibility
    this.isInstances = isInstances

    // New elements
    this.resources = this.experience.resources.items
  }
  
    /**
     * Set Instances
     */
    setInstances() {
      let dummy = this.resources.BCTent_2_1953.scene.children[0]
      this.item = new InstancedMesh(dummy.geometry, new MeshNormalMaterial(), BCTENT_2_1953.length)
  
      BCTENT_2_1953.forEach((el, i) => {
        let mesh = dummy.clone()
        mesh.position.set(el.position.x, el.position.y, el.position.z)
        mesh.rotation.set(el.rotation.x, el.rotation.y, el.rotation.z)
        mesh.updateMatrix()
        this.item.setMatrixAt(i, mesh.matrix)
      })
  
      this.item.instanceMatrix.needsUpdate = true
    }

  /**
   * Set item
   */
  setItem() {
    this.item = this.resources.BCTent_2_1953.scene.clone()
    this.item.position.copy(this.position)
    this.item.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z)
    this.item.name = this.name
  }

  /**
   * Set material
   */
  setMaterial() {
    this.item.children[0].material = new MeshNormalMaterial()
    this.item.children[0].material.side = DoubleSide
  }

  /**
   * Init the floor
   */
  init() {
    this.isInstances && this.setInstances()
    !this.isInstances && this.setItem()
    !this.isInstances && this.setMaterial()
  }
}
