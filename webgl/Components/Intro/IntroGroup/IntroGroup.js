import { Vector3 } from 'three'
import BasicItem from '~/webgl/Modules/Basics/BasicItem'
import Mountain from '../Mountain/Mountain'
import InfoLine from '../InfoLine/InfoLine'
import IntroLights from '../IntroLights/IntroLights'
import PlaneTextureIntro from '../PlaneTextureIntro/PlaneTextureIntro'
import IntroFlag from '../IntroFlag/IntroFlag'
import Experience from '~/webgl/Experience'

export default class IntroGroup extends BasicItem {
  constructor() {
    super()

    this.experience = new Experience()
    this.ressources = this.experience.resources.items
    // New elements
    this.cssRenderer = null
  }

  /**
   * Set camera position
   */
  setCameraPos() {

    //this.parentScene.camera.instance.position.y=5
    //this.parentScene.camera.instance.lookAt(new Vector3(0,0,0))

  }

  /**
   * Add components
   */
  addComponents() {
    this.components = {
      //mountain: new Mountain(),
      //infoLine1: new InfoLine(
      //  [new Vector3(0, 0, 0), new Vector3(0, 6, 0), new Vector3(0, 8, 0)],
      //  new Vector3(-12, -9, 1),
      //  {
      //    id: 'label-camp-base',
      //    position: new Vector3(0, 8.5, 0),
      //    data: {
      //      value: 'BASECAMP',
      //    },
      //  }
      //),
      //infoLine2: new InfoLine(
      //  [new Vector3(0, 0, 0), new Vector3(0, 4, 0), new Vector3(0, 5, 0)],
      //  new Vector3(2, -5, 6),
      //  {
      //    id: 'label-col-sud',
      //    position: new Vector3(0, 5.5, 0),
      //    data: {
      //      value: 'SOUTHCOL',
      //    },
      //  }
      //),
      //infoLine3: new InfoLine(
      //  [new Vector3(0, 0, 0), new Vector3(0, 6, 0), new Vector3(0, 7, 0)],
      //  new Vector3(4, -5 , 5),
      //  {
      //    id: 'label-neverest-buttress',
      //    position: new Vector3(0, 7.5, 0),
      //    data: {
      //      value: 'NEVERESTBUTTRESS',
      //    },
      //  }
      //),
      //infoLine4: new InfoLine(
      //  [new Vector3(0, 0, 0), new Vector3(0, 4, 0), new Vector3(0, 5, 0)],
      //  new Vector3(5, -6 , 2.5),
      //  {
      //    id: 'label-american-buttres',
      //    position: new Vector3(0, 5.5, 0),
      //    data: {
      //      value: 'AMERICANBUTTRESS',
      //    },
      //  }
      //),
      //infoLine5: new InfoLine(
      //  [new Vector3(0, 0, 0), new Vector3(0, 2, 0), new Vector3(0, 3, 0)],
      //  new Vector3(5, -4 , -5.5),
      //  {
      //    id: 'label-northeast-ridge',
      //    position: new Vector3(0, 3.5, 0),
      //    data: {
      //      value: 'NORTHEASTRIDGE',
      //    },
      //  }
      //),
      //infoLine6: new InfoLine(
      //  [new Vector3(0, 0, 0), new Vector3(0, 4, 0), new Vector3(0, 5, 0)],
      //  new Vector3(2, -5 , -6),
      //  {
      //    id: 'label-north-ridge',
      //    position: new Vector3(0, 5.5, 0),
      //    data: {
      //      value: 'NORTHRIDGE',
      //    },
      //  }
      //),
      //infoLine7: new InfoLine(
      //  [new Vector3(0, 0, 0), new Vector3(0, 5, 0), new Vector3(0, 6, 0)],
      //  new Vector3(0, -5 , -5),
      //  {
      //    id: 'label-great-couloir',
      //    position: new Vector3(0, 6.5, 0),
      //    data: {
      //      value: 'GREATCOULOIR',
      //    },
      //  }
      //),
      //infoLine8: new InfoLine(
      //  [new Vector3(0, 0, 0), new Vector3(0, 4, 0), new Vector3(0, 5, 0)],
      //  new Vector3(-1, -6 , -3.5),
      //  {
      //    id: 'label-japanese-couloir',
      //    position: new Vector3(0, 5.5, 0),
      //    data: {
      //      value: 'JAPANESECOULOIR',
      //    },
      //  }
      //),
      //infoLine9: new InfoLine(
      //  [new Vector3(0, 0, 0), new Vector3(0, 4, 0), new Vector3(0, 5, 0)],
      //  new Vector3(-3, -4 , -2.5),
      //  {
      //    id: 'label-west-ridge',
      //    position: new Vector3(0, 5.5, 0),
      //    data: {
      //      value: 'WESTRIDGE',
      //    },
      //  }
      //),
      //infoLine10: new InfoLine(
      //  [new Vector3(0, 0, 0), new Vector3(0, 6, 0), new Vector3(0, 7, 0)],
      //  new Vector3(-5, -9, 4),
      //  {
      //    id: 'label-icefall',
      //    position: new Vector3(0,7.5, 0),
      //    data: {
      //      value: 'ICEFALL',
      //    },
      //  }
      //),
      //lights: new IntroLights(),
      planeTexture1: new PlaneTextureIntro(this.ressources.introMountainPlan1,0,7,4.61,0.2,0,0),
      planeTexture2: new PlaneTextureIntro(this.ressources.introMountainPlan2,-1,7,4.9,0.4,0,0),
      planeTexture3: new PlaneTextureIntro(this.ressources.introMountainPlan3,-2,7,5.3,0.6,0,0),
      planeTexture4: new PlaneTextureIntro(this.ressources.introMountainPlan4,-3,7,5.61,0.8,0,0),
      planeTexture5: new PlaneTextureIntro(this.ressources.introMountainPlan5,-4,7,6,1,0,0),
      introFlag:new IntroFlag()
    }
  }

  /**
   * Init
   */
  init() {
    this.setCameraPos()
    this.addComponents()
  }

  /**
   * Update
   */
  update() {
    if (this.item) {
      //this.item.rotation.y +=0.001
    }
    if (this.cssRenderer) {
      this.cssRenderer.update()
    }
  }
}
