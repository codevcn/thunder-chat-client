import { EEventNames } from "./enums"

class CustomEventManager {
   createEvent<T>(eventName: EEventNames, eventPayload?: T): CustomEvent<T> {
      return new CustomEvent<T>(eventName, { detail: eventPayload })
   }

   isCustomEvent<T>(event: Event): event is CustomEvent<T> {
      return event instanceof CustomEvent
   }
}

export const customEventManager = new CustomEventManager()
