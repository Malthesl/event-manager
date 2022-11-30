export class EventController {
  listeners: {[event: string]: EventListener[]} = {};
  
  on(event: string, callback: (e?: any) => void): EventListener {
    return new EventListener(event, callback, this);
  }
  
  once(event: string, callback: (e?: any) => void): EventListener {
    let listener = new EventListener(event, e => {
      callback(e);
      listener.remove();
    }, this);
    return listener;
  }
  
  emit(event: string, e?: any) {
    if (this.listeners[event])
    {
      this.listeners[event].forEach(listener => listener.call(e));
    }
  }
}

class EventListener {
  event: string;
  callback: (e?: any) => void;
  controller: EventController;
  
  constructor(event: string, callback: (e?: any) => void, controller: EventController) {
    this.event = event;
    this.callback = callback;
    this.controller = controller;
    (controller.listeners[event] ??= []).push(this);
  }
  
  remove(): void {
    this.controller.listeners[this.event].splice(this.controller.listeners[this.event].indexOf(this), 1);
  }
  
  call(e?: any): void {
    this.callback(e);
  }
}
