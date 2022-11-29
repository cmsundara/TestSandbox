/**
 * createImageLoader
 *
 * @description
 * Generic ImageLoader factory
 * Hooks enable customization when instantiating the ImageLoader
 *
 * @author Christian Sany
 * @copyright Unic AG
 */

import fastdom from 'fastdom';

const defaultOptions = {
  offset: '300px 100px',
  threshold: 0.01,
  hooks: undefined,
};

/**
 * createImageLoader
 * @param {Object} config - Custom configuration
 * @param {Object} state - state
 * @return {Object} state
 */
const createImageLoader = ({ config, state = {} }) => {
  const options = { ...defaultOptions, ...config };

  /* --- Private methods --- */

  /**
   * createIntersectionObserver
   * @return {IntersectionObserver} observer
   */
  const createIntersectionObserver = () => {
    const observerConfig = {
      rootMargin: options.offset,
      threshold: options.threshold,
    };

    const observer = new IntersectionObserver(async (entries) => {
      const elements = entries.filter(
        (entry) => entry.intersectionRatio >= 0.01,
      );

      if (elements.length) {
        elements.forEach((entry) => {
          // Initiate loading of the image
          state.loadImage(entry.target);
          observer.unobserve(entry.target);
        });
      }
    }, observerConfig);

    return observer;
  };

  /* --- Public methods --- */

  /**
   * loadImage
   * @param {HTMLImageElement} image - Image to load
   * @return {Promise} -
   */
  state.loadImage = async (image) => {
    // Check if onBeforeLoad hook exists
    if (options.hooks && options.hooks.onBeforeLoad) {
      // Wait for hook to be finished before loading initiates
      await options.hooks.onBeforeLoad(image);
    }

    await new Promise((resolve, reject) => {
      /* eslint-disable no-param-reassign */
      image.onload = resolve;
      image.onerror = reject;

      // Check for sources (doesn not throw error if on a normal img element)
      const sources =
        image.parentNode && image.parentNode.querySelectorAll('source');
      if (sources) {
        fastdom.mutate(() => {
          sources.forEach((source) => {
            if (source.dataset.srcset) {
              source.setAttribute('srcset', source.dataset.srcset);
            }
          });

          if (image.dataset.srcset) {
            image.setAttribute('srcset', image.dataset.srcset);
          }

          if (image.dataset.src) {
            image.setAttribute('src', image.dataset.src);
          }

          // Double check cached assets, since onload may not fire (Safari) if ressource is already cached
          if (image.complete) {
            resolve();
          }
        });
      }
    });

    if (options.hooks && options.hooks.onLoad) {
      await options.hooks.onLoad(image);
    }
  };

  /**
   * observeImage
   * @param {HTMLImageElement} image - Image which will be added to the observer
   * @return {undefined}
   */
  state.observeImage = (image) => {
    state.observer.observe(image);
  };

  /**
   * unobserveImage
   * @param {HTMLImageElement} image - Image which will be removed from the observer
   * @return {undefined}
   */
  state.unobserveImage = (image) => {
    state.observer.unobserve(image);
  };

  /**
   * init
   * @return {undefined}
   */
  state.init = () => {
    // Create the IntersectionObserver instance
    state.observer = createIntersectionObserver();
  };

  state.init();

  return state;
};

export default createImageLoader;
