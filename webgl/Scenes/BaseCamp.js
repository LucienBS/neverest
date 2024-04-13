import { AmbientLight, DirectionalLight, Vector3 } from 'three'
import BaseCampItem from '../Components/Shared/BaseCampItem/BaseCampItem'
import BasicScene from '../Modules/Basics/BasicScene'
import { types, val } from '@theatre/core'
import Floor from '../Components/BaseCamp/Floor/Floor'

export default class BaseCamp extends BasicScene {
  /**
   * Constructor
   */
  constructor() {
    super()

    // New elements
    this.resources = this.experience.resources
    this.project = this.experience.project
    this.sheet = null
    this.cameraObj = null
    this.blocking = []

    // Store
    this.currentScroll = computed(
      () => Math.round(useScrollStore().getCurrent * 100) / 100
    )

    // Watchers
    this.watcher = watch(
      this.currentScroll,
      () => this.camera?.instance && this.playSequence()
    )

    // Init the scene
    this.init()
  }

  /**
   * Scroll the camera around the cube
   */
  setCamera() {
    this.camera.instance.position.y = 5
  }

  init() {
    // Set the camera
    this.setCamera()

    // Setup the sheet
    // this.setupSheet()

    // Blocking
    this.setBlocking()

    // Set the floor
    this.setFloor()

    // Set the lights
    this.setLights()

    super.init()
  }

  /**
   * Setup the sheet
   */
  setupSheet() {
    // Create a sheet
    this.sheet = this.project.sheet('BaseCamp Camera animation')

    // Create Theatre object with camera props
    this.cameraObj = this.sheet.object(
      'Camera',
      {
        rotation: types.compound({
          x: types.number(this.camera.instance.rotation.x, { range: [-2, 2] }),
          y: types.number(this.camera.instance.rotation.y, { range: [-2, 2] }),
          z: types.number(this.camera.instance.rotation.z, { range: [-2, 2] }),
        }),
        position: types.compound({
          x: types.number(this.camera.instance.position.x, {
            range: [-10, 10],
          }),
          y: types.number(this.camera.instance.position.y, {
            range: [-10, 10],
          }),
          z: types.number(this.camera.instance.position.z, {
            range: [-30, 30],
          }),
        }),
        visible: types.boolean(this.components.cube.item.visible),
      },
      { reconfigure: true }
    )

    // Listen to values change
    this.cameraObj.onValuesChange((values) => {
      const { rotation, position, visible } = values

      if (!this.camera.instance) return

      this.camera.instance.rotation.set(rotation.x, rotation.y, rotation.z)
      this.camera.instance.position.set(position.x, position.y, position.z)
      this.components.cube.item.visible = visible
    })
  }

  /**
   * Play the sheet sequence depending on the scroll
   */
  playSequence() {
    if (!this.sheet || !this.sheet.sequence) return

    const sequenceLength = val(this.sheet.sequence.pointer.length)
    const newPosition = (this.currentScroll.value / 100) * sequenceLength
    this.sheet.sequence.position = newPosition
  }

  /**
   * Set floor
   */
  setFloor() {
    this.components.floor = new Floor()
  }

  /**
   * Set lights
   */
  setLights() {
    this.lights = {
      ambient: new AmbientLight(0xffffff, 0.5),
      directional: new DirectionalLight(0xffffff, 0.8),
    }

    this.lights.directional.position.set(0, 1, 0)
    this.lights.directional.target.position.set(0, 0, 0)

    this.scene.add(this.lights.ambient)
    this.scene.add(this.lights.directional)
    this.scene.add(this.lights.directional.target)
  }

  /**
   * Blocking
   */
  setBlocking() {
    this.blocking = [
      {
        name: 'Boxd',
        position: new Vector3(-6.768, -0.019, -3.797),
        rotation: new Vector3(0, -0.631, 0),
        scale: new Vector3(0.746, 0.836, 0.746),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Boxd1',
        position: new Vector3(-5.255, -0.013, -5.031),
        rotation: new Vector3(0, -1.269, 0),
        scale: new Vector3(0.72, 0.72, 0.72),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Boxd2',
        position: new Vector3(-4.404, 0.01, -6.196),
        rotation: new Vector3(0, -0.624, 0),
        scale: new Vector3(0.72, 0.72, 0.72),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Boxd3',
        position: new Vector3(-3.562, 0.006, -7.182),
        rotation: new Vector3(0, -0.624, 0),
        scale: new Vector3(0.5, 0.5, 0.5),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Boxu',
        position: new Vector3(-5.608, 1.206, -5.397),
        rotation: new Vector3(0, 0.785, 0),
        scale: new Vector3(0.448, 0.448, 0.448),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Boxu1',
        position: new Vector3(-4.521, 1.184, -5.838),
        rotation: new Vector3(-3.141, 0.789, -3.141),
        scale: new Vector3(0.327, 0.327, 0.327),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Boxd004',
        position: new Vector3(9.024, 0.01, -15.228),
        rotation: new Vector3(3.141, -1.197, 3.141),
        scale: new Vector3(0.72, 0.72, 0.72),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Boxd005',
        position: new Vector3(9.97, 0.01, -13.099),
        rotation: new Vector3(3.141, -0.124, 3.141),
        scale: new Vector3(0.72, 0.72, 0.72),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Boxu002',
        position: new Vector3(8.618, -0.014, -13.226),
        rotation: new Vector3(0, -0.077, 0),
        scale: new Vector3(0.448, 0.448, 0.448),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Boxu003',
        position: new Vector3(8.645, -0.024, -11.573),
        rotation: new Vector3(0, 0.216, 0),
        scale: new Vector3(0.327, 0.203, 0.327),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Boxd006',
        position: new Vector3(-4.67, 0.01, -35.288),
        rotation: new Vector3(0, -0.624, 0),
        scale: new Vector3(0.72, 0.72, 0.72),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Box',
        position: new Vector3(6.163, -0.224, -17.777),
        rotation: new Vector3(3.141, 0.03, 3.141),
        scale: new Vector3(0.275, 0.275, 0.275),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Boxl',
        position: new Vector3(5.775, -0.224, -18.327),
        rotation: new Vector3(-3.141, -0.556, -3.141),
        scale: new Vector3(0.275, 0.275, 0.275),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Boxr',
        position: new Vector3(6.71, -0.224, -18.197),
        rotation: new Vector3(3.141, -0.31, 3.141),
        scale: new Vector3(0.275, 0.275, 0.275),
        model: this.resources.items.bloc.scene,
      },
      {
        name: 'Mountain',
        position: new Vector3(6.861, 1.409, -200.991),
        rotation: new Vector3(Math.PI, -0.65, Math.PI),
        scale: new Vector3(46.323, 46.323, 46.323),
        model: this.resources.items.backgroundMountain.scene,
      },
      {
        name: 'MountainL',
        position: new Vector3(-61.858, -0.462, -140.939),
        rotation: new Vector3(0, -0.939, 0),
        scale: new Vector3(70.881, 70.881, 70.881),
        model: this.resources.items.backgroundMountainL.scene,
      },
      {
        name: 'Mountainl',
        position: new Vector3(-16.473, 2.165, -85.604),
        rotation: new Vector3(-0.051, 0.094, -0.095),
        scale: new Vector3(3.208, 3.208, 3.208),
        model: this.resources.items.backgroundMountainLS.scene,
      },
      {
        name: 'MountainR',
        position: new Vector3(39.906, -1.376, -158.968),
        rotation: new Vector3(0, -0.749, 0),
        scale: new Vector3(61.155, 61.155, 61.155),
        model: this.resources.items.backgroundMountainR.scene,
      },
      {
        name: 'Mountainr',
        position: new Vector3(21.521, 3.897, -49.116),
        rotation: new Vector3(-3.075, -0.701, 3.085),
        scale: new Vector3(3.208, 3.208, 3.208),
        model: this.resources.items.backgroundMountainRS.scene,
      },
      {
        name: 'Stake',
        position: new Vector3(5.866, -1.144, -17.924),
        rotation: new Vector3(1.487, -0.274, 0.56),
        scale: new Vector3(0.425, 0.425, 0.425),
        model: this.resources.items.tent.scene,
      },
      {
        name: 'Tent_Primative_l_1',
        position: new Vector3(-7.939, -0.098, -30.382),
        rotation: new Vector3(0, 1.128, 0),
        scale: new Vector3(1.2, 1.2, 1.2),
        model: this.resources.items.tent.scene,
      },
      {
        name: 'Tent_Primative_main',
        position: new Vector3(0.551, -0.18, -36.868),
        rotation: new Vector3(3.141, 0.045, 3.141),
        scale: new Vector3(1.412, 1.412, 1.412),
        model: this.resources.items.tent.scene,
      },
      {
        name: 'Tent_Primative_r_1',
        position: new Vector3(4.993, -0.134, -21.521),
        rotation: new Vector3(-0.036, 0.938, -0.005),
        scale: new Vector3(1.044, 1.044, 1.044),
        model: this.resources.items.tent.scene,
      },
      {
        name: 'Tent_Primative_r_2',
        position: new Vector3(9.231, 0.006, -17.279),
        rotation: new Vector3(3.141, 1.365, 3.141),
        scale: new Vector3(0.953, 0.953, 0.953),
        model: this.resources.items.tent.scene,
      },
      {
        name: 'Tent_Primative_l_1001',
        position: new Vector3(-6.143, -0.098, -33.12),
        rotation: new Vector3(0, 0.696, 0),
        scale: new Vector3(1.2, 1.2, 1.2),
        model: this.resources.items.tent.scene,
      },
    ]

    this.blocking.forEach((block) => {
      this.components[block.name] = new BaseCampItem({
        name: block.name,
        model: block.model,
        position: block.position,
        rotation: block.rotation,
        scale: block.scale,
      })
    })
  }

  dispose() {
    super.dispose()
  }
}
