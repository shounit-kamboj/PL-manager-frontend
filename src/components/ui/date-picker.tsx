import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { parseDay, toYmd } from "@/lib/dates";

type DatePickerProps = {
    value?: string;                       // "yyyy-mm-dd"
    onChange: (value: string) => void;    // emits "yyyy-mm-dd"
    placeholder?: string;
    disabled?: (date: Date) => boolean;
    // Adds month/year dropdowns, for dates far from today (date of birth).
    yearRange?: { from: number; to: number };
};

export function DatePicker({ value, onChange, placeholder = "Pick a date", disabled, yearRange }: DatePickerProps) {
    const date = parseDay(value) ?? undefined;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    data-empty={!date}
                    className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMM d, yyyy") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    defaultMonth={date}
                    onSelect={(d) => d && onChange(toYmd(d))}
                    disabled={disabled}
                    captionLayout={yearRange ? "dropdown" : "buttons"}
                    fromYear={yearRange?.from}
                    toYear={yearRange?.to}
                />
            </PopoverContent>
        </Popover>
    );
}