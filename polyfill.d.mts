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
export declare type MediaElement = Pick<HTMLMediaElement, "currentTime" | "duration" | "muted" | "pause" | "paused" | "play" | "playbackRate" | "seeking" | "volume"> & {
    addEventListener<K extends keyof MediaElementEventMap>(type: K, listener: (this: MediaElement, ev: MediaElementEventMap[K]) => any): void;
    removeEventListener<K extends keyof MediaElementEventMap>(type: K, listener: (this: MediaElement, ev: MediaElementEventMap[K]) => any): void;
};
export declare class SyntheticMediaElement implements MediaElement {
    /** Flag indicating whether playback is currently paused. */
    paused: boolean;
    private __playingFrom;
    private __startTime;
    private __listeners;
    private __currentTime;
    private __duration;
    private __playbackRate;
    private __muted;
    private __seeking;
    private __volume;
    constructor();
    /** The current playback time in seconds. */
    get currentTime(): number;
    set currentTime(t: number);
    /**
      * Length of the playback in seconds.
    */
    get duration(): number;
    /** @emits durationchange */
    set duration(duration: number);
    /** Gets or sets a flag that indicates whether playback is muted. */
    get muted(): boolean;
    /** @emits volumechange */
    set muted(val: boolean);
    /** Gets or sets the current rate of speed for the playback. */
    get playbackRate(): number;
    /** @emits ratechange */
    set playbackRate(val: number);
    /** Gets or sets a flag that indicates whether the playback is currently moving to a new position. */
    get seeking(): boolean;
    /**
     * @emits seeking
     * @emits seeked
     */
    set seeking(val: boolean);
    /**
     * Pause playback.
     *
     * @emits pause
     */
    pause(): void;
    /**
     * Start or resume playback.
     *
     * @emits play
     */
    play(): Promise<void>;
    /** Gets or sets the volume level for the playback. */
    get volume(): number;
    /** @emits volumechange */
    set volume(volume: number);
    addEventListener<K extends keyof MediaElementEventMap>(type: K, listener: (this: MediaElement, ev: MediaElementEventMap[K]) => any): void;
    removeEventListener<K extends keyof MediaElementEventMap>(type: K, listener: (this: MediaElement, ev: MediaElementEventMap[K]) => any): void;
    /**
     * @emits timeupdate
     */
    private __advance;
    private __emit;
}
export {};
