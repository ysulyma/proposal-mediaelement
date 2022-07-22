interface MediaElementEventMap {
  "durationchange": Event;
  "ended": Event;
  "pause": Event;
  "play": Event;
  "playing": Event;
  "ratechange": Event;
  "seeked": Event;
  "seeking": Event;
  "timeupdate": Event;
  "volumechange": Event;
}

export type MediaElement = Pick<HTMLMediaElement,
  "currentTime" |
  "duration" |
  "muted" |
  "pause" |
  "paused" |
  "play" |
  "playbackRate" |
  "seeking" |
  "volume"
> & {
  addEventListener<K extends keyof MediaElementEventMap>(type: K, listener: (this: MediaElement, ev: MediaElementEventMap[K]) => any): void;
  removeEventListener<K extends keyof MediaElementEventMap>(type: K, listener: (this: MediaElement, ev: MediaElementEventMap[K]) => any): void;
};

export class SyntheticMediaElement implements MediaElement {
  /** Flag indicating whether playback is currently paused. */
  paused = true;

  /* private fields */
  private __playingFrom: number;
  private __startTime: number;
  private __listeners: Record<keyof MediaElementEventMap, ((this: MediaElement, ev: Event) => any)[]>;

  /* private fields exposed by getters */
  private __currentTime: number;
  private __duration: number;
  private __playbackRate = 1;
  private __muted = false;
  private __seeking = false;
  private __volume = 1;

  constructor() {
    this.__currentTime = 0;
    this.__playingFrom = 0;
    this.__startTime = performance.now() / 1000;
    this.__listeners = {
      "durationchange": [],
      "ended": [],
      "pause": [],
      "play": [],
      "playing": [],
      "ratechange": [],
      "seeked": [],
      "seeking": [],
      "timeupdate": [],
      "volumechange": []
    };

    // bind methods
    for (const method of ["pause", "play", "__advance"]) {
      this[method] = this[method].bind(this);
    }

    // initiate playback loop
    requestAnimationFrame(this.__advance);
  }

  /* magic properties */

  /** The current playback time in seconds. */
  get currentTime(): number {
    return this.__currentTime;
  }

  set currentTime(t: number) {
    t = Math.min(this.duration, Math.max(0, t));

    this.__currentTime = this.__playingFrom = t;
    this.__startTime = performance.now() / 1000;

    this.__emit("seeking");
    this.__emit("seeked");
  }

  /**
    * Length of the playback in seconds.
  */
  get duration(): number {
    return this.__duration;
  }

  /** @emits durationchange */
  set duration(duration: number) {
    if (duration === this.__duration)
      return;

    this.__duration = duration;

    this.__emit("durationchange");
  }

  /** Gets or sets a flag that indicates whether playback is muted. */
  get muted(): boolean {
    return this.__muted;
  }

  /** @emits volumechange */
  set muted(val: boolean) {
    if (val === this.__muted)
      return;

    this.__muted = val;

    this.__emit("volumechange");
  }

  /** Gets or sets the current rate of speed for the playback. */
  get playbackRate(): number {
    return this.__playbackRate;
  }

  /** @emits ratechange */
  set playbackRate(val: number) {
    if (val === this.__playbackRate)
      return;

    this.__playbackRate = val;
    this.__playingFrom = this.__currentTime;
    this.__startTime = performance.now() / 1000;
    this.__emit("ratechange");
  }

  /** Gets or sets a flag that indicates whether the playback is currently moving to a new position. */
  get seeking(): boolean {
    return this.__seeking;
  }

  /**
   * @emits seeking
   * @emits seeked
   */
  set seeking(val: boolean) {
    if (val === this.__seeking)
      return;

    this.__seeking = val;
    if (this.__seeking) this.__emit("seeking");
    else this.__emit("seeked");
  }

  /**
   * Pause playback.
   * 
   * @emits pause
   */
  pause(): void {
    this.paused = true;
    this.__playingFrom = this.__currentTime;

    this.__emit("pause");
  }

  /**
   * Start or resume playback.
   * 
   * @emits play
   */
  async play(): Promise<void> {
    this.paused = false;

    // this is necessary for currentTime to be correct when playing from stop state
    this.__currentTime = this.__playingFrom;
    this.__startTime = performance.now() / 1000;

    this.__emit("play");
  }

  /** Gets or sets the volume level for the playback. */
  get volume(): number {
    return this.__volume;
  }

  /** @emits volumechange */
  set volume(volume: number) {
    this.muted = false;
    const prevVolume = this.__volume;
    this.__volume = Math.min(1, Math.max(0, volume));

    if (prevVolume === this.__volume)
      return;

    this.__emit("volumechange");
  }

  addEventListener<K extends keyof MediaElementEventMap>(type: K, listener: (this: MediaElement, ev: MediaElementEventMap[K]) => any): void {
    this.__listeners[type].push(listener);
  }

  removeEventListener<K extends keyof MediaElementEventMap>(type: K, listener: (this: MediaElement, ev: MediaElementEventMap[K]) => any): void {
    const index = this.__listeners[type].indexOf(listener);
    if (index !== -1) {
      this.__listeners[type].splice(index, 1);
    }
  }

  /* private methods */

  /**
   * @emits timeupdate
   */
  private __advance(t: number): void {
    // paused
    if (this.paused || this.__seeking) {
      this.__startTime = t;
    } else {
      // playing
      this.__currentTime = this.__playingFrom + Math.max((t - this.__startTime) * this.__playbackRate, 0);

      // end of playback
      if (this.__currentTime >= this.duration) {
        this.__currentTime = this.duration;

        this.paused = true;
        this.__playingFrom = 0;
        this.__emit("ended");
      }

      this.__emit("timeupdate");
    }

    requestAnimationFrame(this.__advance);
  }

  private __emit(type: keyof MediaElementEventMap): void {
    const event = new Event(type);
    for (const listener of this.__listeners[type]) {
      listener.call(this, event);
    }
  }
}
