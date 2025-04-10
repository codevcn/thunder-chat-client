import { EEventNames } from "../enums"

type TEventListener<T = any> = (e: CustomEvent<T>) => void

class CustomEventManager {
   private readonly events: Map<EEventNames, TEventListener> = new Map()

   createEvent<T>(eventName: EEventNames, eventPayload?: T): CustomEvent<T> {
      return new CustomEvent<T>(eventName, { detail: eventPayload })
   }

   dispatchEvent<T>(eventName: EEventNames, eventPayload?: T): void {
      document.dispatchEvent(this.createEvent(eventName, eventPayload))
   }

   on<P = any>(eventName: EEventNames, callback: (payload: P) => void): void {
      if (this.events.has(eventName)) {
         this.off(eventName)
      }
      const wrappedListener = (e: Event) => {
         if (this.isCustomEvent<P>(e)) {
            callback(e.detail)
         }
      }
      this.events.set(eventName, wrappedListener)
      document.addEventListener(eventName, wrappedListener)
   }

   off(eventName: EEventNames): void {
      const eventListener = this.events.get(eventName)
      if (eventListener) {
         document.removeEventListener(eventName, eventListener as any)
         this.events.delete(eventName)
      }
   }

   isCustomEvent<T>(event: Event): event is CustomEvent<T> {
      return event instanceof CustomEvent
   }
}

export const customEventManager = new CustomEventManager()
