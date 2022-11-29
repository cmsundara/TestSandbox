import './helpers/polyfills';

import createApp from './libs/create-app';
import button from '@/scripts/modules/button';
import image from '@/scripts/modules/image';

window.apps = {};
window.apps.main = createApp({
  modules: {
    // Directly integrate module
    button,
    image: {
      features: ['IntersectionObserver', 'picture'],
      handler: image,
    },

    // lazy-load module if it's found in the DOM
    'vue-module': () =>
      import(/* webpackChunkName: "vue-mod" */ '@/scripts/modules/vue-module'),

    // lazy-laod when scrolled to this element
    'lazy-module': {
      lazy: true,
      handler: () =>
        import(
          /* webpackChunkName: "lazy-mod" */ '@/scripts/modules/lazy-module'
        ),
    },
  },
});
