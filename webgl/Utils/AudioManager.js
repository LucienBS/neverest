import { Audio, AudioListener, PositionalAudio } from 'three'
import Experience from '../Experience'

export default class AudioManager {
  constructor() {
    // Get elements from experience
    this.experience = new Experience()
    this.camera = this.experience.renderer.camera
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    // New elements
    this.debugFolder = null
    this.listener = null
    this.audios = {}

    this.init()
  }

  /**
   * Set debug
   */
  setDebug(title, audio) {
    // Folder
    this.debugFolder ??= this.debug.addFolder({ title: 'Audio' })

    // Subfolder
    const sub = this.debugFolder.addFolder({
      title: `${audio.parent ? 'O - ' : ''}${title}`,
      expanded: false,
    })

    // Play state
    const isPlaying = { value: audio.isPlaying }
    sub.addBinding(isPlaying, 'value', { label: 'Play' }).on('change', () => {
      audio.isPlaying ? audio.pause() : audio.play()
    })

    // Loop
    const loop = { value: audio.loop }
    sub.addBinding(loop, 'value', { label: 'Loop' }).on('change', () => {
      audio.setLoop(loop.value)
    })

    // Volume
    const volume = { value: audio.volume }
    sub
      .addBinding(volume, 'value', {
        label: 'Volume',
        min: 0,
        max: 1,
        step: 0.01,
      })
      .on('change', () => audio.setVolume(volume.value))

    return sub
  }

  /**
   * Add an audio
   */
  add({ name, parent, distance, loop = false, volume = 1, play = false } = {}) {
    if (this.audios[name]) return

    const source = this.resources.items[name]
    const sound = new (parent ? PositionalAudio : Audio)(this.listener)

    sound.setBuffer(source)
    sound.setLoop(loop)
    sound.setVolume(volume)

    distance && sound.setRefDistance(distance)
    play && sound.play()

    parent?.add(sound)

    sound.name = name
    sound.parent = parent || null
    sound.volume = volume

    this.audios[name] = sound
    this.audios[name].debug = this.debug && this.setDebug(name, sound)
  }

  /**
   * Remove an audio
   */
  remove(name) {
    this.audios[name].debug && this.debugFolder?.remove(this.audios[name].debug)
    this.audios[name]?.stop()
    delete this.audios[name]

    if (Object.keys(this.audios).length == 0) {
      this.debug?.remove(this.debugFolder)
      this.debugFolder = null
    }
  }

  /**
   * Init the audio manager
   */
  init() {
    this.listener = new AudioListener()
    this.camera.add(this.listener)
  }

  /**
   * Dispose the audio manager
   */
  dispose() {
    this.debugFolder && this.debug?.remove(this.debugFolder)

    this.listener = null
    Object.keys(this.audios).forEach((name) => this.remove(name))
  }
}
