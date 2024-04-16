import { AnimationMixer, MeshNormalMaterial } from 'three'
import BasicItem from '~/webgl/Modules/Basics/BasicItem'

export default class BaseCampItem extends BasicItem {
  /**
   * Constructor
   */
  constructor(_options = {}) {
    super()

    this.options = _options

    // New elements
    this.name = null
    this.model = null
    this.position = null
    this.rotation = null
    this.scale = null
    this.visibility = null
    this.isCamera = false
    this.mixer = null
    this.animationAction = null
    this.holdDuration = 2000

    // Store
    this.currentScroll = computed(
      () => Math.round(useScrollStore().getCurrent * 10000) / 10000
    )

    // Watch
    watch(this.currentScroll, (v) => {
      this.updateVisibility()
      this.playAnimation(v)
    })
  }

  /**
   * Set Name
   */
  setName() {
    this.name = this.options.name
  }

  /**
   * Set Visibility
   * @param {Array} _visibility
   */
  setVisibility(_visibility) {
    this.visibility = _visibility
  }

  /**
   * Set isCamera
   * @param {Boolean} _isCamera
   */
  setIsCamera(_isCamera) {
    if (!_isCamera) return
    this.isCamera = _isCamera
  }

  /**
   * Set Mixer
   */
  setMixer() {
    // Set mixer
    this.mixer = new AnimationMixer(this.model.scene)

    // Set action
    this.animationAction = this.mixer.clipAction(this.model.animations[0])
  }

  /**
   * Set Model
   * @param {Object} _model
   * @param {Object} _model.geometry
   * @param {Object} _model.material
   */
  setModel(_model) {
    if (!_model) return

    if (this.isCamera) {
      this.model = _model
      return
    }
    this.model = _model.scene.clone()
  }

  /**
   * Set Position
   * @param {Object} _position
   * @param {Number} _position.x
   * @param {Number} _position.y
   * @param {Number} _position.z
   */
  setPosition(_position) {
    this.position = _position
  }

  /**
   * Set Rotation
   * @param {Object} _rotation
   * @param {Number} _rotation.x
   * @param {Number} _rotation.y
   * @param {Number} _rotation.z
   */
  setRotation(_rotation) {
    this.rotation = _rotation
  }

  /**
   * Set Scale
   * @param {Object} _scale
   * @param {Number} _scale.x
   * @param {Number} _scale.y
   * @param {Number} _scale.z
   */
  setScale(_scale) {
    this.scale = _scale
  }

  /**
   * Set item
   */
  setItem() {
    this.setName()
    this.setVisibility(this.options.visibility)
    this.setIsCamera(this.options.isCamera)
    this.setModel(this.options.model)
    this.setPosition(this.options.position)
    this.setRotation(this.options.rotation)
    this.setScale(this.options.scale)
    this.isCamera && this.setMixer()

    // Set item
    !this.isCamera && (this.item = this.model)
    this.isCamera && (this.item = this.model.scene)

    // Set item material
    this.item.children[0].material = new MeshNormalMaterial()

    // Set item name
    this.item.name = this.name

    // Set item position
    this.position &&
      this.item.position.set(this.position.x, this.position.y, this.position.z)

    // Set item rotation
    this.rotation &&
      this.item.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z)

    // Set item scale
    this.scale && this.item.scale.copy(this.scale)

    // Set item visibility
    if (this.visibility[0] > this.currentScroll.value) {
      this.item.children[0].visible = false
    }
  }

  /**
   * Update item visibility
   */
  updateVisibility() {
    if (!this.visibility?.length) return

    // if current scroll is between visibility values
    if (
      this.visibility[0] <= this.currentScroll.value &&
      this.currentScroll.value <= this.visibility[1]
    ) {
      this.item.children[0].visible = true
    } else {
      this.item.children[0].visible = false
    }
  }

  /**
   * Play animation on scroll
   * @param {Number} value scroll value
   */
  playAnimation(value) {
    if (!this.mixer || !this.item || !this.parentScene.camera.instance) return

    const animDuration = this.animationAction.getClip().duration

    this.mixer.setTime((value * animDuration) / (100 / 3))
    this.animationAction.play()
    this.mixer.update(1 / 60)

    this.parentScene.camera.instance.position.copy(
      this.item.children[0].position
    )

    const rotation = this.item.children[0].rotation.clone()
    this.parentScene.camera.instance.rotation.set(
      rotation.x - Math.PI / 2,
      -rotation.z,
      rotation.y
    )
    this.parentScene.camera.instance.rotation.x += this.parentScene.camRot.x
  }

  /**
   * Init
   */
  init() {
    // Set item
    this.setItem()
    this.playAnimation(0)
  }
}
