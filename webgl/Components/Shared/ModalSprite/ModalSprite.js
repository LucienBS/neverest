import gsap from 'gsap'
import { CustomEase } from 'gsap/all'
import { Sprite, SpriteMaterial, Vector3 } from 'three'
import { clamp } from 'three/src/math/MathUtils'
import BasicItem from '~/webgl/Modules/Basics/BasicItem'
gsap.registerPlugin(CustomEase)

export default class ModalSprite extends BasicItem {
  /**
   * Constructor
   */
  constructor({ visibility, position, data }) {
    super()
    // Elements
    this.scrollManager = this.experience.scrollManager
    this.keysManager = this.experience.keysManager
    this.resources = this.experience.resources.items
    this.renderUniforms = this.experience.renderer.renderMesh.material.uniforms
    this.$bus = this.experience.$bus
    this.visibility = visibility
    this.position = position
    this.data = data

    // New elements
    this.camera = null
    this.item = null
    this.material = null
    this.active = false
    this.scale = 1.3
    this.scaleFocus = 0

    // Events
    this.scrollManager.on('scroll', ({ current }) =>
      this.setComponentVis(this.visibility, current)
    )
  }

  /**
   * Get material
   */
  setMaterial() {
    this.material = new SpriteMaterial({
      map: this.resources.circle.clone(),
    })
  }

  /**
   * Get mesh
   */
  setSprite() {
    this.item = new Sprite(this.material)
    this.item.position.copy(this.position)
  }

  /**
   * Set the visibility of the components if visibility range set
   * @param {object} c Webgl component
   * @param {number} force Force the visibility check to this value
   */
  setComponentVis(visibility, force) {
    if (!visibility?.length) return

    const scroll = force ?? this.scrollManager.current
    const start = visibility[0]
    const end = visibility[1]

    // If current scroll is between visibility values
    if (start <= scroll && scroll <= end) {
      if (!this.item.visible) {
        this.item.visible = true
      }
    } else {
      if (this.item.visible) {
        this.item.visible = false
      }
    }
  }

  onMouseEnter() {
    if (!this.item.visible) return
    // const scale = { value: 0 }
    // gsap.to(scale, {
    //   value: 0.3,
    //   duration: 0.5,
    //   ease: 'power1.out',
    //   onUpdate: () => {
    //     this.scaleFocus = scale.value
    //   },
    // })

    this.experience.canvas.style.cursor = 'pointer'
  }

  onMouseLeave() {
    if (!this.item.visible) return
    // const scale = { value: this.scaleFocus }
    // gsap.to(scale, {
    //   value: 0,
    //   duration: 0.5,
    //   ease: 'power1.out',
    //   onUpdate: () => {
    //     this.scaleFocus = scale.value
    //   },
    // })

    this.experience.canvas.style.cursor = 'auto'
  }

  /**
   * Open modal
   * @param {boolean} open - Open or close the modal
   */
  openModal(open) {
    this.$bus.emit('audio:click')
    this.scrollManager.setDisable(open)
    gsap.to(this.renderUniforms.uModalProgress, {
      value: open ? 1 : 0,
      duration: 1,
      ease: open ? 'power2.in' : 'circ.out',
      onStart: () => this.$bus.emit('modal:init'),
      onUpdate: () => {
        if (this.renderUniforms.uModalProgress.value > 0.25) {
          if (open) {
            this.$bus.emit('modal:open', this.data)
          } else {
            this.$bus.emit('modal:destroy')
          }
        }
      },
    })

    if (open) {
      const base = { value: this.camera.fov }
      const fov = { value: this.camera.fov }

      gsap.to(fov, {
        value: base.value * 0.75,
        duration: 0.5,
        ease: CustomEase.create(
          'custom',
          'M0,0 C0.097,0.602 0.139,1 0.5,1 0.847,1 0.9,0.6 1,0 '
        ),
        onUpdate: () => {
          this.camera.fov = fov.value
          this.camera.updateProjectionMatrix()
        },
        onComplete: () => {
          this.camera.fov = base.value
          this.camera.updateProjectionMatrix()
        },
      })
    }
  }

  // /**
  //  * Wiggle the sprite
  //  */
  // wiggle() {
  //   const scale = { value: this.scale }
  //   this.wiggleAnimation = gsap.to(scale, {
  //     value: 1.1,
  //     duration: 1.25,
  //     repeat: -1,
  //     yoyo: true,
  //     ease: 'power1.inOut',
  //     onUpdate: () => {
  //       this.scale = scale.value
  //     },
  //   })
  // }

  /**
   * On click item
   */
  onClick() {
    if (!this.item.visible) return
    this.openModal(true)
  }

  /**
   * Update
   */
  update() {
    if (!this.item.visible) {
      this.item.scale.set(0, 0, 0)
    }

    if (!this.item.visible) return

    // update the sprite scale
    const target = new Vector3()
    const camTarget = new Vector3()

    const camPos = this.camera.getWorldPosition(camTarget)
    const pos = this.item.getWorldPosition(target)

    const distance = camPos.distanceTo(pos)

    const scale = clamp(distance / 40, 0.35, 1) * (this.scale + this.scaleFocus)
    this.item.scale.set(scale, scale, scale)
  }

  /**
   * Init
   */
  init() {
    this.keysManager.on('keydown', (e) => {
      if (e.keyCode === 27 && this.renderUniforms.uModalProgress.value > 0) {
        this.openModal(false)
      }
    })

    this.$bus.on('modal:close', () => this.openModal(false))

    this.camera = this.parentScene.camera.instance
    this.setMaterial()
    this.setSprite()
    // this.wiggle()
  }

  /**
   * Dispose
   */
  dispose() {
    this.keysManager.destroy()
    this.$bus.off('modal:close')
  }
}
