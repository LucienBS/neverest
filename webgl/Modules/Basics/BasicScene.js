import { Group, Scene } from 'three'
import BasicCamera from './BasicCamera'
import Experience from '~/webgl/Experience'
import gsap from 'gsap'

export default class BasicScene {
  /**
   * Constructor
   */
  constructor() {
    // Get elements from experience
    this.experience = new Experience()
    this.raycaster = this.experience.raycaster
    this.audioManager = this.experience.audioManager
    this.$bus = this.experience.$bus

    // New elements
    this.scene = new Scene()
    this.camera = new BasicCamera()
    this.allComponents = {}
    this.hovered = null
    this.holded = null
    this.holdProgress = null
    this.handleMouseDownEvt = null
    this.handleMouseUpEvt = null
    this.handleMouseMoveEvt = null
    this.handleScrollEvt = null

    // Actions
    this.setProgressHold = useHoldStore().setProgress
    this.setTargetScroll = useScrollStore().setTarget

    // Getters
    this.progressHold = computed(() => useHoldStore().getProgress)

    // --------------------------------
    // Elements
    // --------------------------------

    /**
     * Components included in the item (optional)
     *  Will replace @item by a group (including @item) and add components to it
     *  Components can have children components and items
     * @param {Object} [component] - BasicItems
     */
    this.components = {}

    /**
     * Object of audios to add to the scene
     * @param {boolean} play - If audio is playing
     * @param {boolean} loop - If audio is looping
     * @param {boolean} persist - If true, the audio will not be removed on scene change
     * @param {number} volume - Volume of the audio
     */
    this.audios = {}

    // --------------------------------
    // Functions
    // --------------------------------

    /**
     * On scroll function
     * @param {number} delta - Delta of the scroll
     */
    this.onScroll

    /**
     * On switch start and if this scene is the previous one
     */
    this.onSwitchStart

    /**
     * On switch between scene complete and this scene is the new one
     */
    this.onSwitchComplete
  }

  /**
   * Set events
   */
  setEvents() {
    this.handleMouseDownEvt = this.onMouseDownEvt.bind(this)
    this.handleMouseUpEvt = this.onMouseUpEvt.bind(this)
    this.handleMouseMoveEvt = this.onMouseMoveEvt.bind(this)
    this.handleScrollEvt = this.onScrollEvt.bind(this)

    this.$bus.on('mousedown', this.handleMouseDownEvt)
    this.$bus.on('mouseup', this.handleMouseUpEvt)
    this.$bus.on('mousemove', this.handleMouseMoveEvt)
    this.$bus.on('scroll', this.handleScrollEvt)
  }

  /**
   * Raycast on mouse down
   */
  onMouseDownEvt({ centered }) {
    // Clicked item
    const clicked = this.getRaycastedItem(centered, ['onClick'])
    this.triggerFn(clicked, 'onClick')

    // Holded item
    this.holded = this.getRaycastedItem(centered, ['onHold'])
    this.holded && this.handleHold()
  }

  /**
   * Raycast on mouse up
   */
  onMouseUpEvt() {
    this.resetHolded()
  }

  /**
   * Raycast on mouse move
   */
  onMouseMoveEvt({ centered }) {
    // Trigger mouse move on all components
    Object.values(this.allComponents).forEach((c) =>
      this.triggerFn(c, 'onMouseMove', centered)
    )

    // Get hovered item
    const hovered = this.getRaycastedItem(centered, [
      'onMouseEnter',
      'onMouseLeave',
    ])

    // If mouse leave the hovered item, refresh the hovered item
    if (this.hovered?.id !== hovered?.id) {
      this.triggerFn(this.hovered, 'onMouseLeave')
      this.hovered = hovered
      this.triggerFn(this.hovered, 'onMouseEnter')
    }
    // Get holded item hovered
    const holded = this.getRaycastedItem(centered, ['onHold'])
    // If user leave the hold item, reset the holded item
    if (this.holded?.item?.id !== holded?.item?.id) {
      this.resetHolded()
    }
  }

  /**
   * On scroll event
   */
  onScrollEvt(delta) {
    this.triggerFn(this, 'onScroll', delta)
    Object.values(this.allComponents).forEach((c) =>
      this.triggerFn(c, 'onScroll', delta)
    )
  }

  /**
   * Trigger item function (if not false)
   * @param {*} item Item to trigger
   * @param {*} fn Function to trigger
   * @param {*} arg Argument to pass to the function
   */
  triggerFn(item, fn, arg) {
    item?.[fn] && item[fn](arg)
  }

  /**
   * Handle hold event
   */
  handleHold() {
    if (this.progressHold.value > 0) return

    // Manage progression with store
    const progress = { value: this.progressHold.value }
    this.holdProgress = gsap.to(progress, {
      value: 100,
      duration: this.holded.holdDuration / 1000,
      ease: 'easeInOut',
      onUpdate: () => this.setProgressHold(progress.value),
      onComplete: () => {
        this.triggerFn(this.holded, 'onHold')
        this.resetHolded(true)
      },
    })
  }

  /**
   * Reset holded item
   * @param {boolean} success If the hold event was a success
   */
  resetHolded() {
    this.holdProgress?.kill()
    this.holded = null

    const progress = { value: this.progressHold.value }
    this.holdProgress = gsap.to(progress, {
      value: 0,
      duration: 1 * (progress.value / 100),
      ease: 'easeInOut',
      onUpdate: () => this.setProgressHold(progress.value),
      onComplete: () => {
        setTimeout(() => {
          this.setProgressHold(0)
          this.holdProgress?.kill()
          this.holded = null
        })
      },
    })
  }

  /**
   * Get raycasted item
   * @param {*} centered Coordinates of the cursor
   * @param {*} fn Check available functions in the item
   * @returns Item triggered
   */
  getRaycastedItem(centered, fn = []) {
    if (!this.raycaster) return

    this.raycaster.setFromCamera(centered, this.camera.instance)

    // Filter the components to only get the ones that have the functions in the fn array
    const list = Object.values(this.allComponents).filter((c) => {
      const funcs = fn.filter((f) => {
        return (c[f] || c[f] == false) && !c.disabledFn?.includes(f)
      })
      return funcs.length > 0
    })

    // Get the target object
    const target = this.raycaster.intersectObjects(
      list.map((c) => c.item),
      true
    )?.[0]

    // Return the triggered item
    // - If fn not set, use the first parent function available
    // - If fn is set or false, return the item (the function will not be triggered if false)
    const match = list.filter((l) => {
      const ids = []
      l.item?.traverse((i) => {
        ids.push(i.id)
      })

      const isSet = fn.find((f) => l?.[f] != null || l?.[f] !== undefined)
      return ids.includes(target?.object?.id) && isSet
    })

    return match[match.length - 1]
  }

  /**
   * Add items to the scene
   */
  addItemsToScene() {
    const getItems = (c) => {
      const childs = Object.values(c.components || {})

      if (childs.length > 0) {
        let res = new Group()
        c.item && res.add(c.item)
        childs.forEach((c) => res.add(getItems(c)))

        this.addAudios(c.audios, res)
        c.item = res
        return c.item
      } else if (c.item) {
        this.addAudios(c.audios, c.item)
        return c.item
      }
    }

    this.scene.add(getItems({ components: this.components }))
  }

  /**
   * Add a audio to the scene
   * @param {*} audios Object of audios
   * @param {*} parent Parent of the audio (if set)
   */
  addAudios(audios = {}, parent = null) {
    Object.keys(audios)?.forEach((name) => {
      audios[name] = this.audioManager.add({
        name,
        ...audios[name],
        ...(parent && audios[name].parent !== false && { parent }),
        listener: this.camera.listener,
      })
    })
  }

  /**
   * Remove audios from the scene
   * @param {*} audios Object of audios
   */
  removeAudios(audios = {}, force = false) {
    // Filter by persist and no parents
    const toRemove = Object.keys(audios).filter(
      (name) => !audios[name].persist || force
    )

    toRemove?.forEach((name) => this.audioManager.remove(name))
  }

  /**
   * Get recursive components
   * @returns Object of components flatten
   */
  getRecursiveComponents(components = this.components) {
    const res = {}

    const flatComponents = (c) => {
      Object.keys(c).forEach((key) => {
        const value = c[key]
        value.parentScene = this

        res[key] = value
        value.init?.()

        value?.components && flatComponents(value.components)
      })
    }
    flatComponents(components)

    return res
  }

  /**
   * Init the scene
   * Automatically called after the constructor
   */
  init() {
    this.allComponents = this.getRecursiveComponents()
    this.addItemsToScene()
    Object.values(this.allComponents).forEach((c) => c.afterViewInit?.())

    this.audios && this.addAudios(this.audios)
    this.scene.add(this.camera.instance)

    this.setEvents()
  }

  /**
   * Update the scene
   */
  update() {
    Object.values(this.allComponents).forEach((c) =>
      this.triggerFn(c, 'update')
    )

    this.camera.update()
  }

  /**
   * Resize the scene
   */
  resize() {
    this.camera.resize()
  }

  /**
   * Dispose the scene
   */
  dispose() {
    // Items
    Object.values(this.allComponents).forEach((c) => {
      this.triggerFn(c, 'dispose')
      this.scene.remove(c.item)
      this.removeAudios(c.audios, true)
    })

    // Audios
    this.audios && this.removeAudios(this.audios)

    // Camera
    this.scene.remove(this.camera.instance)
    this.camera.dispose()

    // Debug
    this.debugFolder && this.debug?.remove(this.debugFolder)

    // Events
    this.$bus.off('mousedown', this.handleMouseDownEvt)
    this.$bus.off('mouseup', this.handleMouseUpEvt)
    this.$bus.off('mousemove', this.handleMouseMoveEvt)
    this.$bus.off('scroll', this.handleScrollEvt)
  }
}
