import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button-variants";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const CHEVRONS = {
  left: ChevronLeft,
  right: ChevronRight,
  up: ChevronUp,
  down: ChevronDown,
};

const NAV_BUTTON = cn(
  buttonVariants({ variant: "outline" }),
  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
);

// Class names and components follow react-day-picker v9 and later. Two things
// differ from v8: the nav is a sibling of the month (so it is laid over the
// caption), and the state classes (selected, today, outside, disabled) land on
// the day cell, so they style the button inside it.
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
        months: "relative flex flex-col gap-4 sm:flex-row",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "absolute inset-x-1 top-0 z-10 flex items-center justify-between",
        button_previous: NAV_BUTTON,
        button_next: NAV_BUTTON,
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2",
        day: "h-9 w-9 text-center text-sm p-0 relative aria-selected:bg-accent first:aria-selected:rounded-l-md last:aria-selected:rounded-r-md [&.day-range-end]:rounded-r-md [&.day-outside]:aria-selected:bg-accent/50 focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal"
        ),
        range_end: "day-range-end",
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground [&>button]:focus:bg-primary [&>button]:focus:text-primary-foreground",
        today:
          "[&:not([aria-selected])>button]:bg-accent [&:not([aria-selected])>button]:text-accent-foreground",
        outside:
          "day-outside [&>button]:text-muted-foreground [&>button]:opacity-50 [&[aria-selected]>button]:bg-accent/50 [&[aria-selected]>button]:opacity-30",
        disabled: "[&>button]:text-muted-foreground [&>button]:opacity-50",
        range_middle:
          "[&[aria-selected]>button]:bg-accent [&[aria-selected]>button]:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation = "left" }) => {
          const Icon = CHEVRONS[orientation];
          return <Icon className="h-4 w-4" />;
        },
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
