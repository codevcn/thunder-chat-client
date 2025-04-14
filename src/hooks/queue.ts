import { useRef } from "react"

type TQueueItem = {
   id: number // ID của phần tử trong queue
}

type TQueueItems<T> = {
   [key: number]: T
}

class ObjectQueue<T extends TQueueItem> {
   private items: TQueueItems<T>
   private head: number
   private tail: number

   constructor() {
      this.items = {}
      this.head = 0 // Chỉ số đầu queue
      this.tail = 0 // Chỉ số cuối queue
   }

   // Kiểm tra xem phần tử có trùng id với bất kỳ phần tử nào trong items không
   isDuplicate(itemId: T["id"]): boolean {
      for (let i = this.head; i < this.tail; i++) {
         const item = this.items[i]
         if (item && item.id === itemId) {
            return true // Tìm thấy trùng lặp
         }
      }
      return false // Không có trùng lặp
   }

   // Thêm phần tử vào cuối queue
   enqueue(item: T): void {
      this.items[this.tail] = item
      this.tail++
   }

   // Lấy và xóa phần tử đầu tiên
   dequeue(): T | null {
      if (this.isEmpty()) return null
      const item = this.items[this.head]
      delete this.items[this.head] // Xóa phần tử
      this.head++
      return item
   }

   // Kiểm tra queue rỗng
   isEmpty(): boolean {
      return this.head === this.tail
   }

   // Lấy phần tử đầu tiên mà không xóa
   peek(): T | null {
      if (this.isEmpty()) return null
      return this.items[this.head]
   }

   // Kích thước queue
   size(): number {
      return this.tail - this.head
   }
}

export const useQueue = <T extends TQueueItem>() => {
   const queue = useRef(new ObjectQueue<T>()).current

   return {
      enqueue: (item: T) => {
         queue.enqueue(item)
      },
      dequeue: () => queue.dequeue(),
      peek: () => queue.peek(),
      isEmpty: () => queue.isEmpty(),
      size: () => queue.size(),
      isDuplicate: (itemId: T["id"]) => queue.isDuplicate(itemId),
   }
}
