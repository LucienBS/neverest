import { MathUtils } from 'three'
import { isDeviceMobile } from '~/utils/functions/device'
import Experience from '../Experience.js'

export default class ScrollManager {
  constructor() {
    // Get elements from experience
    this.experience = new Experience()
    this.debug = this.experience.debug
    this.$bus = this.experience.$bus

    // DragManager
    this.dragManager = new DragManager()

    // New elements
    this.debugFolder = null
    this.speed = 0.1
    this.factor = 0.005
    this.delta = 0

    // Actions
    this.setScroll = useScrollStore().setCurrent
    this.setTarget = useScrollStore().setTarget

    // Getters
    this.currentScroll = computed(() => useScrollStore().getCurrent)
    this.targetScroll = computed(() => useScrollStore().getTarget)

    // Init
    this.init()
  }

  /**
   * Set debug
   */
  setDebug() {
    this.debugFolder = this.debug.addFolder({
      title: 'Scroll',
      closed: false,
    })

    this.debugFolder.addBinding(this, 'factor', {
      label: 'Scroll Factor',
      min: 0,
      max: 0.01,
      step: 0.001,
    })

    this.debugFolder.addBinding(this, 'speed', {
      label: 'Speed',
      min: 0,
      max: 0.25,
      step: 0.001,
    })
  }

  /**
   * Init the scroll manager
   */
  init() {
    let prev = -1
    const firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
    const isMobile = isDeviceMobile()

    const setScroll = (e) => {
      this.setTarget(this.targetScroll.value + this.delta * this.factor)
      this.$bus.emit('scroll', this.delta)
    }

    if (isMobile) {
      this.dragManager.on('drag', (e) => {
        this.delta = e.delta.y * 10
        setScroll()
      })
    } else if (firefox) {
      window.addEventListener('DOMMouseScroll', (e) => {
        this.delta =
          Math.sign(e.detail * 15) == Math.sign(prev) ? e.detail * 15 : 0
        prev = e.detail
        setScroll()
      })
    } else {
      window.addEventListener('wheel', (e) => {
        this.delta = e.deltaY
        setScroll()
      })
    }

    // Debug
    if (this.debug) this.setDebug()
  }

  /**
   * Update values
   */
  update() {
    this.setScroll(
      MathUtils.lerp(
        this.currentScroll.value,
        this.targetScroll.value,
        this.speed
      )
    )
  }
}
