import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getApiUrl } from '../config/api';
import '../styles/availability-calendar.css';

interface AvailabilityCalendarProps {
  propertyId: string;
  onDateSelect?: (checkIn: string, checkOut: string) => void;
  selectedCheckIn?: string;
  selectedCheckOut?: string;
  isHostView?: boolean;
  onBlockDates?: (dates: string[]) => void;
}

interface DayInfo {
  date: Date;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isBlocked: boolean;
  isBooked: boolean;
  isSelected: boolean;
  isInRange: boolean;
}

export default function AvailabilityCalendar({
  propertyId,
  onDateSelect,
  selectedCheckIn,
  selectedCheckOut,
  isHostView = false,
  onBlockDates
}: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingDates, setSelectingDates] = useState<string[]>([]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchAvailability();
  }, [currentDate, propertyId]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);

      const response = await fetch(
        getApiUrl(`/availability/property/${propertyId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
      );
      
      if (response.ok) {
        const data = await response.json();
        setBlockedDates(data.blockedDates || []);
        setBookedDates(data.bookedDates || []);
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (): DayInfo[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: DayInfo[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      const date = new Date(year, month, -firstDay.getDay() + i + 1);
      days.push(createDayInfo(date, false, today));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push(createDayInfo(date, true, today));
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push(createDayInfo(date, false, today));
    }

    return days;
  };

  const createDayInfo = (date: Date, isCurrentMonth: boolean, today: Date): DayInfo => {
    const dateStr = date.toISOString().split('T')[0];
    const isPast = date < today;
    const isBlocked = blockedDates.includes(dateStr);
    const isBooked = bookedDates.includes(dateStr);
    
    const isSelected = dateStr === selectedCheckIn || dateStr === selectedCheckOut;
    let isInRange = false;
    
    if (selectedCheckIn && selectedCheckOut) {
      const checkIn = new Date(selectedCheckIn);
      const checkOut = new Date(selectedCheckOut);
      isInRange = date > checkIn && date < checkOut;
    }

    return {
      date,
      dateStr,
      isCurrentMonth,
      isToday: date.getTime() === today.getTime(),
      isPast,
      isBlocked,
      isBooked,
      isSelected,
      isInRange
    };
  };

  const handleDateClick = (day: DayInfo) => {
    if (day.isPast || day.isBlocked || day.isBooked) return;

    if (isHostView) {
      if (selectingDates.includes(day.dateStr)) {
        setSelectingDates(selectingDates.filter(d => d !== day.dateStr));
      } else {
        setSelectingDates([...selectingDates, day.dateStr]);
      }
    } else if (onDateSelect) {
      if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
        onDateSelect(day.dateStr, '');
      } else {
        if (new Date(day.dateStr) > new Date(selectedCheckIn)) {
          onDateSelect(selectedCheckIn, day.dateStr);
        } else {
          onDateSelect(day.dateStr, selectedCheckIn);
        }
      }
    }
  };

  const handleBlockSelected = () => {
    if (onBlockDates && selectingDates.length > 0) {
      onBlockDates(selectingDates);
      setSelectingDates([]);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDayClassName = (day: DayInfo) => {
    const classes = ['calendar-day'];
    
    if (!day.isCurrentMonth) classes.push('other-month');
    if (day.isToday) classes.push('today');
    if (day.isPast) classes.push('past');
    if (day.isBlocked) classes.push('blocked');
    if (day.isBooked) classes.push('booked');
    if (day.isSelected) classes.push('selected');
    if (day.isInRange) classes.push('in-range');
    if (selectingDates.includes(day.dateStr)) classes.push('selecting');
    if (!day.isPast && !day.isBlocked && !day.isBooked && day.isCurrentMonth) {
      classes.push('available');
    }

    return classes.join(' ');
  };

  const days = getDaysInMonth();

  return (
    <div className="availability-calendar">
      <div className="calendar-header">
        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <div className="calendar-nav">
          <button onClick={goToPreviousMonth}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={goToNextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading availability...</div>
      ) : (
        <>
          <div className="calendar-grid">
            {dayNames.map(day => (
              <div key={day} className="day-header">{day}</div>
            ))}
            {days.map((day, index) => (
              <div
                key={index}
                className={getDayClassName(day)}
                onClick={() => handleDateClick(day)}
              >
                {day.date.getDate()}
              </div>
            ))}
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-dot available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot blocked"></div>
              <span>Blocked</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot booked"></div>
              <span>Booked</span>
            </div>
          </div>

          {isHostView && (
            <div className="host-actions">
              <button 
                className="btn-block" 
                onClick={handleBlockSelected}
                disabled={selectingDates.length === 0}
              >
                Block Selected ({selectingDates.length})
              </button>
              <button 
                className="btn-clear"
                onClick={() => setSelectingDates([])}
              >
                Clear Selection
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
