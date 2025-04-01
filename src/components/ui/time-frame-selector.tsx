
import { useState } from 'react';
import { format } from 'date-fns';
import { Timeframe, TimeframeType } from '@/types';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TimeframeSelectorProps {
  timeframes: Record<TimeframeType, Timeframe>;
  selectedTimeframe: Timeframe;
  onTimeframeChange: (type: TimeframeType) => void;
  onCustomDateChange: (start: Date, end: Date) => void;
}

export function TimeframeSelector({
  timeframes,
  selectedTimeframe,
  onTimeframeChange,
  onCustomDateChange,
}: TimeframeSelectorProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: selectedTimeframe.type === 'custom' ? selectedTimeframe.dateRange.start : undefined,
    to: selectedTimeframe.type === 'custom' ? selectedTimeframe.dateRange.end : undefined,
  });

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!dateRange.from) {
      setDateRange({ from: date, to: undefined });
    } else if (!dateRange.to && date > dateRange.from) {
      const newRange = { from: dateRange.from, to: date };
      setDateRange(newRange);
      
      if (newRange.from && newRange.to) {
        onCustomDateChange(newRange.from, newRange.to);
      }
    } else {
      setDateRange({ from: date, to: undefined });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        <Button
          variant={selectedTimeframe.type === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTimeframeChange('day')}
          className="w-full"
        >
          Day
        </Button>
        <Button
          variant={selectedTimeframe.type === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTimeframeChange('week')}
          className="w-full"
        >
          Week
        </Button>
        <Button
          variant={selectedTimeframe.type === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTimeframeChange('month')}
          className="w-full"
        >
          Month
        </Button>
        <Button
          variant={selectedTimeframe.type === 'year' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTimeframeChange('year')}
          className="w-full"
        >
          Year
        </Button>
      </div>

      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={selectedTimeframe.type === 'custom' ? 'default' : 'outline'}
              size="sm"
              className="w-full justify-start"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedTimeframe.type === 'custom' ? (
                `${format(selectedTimeframe.dateRange.start, 'MMM d, yyyy')} - ${format(
                  selectedTimeframe.dateRange.end,
                  'MMM d, yyyy'
                )}`
              ) : (
                'Custom Range'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="range"
              selected={{
                from: dateRange.from,
                to: dateRange.to,
              }}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  setDateRange({ from: range.from, to: range.to });
                  onCustomDateChange(range.from, range.to);
                } else {
                  setDateRange({ from: range?.from, to: range?.to });
                }
              }}
              numberOfMonths={2}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
