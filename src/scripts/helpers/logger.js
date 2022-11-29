/**
 * Logger
 *
 * @description
 * Just a small helper
 *
 * @type Singleton
 *
 * @author Christian Sany
 */

let instance;
/**
 * createLogger
 * @param {Object} state - state
 * @return {Object} state
 */
const createLogger = (state = {}) => {
  state.debug = (message) => {
    console.log(
      '%c[Debug]%c ' + message,
      'background: #222; color: #E14F1A; padding: 2px 4px; border-radius: 4px',
      '',
    );
  };

  return state;
};

export default {
  /**
   * getInstance
   * creates Logger if doesn't exist, or returns immediatly when already existing
   * @return {Object} - Logger
   */
  getInstance() {
    if (!instance) {
      instance = createLogger();
    }
    return instance;
  },
};
