import { EEventNames } from "../enums"
import type { TUnknownFunction } from "../types"

class CustomEventManager {
   createEvent<T>(eventName: EEventNames, eventPayload?: T): CustomEvent<T> {
      return new CustomEvent<T>(eventName, { detail: eventPayload })
   }

   dispatchEvent<T>(eventName: EEventNames, eventPayload?: T): void {
      document.dispatchEvent(this.createEvent(eventName, eventPayload))
   }

   on<P = any>(eventName: EEventNames, callback: (payload: P) => void): void {
      document.addEventListener(eventName, (e) => {
         if (this.isCustomEvent<P>(e)) {
            callback(e.detail)
         }
      })
   }

   off(eventName: EEventNames, callback: () => void = () => {}): void {
      document.removeEventListener(eventName, callback)
   }

   isCustomEvent<T>(event: Event): event is CustomEvent<T> {
      return event instanceof CustomEvent
   }
}

export const customEventManager = new CustomEventManager()
