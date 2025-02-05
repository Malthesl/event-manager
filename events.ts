/**
 * Event Controller
 */
export class EventController<M extends Record<string, any> = { [key: string]: any }>
{
  listeners: { [event: string]: EventListener[] } = {};
  
  on<K extends string = Extract<keyof M, string>> (event: K, callback: (e: M[K]) => void): EventListener
  {
    return new EventListener(event, callback, this);
  }
  
  once<K extends string = Extract<keyof M, string>> (event: K, callback: (e: M[K]) => void): EventListener
  {
    let listener = new EventListener(event, e =>
    {
      callback(e);
      listener.remove();
    }, this);
    return listener;
  }
  
  onceAsync<K extends string = Extract<keyof M, string>> (event: K): Promise<M[K]>
  {
    return new Promise(resolve =>
    {
      let listener = new EventListener(event, e =>
      {
        resolve(e);
        listener.remove();
      }, this);
    });
  }
  
  emit<K extends string = Extract<keyof M, string>> (event: K, e?: M[K])
  {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => listener.call(e));
    }
  }
}

/**
 * Event Listener
 */
export class EventListener
{
  event: string;
  callback: (e?: any) => void;
  controller: EventController;
  
  constructor (event: string, callback: (e?: any) => void, controller: EventController)
  {
    this.event = event;
    this.callback = callback;
    this.controller = controller;
    ( controller.listeners[event] ??= [] ).push(this);
  }
  
  remove (): void
  {
    this.controller.listeners[this.event].splice(this.controller.listeners[this.event].indexOf(this), 1);
  }
  
  call (e?: any): void
  {
    this.callback(e);
  }
}
