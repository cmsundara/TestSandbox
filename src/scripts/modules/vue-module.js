import Vue from 'vue';
import createModule from '@/scripts/libs/create-module';

Vue.config.silent = true;

export default createModule({
  options: () => ({
    foo: 'bar',
  }),

  /**
   * createVueModule
   * @param {Object} module - Module
   * @param {Element} module.el - Element
   * @param {Object} module.state - State
   * @param {Object} module.options - Options
   * @return {Object} state
   */
  constructor({ el, state, options }) {
    state.wm = new Vue({
      data: {
        options,
      },
    });
    state.wm.$mount(el);

    return state;
  },
});
