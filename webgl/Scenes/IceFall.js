import { MathUtils, Vector3 } from 'three'
import IFFloor from '../Components/Icefall/IFFloor/IFFloor'
import Iceblocks from '../Components/Icefall/Iceblocks/Iceblocks'
import Mountains from '../Components/Icefall/Mountains/Mountains'
import BasicScene from '../Modules/Basics/BasicScene'

export default class IceFall extends BasicScene {
  /**
   * Constructor
   */
  constructor({ interest }) {
    super()

    // Get elements from experience
    this.scrollManager = this.experience.scrollManager

    // New elements
    this.icefallObj = null
    this.baseCamRot = null
    this.camRotTarget = null
    this.currentPoint = 0
    this.interest = interest

    // Components
    this.components = {
      moutains: new Mountains(),
      iceblocks: new Iceblocks(),
      floor: new IFFloor(),
    }

    // Init the scene
    this.init()
  }

  // --------------------------------
  // Workflow
  // --------------------------------

  /**
   * Go to the next interest point
   */
  navigate() {
    this.currentPoint += 1

    const scroll = (100 / (this.interest.list?.length - 1)) * this.currentPoint
    this.scrollManager.to(scroll)
  }

  /**
   * Set the camera
   */
  initCamera() {
    this.camera.instance.position.set(0.31, 28, 60)
    this.camera.instance.lookAt(new Vector3((Math.PI * 75) / 180, 10, 0))
    this.baseCamRot = this.camera.instance.rotation.clone()
    this.camRotTarget = this.baseCamRot.clone()
  }

  /**
   * On mouse move in the window
   * @param {*} param0
   */
  onMouseMoveEvt({ centered }) {
    super.onMouseMoveEvt({ centered })

    this.camRotTarget = {
      x: this.baseCamRot.x + centered.y * 0.0025,
      y: this.baseCamRot.y - centered.x * 0.0025,
    }
  }

  // --------------------------------
  // Lifecycle
  // --------------------------------

  /**
   * Update
   */
  update() {
    super.update()

    this.camera.instance.rotation.x = MathUtils.lerp(
      this.camera.instance.rotation.x,
      this.camRotTarget?.x,
      0.1
    )
    this.camera.instance.rotation.y = MathUtils.lerp(
      this.camera.instance.rotation.y,
      this.camRotTarget?.y,
      0.1
    )
  }

  /**
   * After init and entrance transition end
   */
  onInitComplete() {
    super.onInitComplete()
    this.scrollManager.setDisable(true)
    this.scrollManager.to(5)
  }

  /**
   * Init
   */
  init() {
    super.init()
    this.initCamera()
  }
}
