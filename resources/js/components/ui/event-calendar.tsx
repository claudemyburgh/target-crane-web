'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Locale,
    addDays,
    addMonths,
    addWeeks,
    format,
    getDay,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    subMonths,
    subWeeks,
} from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
} from 'lucide-react';
import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';

type View = 'week' | 'month';

type ContextType = {
    view: View;
    setView: (view: View) => void;
    date: Date;
    setDate: (date: Date) => void;
    events: CalendarEvent[];
    locale: Locale;
    onEventClick?: (event: CalendarEvent) => void;
    onAddEvent?: (date: Date) => void;
    enableAddButton?: boolean;
    today: Date;
};

const Context = createContext<ContextType>({} as ContextType);

export type CalendarEvent = {
    id: string;
    start: Date;
    end: Date;
    title: string;
    variant?: 'default' | 'blue' | 'green' | 'orange' | 'purple';
};

type CalendarProps = {
    children: ReactNode;
    defaultDate?: Date;
    events?: CalendarEvent[];
    view?: View;
    locale?: Locale;
    onEventClick?: (event: CalendarEvent) => void;
    onAddEvent?: (date: Date) => void;
    enableAddButton?: boolean;
};

const EventCalendar = ({
    children,
    defaultDate = new Date(),
    locale = enUS,
    view: defaultView = 'month',
    onEventClick,
    onAddEvent,
    enableAddButton,
    events: defaultEvents = [],
}: CalendarProps) => {
    const [view, setView] = useState<View>(defaultView);
    const [date, setDate] = useState(defaultDate);
    const [events] = useState<CalendarEvent[]>(defaultEvents);

    return (
        <Context.Provider
            value={{
                view,
                setView,
                date,
                setDate,
                events,
                locale,
                onEventClick,
                onAddEvent,
                enableAddButton,
                today: new Date(),
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useEventCalendar = () => useContext(Context);

const getEventColor = (variant?: string) => {
    switch (variant) {
        case 'blue':
            return 'bg-blue-500 text-white border-blue-600';
        case 'green':
            return 'bg-green-500 text-white border-green-600';
        case 'orange':
            return 'bg-orange-500 text-white border-orange-600';
        case 'purple':
            return 'bg-purple-500 text-white border-purple-600';
        default:
            return 'bg-primary text-primary-foreground border-primary';
    }
};

const EventCalendarHeader = () => {
    const { date, setDate, view, setView, locale } = useEventCalendar();

    const handlePrev = useCallback(() => {
        if (view === 'week') {
            setDate(subWeeks(date, 1));
        } else {
            setDate(subMonths(date, 1));
        }
    }, [date, setDate, view]);

    const handleNext = useCallback(() => {
        if (view === 'week') {
            setDate(addWeeks(date, 1));
        } else {
            setDate(addMonths(date, 1));
        }
    }, [date, setDate, view]);

    const handleToday = useCallback(() => {
        setDate(new Date());
    }, [setDate]);

    const dateLabel = useMemo(() => {
        if (view === 'week') {
            const start = startOfWeek(date, { weekStartsOn: 0 });
            const end = addDays(start, 6);
            return `${format(start, 'MMM d', { locale })} - ${format(end, 'MMM d, yyyy', { locale })}`;
        }
        return format(date, 'MMMM yyyy', { locale });
    }, [date, view, locale]);

    return (
        <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrev}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleToday}>
                    Today
                </Button>
                <Button variant="outline" size="sm" onClick={handleNext}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <h2 className="text-sm font-semibold ml-2 sm:text-lg">{dateLabel}</h2>
            </div>
            <div className="flex items-center gap-1">
                <Button
                    variant={view === 'week' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setView('week')}
                >
                    Week
                </Button>
                <Button
                    variant={view === 'month' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setView('month')}
                >
                    Month
                </Button>
            </div>
        </div>
    );
};

const EventCalendarWeekView = () => {
    const { date, events, locale, onEventClick, onAddEvent, enableAddButton } = useEventCalendar();

    const weekDays = useMemo(() => {
        const start = startOfWeek(date, { weekStartsOn: 0 });
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }, [date]);

    return (
        <div className="border rounded-lg overflow-hidden">
            {/* Desktop: 7-column grid */}
            <div className="hidden sm:grid grid-cols-7 border-b bg-muted/50">
                {weekDays.map((day) => (
                    <div
                        key={day.toString()}
                        className={cn(
                            'p-3 text-center border-r last:border-r-0',
                            isToday(day) && 'bg-primary/10'
                        )}
                    >
                        <div className="text-xs text-muted-foreground uppercase">
                            {format(day, 'EEE', { locale })}
                        </div>
                        <div className="flex items-center justify-center gap-1 mt-1">
                            <div
                                className={cn(
                                    'text-xl font-semibold',
                                    isToday(day) && 'bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center'
                                )}
                            >
                                {format(day, 'd')}
                            </div>
                            {enableAddButton && onAddEvent && (
                                <button
                                    onClick={() => onAddEvent(day)}
                                    className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-0.5 rounded hover:bg-primary/20 text-primary transition-opacity"
                                    title="Add event"
                                >
                                    <Plus className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="hidden sm:grid grid-cols-7 min-h-[200px]">
                {weekDays.map((day) => {
                    const dayEvents = events.filter((event) =>
                        isSameDay(event.start, day)
                    );

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                'group border-r last:border-r-0 p-2 space-y-1',
                                !isToday(day) && 'bg-muted/20'
                            )}
                        >
                            {enableAddButton && onAddEvent && dayEvents.length === 0 && (
                                <button
                                    onClick={() => onAddEvent(day)}
                                    className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-0.5 rounded hover:bg-primary/20 text-primary transition-opacity mb-1 w-full flex justify-center"
                                    title="Add event"
                                >
                                    <Plus className="h-3 w-3" />
                                </button>
                            )}
                            {dayEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className={cn(
                                        'px-2 py-1.5 rounded text-sm cursor-pointer hover:opacity-80 transition-opacity truncate font-medium',
                                        getEventColor(event.variant)
                                    )}
                                    onClick={() => onEventClick?.(event)}
                                    title={event.title}
                                >
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {/* Mobile: stacked list */}
            <div className="sm:hidden divide-y">
                {weekDays.map((day) => {
                    const dayEvents = events.filter((event) =>
                        isSameDay(event.start, day)
                    );

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                'group p-3 space-y-1.5',
                                isToday(day) && 'bg-primary/5'
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            'text-sm font-semibold',
                                            isToday(day)
                                                ? 'bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center'
                                                : 'text-foreground'
                                        )}
                                    >
                                        {format(day, 'd')}
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {format(day, 'EEEE', { locale })}
                                    </span>
                                </div>
                                {enableAddButton && onAddEvent && (
                                    <button
                                        onClick={() => onAddEvent(day)}
                                        className="p-1 rounded hover:bg-primary/20 text-primary transition-colors"
                                        title="Add event"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            {dayEvents.map((event) => (
                                <div
                                    key={event.id}
                                    className={cn(
                                        'px-2 py-1.5 rounded text-sm cursor-pointer hover:opacity-80 transition-opacity font-medium',
                                        getEventColor(event.variant)
                                    )}
                                    onClick={() => onEventClick?.(event)}
                                    title={event.title}
                                >
                                    {event.title}
                                </div>
                            ))}
                            {dayEvents.length === 0 && (
                                <p className="text-xs text-muted-foreground italic">No events</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const EventCalendarMonthView = () => {
    const { date, events, locale, onEventClick, onAddEvent, enableAddButton } = useEventCalendar();

    const monthDays = useMemo(() => {
        const startOfMonthDate = startOfMonth(date);
        const startOfWeekForMonth = startOfWeek(startOfMonthDate, { weekStartsOn: 0 });

        let currentDate = new Date(startOfWeekForMonth);
        const days = [];

        while (days.length < 42) {
            days.push(new Date(currentDate));
            currentDate = addDays(currentDate, 1);
        }

        return days;
    }, [date]);

    const weekDays = useMemo(() => {
        const start = startOfWeek(new Date(), { weekStartsOn: 0 });
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    }, []);

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 bg-muted/50 border-b">
                {weekDays.map((day) => (
                    <div
                        key={day.toString()}
                        className="p-1.5 text-center text-xs font-medium text-muted-foreground sm:p-3 sm:text-sm"
                    >
                        <span className="sm:hidden">{format(day, 'EEEEE', { locale })}</span>
                        <span className="hidden sm:inline">{format(day, 'EEE', { locale })}</span>
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7">
                {monthDays.map((day) => {
                    const dayEvents = events.filter((event) =>
                        isSameDay(event.start, day)
                    );

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                'group min-h-[60px] border-b border-r p-1 sm:min-h-[120px] sm:p-2',
                                !isSameMonth(date, day) && 'bg-muted/30',
                                getDay(day) === 0 && 'border-l-0',
                                getDay(day) === 6 && 'border-r-0'
                            )}
                        >
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                                <div
                                    className={cn(
                                        'text-xs font-medium sm:text-sm',
                                        isToday(day)
                                            ? 'bg-primary text-primary-foreground rounded-full w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center text-[10px] sm:text-sm'
                                            : 'text-muted-foreground'
                                    )}
                                >
                                    {format(day, 'd')}
                                </div>
                                {enableAddButton && onAddEvent && dayEvents.length === 0 && (
                                    <button
                                        onClick={() => onAddEvent(day)}
                                        className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-0.5 rounded hover:bg-primary/20 text-primary transition-opacity"
                                        title="Add event"
                                    >
                                        <Plus className="h-3 w-3" />
                                    </button>
                                )}
                            </div>
                            <div className="space-y-0.5 sm:space-y-1">
                                {dayEvents.slice(0, 3).map((event) => (
                                    <div
                                        key={event.id}
                                        className={cn(
                                            'px-1 py-0.5 rounded text-[10px] leading-tight cursor-pointer hover:opacity-80 transition-opacity truncate font-medium sm:px-2 sm:py-1 sm:text-xs',
                                            getEventColor(event.variant)
                                        )}
                                        onClick={() => onEventClick?.(event)}
                                        title={event.title}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className="text-[10px] text-muted-foreground px-1 font-medium sm:text-xs">
                                        +{dayEvents.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const EventCalendarView = () => {
    const { view } = useEventCalendar();

    if (view === 'week') {
        return <EventCalendarWeekView />;
    }

    return <EventCalendarMonthView />;
};

export {
    EventCalendar,
    EventCalendarHeader,
    EventCalendarView,
};
