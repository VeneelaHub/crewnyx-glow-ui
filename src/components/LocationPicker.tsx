import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ALL_LOCATIONS } from "@/data/locations";
import { cn } from "@/lib/utils";

interface LocationPickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const LocationPicker = ({ value, onChange, placeholder = "Select city, country" }: LocationPickerProps) => {
  const [open, setOpen] = useState(false);

  // Group cities by country for nicer browsing.
  const grouped = useMemo(() => {
    const map = new Map<string, { value: string; city: string }[]>();
    for (const loc of ALL_LOCATIONS) {
      const arr = map.get(loc.country) ?? [];
      arr.push({ value: loc.value, city: loc.city });
      map.set(loc.country, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-xl h-11 font-normal btn-press"
        >
          <span className="flex items-center gap-2 truncate">
            <MapPin size={16} className="text-primary shrink-0" />
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value || placeholder}
            </span>
          </span>
          <ChevronsUpDown size={16} className="opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search city or country..." />
          <CommandList className="max-h-72">
            <CommandEmpty>No location found.</CommandEmpty>
            {grouped.map(([country, cities]) => (
              <CommandGroup key={country} heading={country}>
                {cities.map((c) => (
                  <CommandItem
                    key={c.value}
                    value={c.value}
                    onSelect={() => {
                      onChange(c.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      size={14}
                      className={cn("mr-2", value === c.value ? "opacity-100" : "opacity-0")}
                    />
                    {c.city}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LocationPicker;
