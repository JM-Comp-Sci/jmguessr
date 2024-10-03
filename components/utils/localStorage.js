export default class gameStorage {
  static setItem(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {}
  }
  static getItem(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {}
  }
  static removeItem(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {}
  }
}