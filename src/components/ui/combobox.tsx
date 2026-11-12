// A dropdown you can type in to narrow the options (shadcn's Combobox: a Popover with a Command list inside).
// Use it instead of <Select> when the list is too long to scroll through.

import { useState } from "react";
import type { ComponentProps } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ComboboxOption = {
    value: string;
    // the main line, also shown on the button once picked
    label: string;
    // a smaller second line under the label (optional)
    detail?: string;
    // extra words the search should match that aren't in the label (optional)
    keywords?: string[];
};

type ComboboxProps = Omit<ComponentProps<typeof Button>, "value" | "onChange"> & {
    options: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
};

// Every word typed must appear somewhere in the option's label, detail or keywords.
// Returning 1 for every match (instead of a ranking) keeps the options in the order they were given.
const matches = (_value: string, search: string, keywords?: string[]): number => {
    const haystack = (keywords ?? []).join(" ").toLowerCase();
    const words = search.toLowerCase().split(/\s+/).filter(Boolean);
    return words.every((word) => haystack.includes(word)) ? 1 : 0;
};

export function Combobox({
                             options,
                             value,
                             onChange,
                             placeholder = "Select",
                             searchPlaceholder = "Search...",
                             emptyText = "Nothing found.",
                             className,
                             ...buttonProps
                         }: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const selected = options.find((opt) => opt.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {/* buttonProps carries the id and aria attributes that <FormControl> passes down */}
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between font-normal", !selected && "text-muted-foreground", className)}
                    {...buttonProps}
                >
                    <span className="truncate" title={selected ? selected.label : placeholder}>{selected ? selected.label : placeholder}</span>
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            {/* as wide as the button that opened it */}
            <PopoverContent align="start" className="w-(--radix-popover-trigger-width) min-w-64 p-0">
                <Command filter={matches}>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {options.map((opt) => (
                                <CommandItem
                                    key={opt.value}
                                    value={opt.value}
                                    keywords={[opt.label, opt.detail ?? "", ...(opt.keywords ?? [])]}
                                    onSelect={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                    }}
                                >
                                    <div className="flex min-w-0 flex-col">
                                        <span className="truncate" title={opt.label}>{opt.label}</span>
                                        {opt.detail && (
                                            <span className="text-muted-foreground truncate text-xs" title={opt.detail}>{opt.detail}</span>
                                        )}
                                    </div>
                                    <Check className={cn("ml-auto", opt.value === value ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}