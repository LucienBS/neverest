import Renderer from './Modules/Renderer/Renderer'
import { Pane } from 'tweakpane'
import Time from './Utils/Time'
import Sizes from './Utils/Sizes'
import Resources from './Utils/Resources'
import Stats from './Utils/Stats'
import SceneManager from './Utils/SceneManager'

export default class Experience {
  static _instance

  /**
   * Constructor
   */
  constructor(_options = {}) {
    if (Experience._instance) {
      return Experience._instance
    }
    Experience._instance = this

    // Nuxt elements
    this.$router = useRouter()

    // Set container
    this.canvas = _options.canvas
    this.baseScene = _options.baseScene

    // New elements
    this.config = {}
    this.sizes = null
    this.debug = null
    this.stats = null
    this.sceneManager = null
    this.renderer = null
    this.time = null
    this.resources = null

    // Init
    this.init()
  }

  /**
   * Start the experience
   */
  start() {
    if (
      !this.sceneManager?.active &&
      this.resources.toLoad === this.resources.loaded
    ) {
      this.sceneManager.init(this.config.debug && this.baseScene)
      this.update()
    }
  }

  /**
   * Set config
   */
  setConfig() {
    // Set if Debug is on
    this.config.debug = this.$router.currentRoute.value.href.includes('debug')

    // Pixel ratio
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

    // Width and height
    const boundings = this.canvas.getBoundingClientRect()
    this.config.width = boundings.width
    this.config.height = boundings.height || window.innerHeight
  }

  /**
   * Get debug
   */
  getDebug() {
    if (!this.config.debug) return

    return new Pane({
      title: 'Debug',
      expanded: true,
    })
  }

  /**
   * Init the experience
   */
  init() {
    this.setConfig()

    this.debug = this.getDebug()
    this.time = new Time()
    this.sceneManager = new SceneManager()
    this.stats = new Stats(this.config.debug)
    this.renderer = new Renderer()
    this.sizes = new Sizes()
    this.resources = new Resources()

    this.sizes.on('resize', () => {
      this.resize()
    })
  }

  /**
   * Resize the experience
   */
  resize() {
    this.setConfig()

    this.renderer.resize()
    this.sceneManager.resize()
  }

  /**
   * Update the experience
   */
  update() {
    this.renderer.update()
    this.sceneManager.update()
    this.stats?.update()

    window.requestAnimationFrame(() => {
      this.update()
    })
  }

  /**
   * Dispose the experience
   */
  dispose() {
    this.sizes.off('resize')
    this.time.stop()
    this.renderer.dispose()
    this.resources.dispose()
    this.sceneManager.dispose()
  }
}
