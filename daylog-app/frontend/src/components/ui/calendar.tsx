import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center mb-4",
        caption_label: "hidden",
        nav: "flex items-center",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
        ),
        dropdowns: "flex gap-2 items-center",
        dropdown: "text-sm font-medium text-pink-900 bg-white border border-pink-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-400",
        dropdown_month: "text-sm font-medium text-pink-900 bg-white border border-pink-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-400",
        dropdown_year: "text-sm font-medium text-pink-900 bg-white border border-pink-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-400",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-pink-600 rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-1",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_button: "h-9 w-9 p-0 font-normal",
        selected:
          "bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500",
        today: "bg-pink-100 text-pink-900 font-semibold",
        outside: "text-gray-300 opacity-50",
        disabled: "text-gray-200 opacity-30",
        range_middle: "aria-selected:bg-pink-100",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />
          }
          return <ChevronRight className="h-4 w-4" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
