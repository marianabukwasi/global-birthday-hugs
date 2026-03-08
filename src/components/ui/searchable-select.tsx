import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface SearchableSelectProps {
  options: string[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(
    () =>
      search
        ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
        : options,
    [options, search]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-muted/50 border-border font-normal h-10",
            !value && "text-muted-foreground",
            className
          )}
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="flex items-center border-b border-border px-3 py-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">No results found.</p>
          ) : (
            filtered.map((option) => (
              <button
                key={option}
                className={cn(
                  "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                  value === option && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  onValueChange(option);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {value === option && <Check className="h-4 w-4" />}
                </span>
                {option}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
