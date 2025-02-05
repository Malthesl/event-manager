export class EventController {
  listeners = {};

  on(event, callback) {
    return new EventListener(event, callback, this);
  }

  once(event, callback) {
    let listener = new EventListener(event, e => {
      callback(e);
      listener.remove();
    }, this);
    return listener;
  }
  
  onceAsync(event) {
    return new Promise(resolve => {
      let listener = new EventListener(event, e => {
        resolve(e);
        listener.remove();
      }, this);
    });
  }

  emit(event, e) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => listener.call(e));
    }
  }
}

/**
 * EventListener
 */
export class EventListener {
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
