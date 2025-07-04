import React__default, { useEffect } from 'react';

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}

function useOnMount(callback) {
  useEffect(callback, []);
}

var _excluded = ["id", "volume", "playbackRate", "soundEnabled", "interrupt", "onload"];
function useSound(src, _temp) {
  var _ref = _temp === void 0 ? {} : _temp,
    _ref$volume = _ref.volume,
    volume = _ref$volume === void 0 ? 1 : _ref$volume,
    _ref$playbackRate = _ref.playbackRate,
    playbackRate = _ref$playbackRate === void 0 ? 1 : _ref$playbackRate,
    _ref$soundEnabled = _ref.soundEnabled,
    soundEnabled = _ref$soundEnabled === void 0 ? true : _ref$soundEnabled,
    _ref$interrupt = _ref.interrupt,
    interrupt = _ref$interrupt === void 0 ? false : _ref$interrupt,
    onload = _ref.onload,
    delegated = _objectWithoutPropertiesLoose(_ref, _excluded);
  var HowlConstructor = React__default.useRef(null);
  var isMounted = React__default.useRef(false);
  var _React$useState = React__default.useState(null),
    duration = _React$useState[0],
    setDuration = _React$useState[1];
  var _React$useState2 = React__default.useState(null),
    sound = _React$useState2[0],
    setSound = _React$useState2[1];
  var handleLoad = function handleLoad() {
    if (typeof onload === 'function') {
      // @ts-ignore
      onload.call(this);
    }
    if (isMounted.current) {
      // @ts-ignore
      setDuration(this.duration() * 1000);
    }
    // @ts-ignore
    setSound(this);
  };
  // We want to lazy-load Howler, since sounds can't play on load anyway.
  useOnMount(function () {
    import('howler').then(function (mod) {
      if (!isMounted.current) {
        var _mod$Howl;
        // Depending on the module system used, `mod` might hold
        // the export directly, or it might be under `default`.
        HowlConstructor.current = (_mod$Howl = mod.Howl) !== null && _mod$Howl !== void 0 ? _mod$Howl : mod["default"].Howl;
        isMounted.current = true;
        new HowlConstructor.current(_extends({
          src: Array.isArray(src) ? src : [src],
          volume: volume,
          rate: playbackRate,
          onload: handleLoad
        }, delegated));
      }
    });
    return function () {
      isMounted.current = false;
    };
  });
  // When the `src` changes, we have to do a whole thing where we recreate
  // the Howl instance. This is because Howler doesn't expose a way to
  // tweak the sound
  React__default.useEffect(function () {
    if (HowlConstructor.current && sound) {
      setSound(new HowlConstructor.current(_extends({
        src: Array.isArray(src) ? src : [src],
        volume: volume,
        rate: playbackRate,
        onload: handleLoad
      }, delegated)));
    }
    // The linter wants to run this effect whenever ANYTHING changes,
    // but very specifically I only want to recreate the Howl instance
    // when the `src` changes. Other changes should have no effect.
    // Passing array to the useEffect dependencies list will result in
    // ifinite loop so we need to stringify it, for more details check
    // https://github.com/facebook/react/issues/14476#issuecomment-471199055
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(src)]);
  // Whenever volume/playbackRate are changed, change those properties
  // on the sound instance.
  React__default.useEffect(function () {
    if (sound) {
      sound.volume(volume);
      // HACK: When a sprite is defined, `sound.rate()` throws an error, because Howler tries to reset the "_default" sprite, which doesn't exist. This is likely a bug within Howler, but I don’t have the bandwidth to investigate, so instead, we’re ignoring playbackRate changes when a sprite is defined.
      if (!delegated.sprite) {
        sound.rate(playbackRate);
      }
    }
  }, [sound, volume, playbackRate, delegated.sprite]);
  var play = React__default.useCallback(function (options) {
    if (typeof options === 'undefined') {
      options = {};
    }
    if (!sound || !soundEnabled && !options.forceSoundEnabled) {
      return;
    }
    if (interrupt) {
      sound.stop();
    }
    if (options.playbackRate) {
      sound.rate(options.playbackRate);
    }
    sound.play(options.id);
  }, [sound, soundEnabled, interrupt]);
  var stop = React__default.useCallback(function (id) {
    if (!sound) {
      return;
    }
    sound.stop(id);
  }, [sound]);
  var pause = React__default.useCallback(function (id) {
    if (!sound) {
      return;
    }
    sound.pause(id);
  }, [sound]);
  var returnedValue = [play, {
    sound: sound,
    stop: stop,
    pause: pause,
    duration: duration
  }];
  return returnedValue;
}

export default useSound;
export { useSound };
//# sourceMappingURL=use-sound.esm.js.map
