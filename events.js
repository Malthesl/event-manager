export class EventController {
  listeners = {};

  on(event, callback) {
    return new EventListener(event, callback, this);
  }

  once(event, callback) {
    let listener = new EventListener(event, () => {
      callback();
      listener.remove();
    }, this);
    return listener;
  }

  emit(event, e) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => listener.call(e));
    }
  }
};

class EventListener {
  constructor(event, callback, controller) {
    this.event = event;
    this.callback = callback;
    this.controller = controller;
    (controller.listeners[event] ??= []).push(this);
  }

  remove() {
    this.controller.listeners[this.event].splice(this.controller.listeners[this.event].indexOf(this), 1);
  }

  call(e) {
    this.callback(e);
  }
}

const globalEvents = new EventController();
export default globalEvents;
