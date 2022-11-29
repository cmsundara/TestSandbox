/**
 * @module c02-image
 *
 * @author Christian Sany
 */
import createModule from '@/scripts/libs/create-module';
import ImageLoader from './image-loader';

export default createModule({
  options: () => ({
    domSelectors: {
      image: '[data-image="image"]',
    },
  }),

  /**
   * createImage
   * @param {Object} module - Module
   * @param {Element} module.el - Element
   * @param {Object} module.state - State
   * @param {Object} module.options - Options
   * @return {Object} state
   */
  constructor({ el, state, options }) {
    /* --- Private methods --- */

    /**
     * @return {undefined}
     */
    const initUi = () => {
      state.ui = {
        image: el.querySelector(options.domSelectors.image),
      };
    };

    /* --- Public methods --- */

    /**
     * init
     * @return {undefined}
     */
    state.init = () => {
      initUi();

      // Observe image
      ImageLoader.getInstance().observeImage(state.ui.image);
    };

    /**
     * destroy
     * @return {undefined}
     */
    state.destroy = () => {
      // Removes image from IntersectionObserver
      // If the image is already laoded, this won't do anything
      ImageLoader.getInstance().unobserveImage(state.ui.image);
    };

    state.init();

    return state;
  },
});
