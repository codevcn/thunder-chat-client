import dayjs from "dayjs"
import { ETimeFormats, ETimeGapOfStickyTimes } from "./enums"

enum Month {
   JAN = 1,
   FEB,
   MAR,
   APR,
   MAY,
   JUN,
   JUL,
   AUG,
   SEP,
   OCT,
   NOV,
   DEC,
}

export const get_days_in_month = (month: Month, year: number = -1): number[] => {
   const month_with_31_days = [1, 3, 5, 7, 8, 10, 12]

   const days =
      month === 2 ? (is_leap_year(year) ? 29 : 28) : month_with_31_days.includes(month) ? 31 : 30

   return Array.from(Array(days).keys()).map((num) => num + 1)
}

export const is_leap_year = (year: number): boolean => {
   if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) return true

   return false
}

export const get_years_list = (
   gap: number,
   end_year: number = new Date().getFullYear()
): number[] => {
   const years_set: number[] = []

   for (let i = end_year - gap; i < end_year; i++) {
      years_set.push(i)
   }

   return years_set
}

export const format_date_mysql = (year: number, month: number, day: number): string => {
   return dayjs(new Date(year, month - 1, day)).format("YYYY-MM-DD")
}

export const handleMessageStickyTime = (
   current_msg_time: Date | string,
   pre_msg_time?: Date | string
): string | null => {
   if (pre_msg_time) {
      const pre_time_data = dayjs(pre_msg_time)
      const current_time_data = dayjs(current_msg_time)
      const today_time_data = dayjs()
      if (current_time_data.diff(pre_time_data, "day") === 0) {
         if (current_time_data.diff(pre_time_data, "hour") > ETimeGapOfStickyTimes.IN_HOURS) {
            return current_time_data.format(ETimeFormats.HH_mm)
         }
      } else {
         if (current_time_data.diff(today_time_data, "day") === 0) {
            return "Today"
         }
         return current_time_data.format(ETimeFormats.MMMM_DD_YYYY)
      }
      return null
   }
   const current_time_data = dayjs(current_msg_time)
   const today_time_data = dayjs()
   if (current_time_data.diff(today_time_data, "day") === 0) {
      return "Today"
   }
   return current_time_data.format(ETimeFormats.MMMM_DD_YYYY)
}

export const handleTimeDifference = (originalTime: Date | string) => {
   const now = dayjs()
   const convertedTime = dayjs(originalTime)
   const diffInMinutes = now.diff(convertedTime, "minute")

   if (diffInMinutes < 1) {
      return "Just now"
   }
   if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
   }
   const diffInHours = now.diff(convertedTime, "hour")
   if (diffInHours < 24) {
      return `${diffInHours} hours ago`
   }
   const diffInDays = now.diff(convertedTime, "day")
   if (diffInDays < 31) {
      return `${diffInDays} days ago`
   }
   return convertedTime.format(ETimeFormats.MMMM_DD_YYYY)
}
