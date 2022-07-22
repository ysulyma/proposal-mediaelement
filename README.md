# (Synthetic)MediaElement proposal

## Introduction

The [`<video>`](https://html.spec.whatwg.org/multipage/media.html#the-video-element) element was one of the most revolutionary new features of HTML5, and a key part of "Web 2.0". Today, the web platform has become powerful enough to *create* videos. Libraries such as [GSAP](https://greensock.com/gsap/), [Liqvid](https://liqvidjs.org), and [Remotion](https://www.remotion.dev/docs/player) allow developers to create powerful animations and even full-length videos using Javascript. (Disclaimer: I am the author of Liqvid.) Such "videos" are just DOM manipulation synced up to an audio track (which is still a normal audio file) and a scrubber bar; in particular, they can be *interactive*, which is impossible with `.mp4` videos.

This proposal standardizes the behavior which is common between GSAP's [`Timeline`](https://greensock.com/docs/v3/GSAP/Timeline), Liqvid's [`Playback`](https://liqvidjs.org/docs/reference/Playback/), and Remotion's [`PlayerRef`](https://www.remotion.dev/docs/player/api#playerref). (There are several other libraries which implement similar functionality.) It defines one new interface, `MediaElement`, and one new class, `SyntheticMediaElement`. The desiderata are:

* the existing [`HTMLMediaElement`](https://html.spec.whatwg.org/multipage/media.html#htmlmediaelement) interface must implement `MediaElement`

* `SyntheticMediaElement` must implement `MediaElement`

In other words, `SyntheticMediaElement` implements a subset of the functionality of `<audio>`/`<video>` elements.

The choice of which properties/events to include is dicated by experience. The [Liqvid plugin suite](https://github.com/liqvidjs/plugins/tree/main/demos) is compatible with all three of GSAP/Liqvid/Remotion, and this proposal is a less-kludgy version of the [`@lqv/playback`](https://github.com/liqvidjs/plugins/blob/main/packages/playback/src/index.ts) interface that those plugins are built around.

## Details

The `MediaElement` interface includes the following properties of [`HTMLMediaElement`](https://html.spec.whatwg.org/multipage/media.html#htmlmediaelement):

* `currentTime`
* `duration`
* `muted`
* `pause()`
* `paused`
* `play()`
* `playbackRate`
* `seeking`
* `volume`

It also supports `addEventListener` and `removeEventListener` with the following event types:

* `durationchange`
* `ended`
* `pause`
* `play`
* `playing`
* `ratechange`
* `seeked`
* `seeking`
* `timeupdate`
* `volumechange`

The `SyntheticMediaElement` class implements `MediaElement`.

## Polyfill

Polyfill: [mjs](https://github.com/ysulyma/proposal-mediaelement/blob/main/polyfill.mjs), [types](https://github.com/ysulyma/proposal-mediaelement/blob/main/polyfill.d.mts), [source](https://github.com/ysulyma/proposal-mediaelement/blob/main/polyfill.mts).

This polyfill is based on Liqvid's [`Playback`](https://github.com/liqvidjs/liqvid/blob/main/packages/playback/src/core.ts) class. However, due to design errors that class does not currently implement `MediaElement` as defined above (it measures `currentTime` in milliseconds rather than seconds, and some of the event names are different).

## Enhancements

All three reference libraries implement additional functionality beyond the `MediaElement` interface defined above. We have not included these in the proposal since they violate the desideratum that the existing `HTMLMediaElement` must implement `MediaElement`. However, they are useful to keep in mind.

* [GSAP](https://greensock.com/docs/v3/GSAP/Timeline/addLabel()) and [Liqvid](https://liqvidjs.org/docs/reference/Script/) support naming specific times or intervals.

* [GSAP](https://greensock.com/docs/v3/GSAP/Timeline#nesting) and [Remotion](https://www.remotion.dev/docs/sequence) allow nesting of `Timeline`s/`Sequence`s. Similarly, Liqvid and Remotion allow ordinary `<audio>`/`<video>` elements to be controlled by the "synthetic" playback. In the future, both of these could be implemented by some sort of `adopt()` method on `SyntheticMediaElement`.

* [Liqvid](https://liqvidjs.org/docs/guide/animation#web-animations-api) allows a `Playback` to control an [`AnimationTimeline`](https://drafts.csswg.org/web-animations-1/#the-animationtimeline-interface).
