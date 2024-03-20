import { ConeGeometry, Mesh, MeshNormalMaterial } from 'three'
import { MathUtils } from 'three'
import scenes from '~/const/scenes.const'
import Experience from '~/webgl/Experience'
import BaseItem from '~/webgl/Modules/Bases/BaseItem'

export default class Mountain extends BaseItem {
  /**
   * Constructor
   */
  constructor() {
    super()
    // Get elements from experience
    this.experience = new Experience()
    this.$bus = this.experience.$bus

    // New elements
    this.geometry = null
    this.material = null
    this.holdDuration = 2000

    // Store
    this.currentScroll = computed(() => useScrollStore().getCurrent)

    // Init
    this.init()
  }

  /**
   * Get geometry
   */
  setGeometry() {
    this.geometry = new ConeGeometry(4, 8, 16)
  }

  /**
   * Get material
   */
  setMaterial() {
    this.material = new MeshNormalMaterial()
  }

  /**
   * Get mesh
   */
  setMesh() {
    this.item = new Mesh(this.geometry, this.material)
  }

  /**
   * On hold item
   */
  onHold() {
    const scene = scenes.list.find((scene) => scene.name === 'basecamp')
    this.$bus.emit('scene:switch', scene)
  }
  /**
   * Init the floor
   */
  init() {
    this.setGeometry()
    this.setMaterial()
    this.setMesh()

    this.$bus.on('scroll', (delta) => {
      this.item.rotation.y += MathUtils.degToRad(delta / 25)
    })
  }

  /**
   * Update the floor
   */
  update() {
    this.item.rotation.y += 0.005
  }
}
