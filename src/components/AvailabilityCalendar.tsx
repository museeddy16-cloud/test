import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getApiUrl } from '../config/api';

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
      <style>{`
        .availability-calendar {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .calendar-header h3 {
          margin: 0;
          font-size: 18px;
        }
        .calendar-nav {
          display: flex;
          gap: 8px;
        }
        .calendar-nav button {
          background: #f7f7f7;
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .calendar-nav button:hover {
          background: #e0e0e0;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .day-header {
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          color: #717171;
          padding: 8px 0;
        }
        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .calendar-day.other-month {
          color: #ccc;
        }
        .calendar-day.today {
          font-weight: bold;
          border: 2px solid #222;
        }
        .calendar-day.past {
          color: #ccc;
          cursor: not-allowed;
        }
        .calendar-day.blocked {
          background: #f0f0f0;
          color: #999;
          text-decoration: line-through;
          cursor: not-allowed;
        }
        .calendar-day.booked {
          background: #ffe0e0;
          color: #c00;
          cursor: not-allowed;
        }
        .calendar-day.available:hover {
          background: #f0f0f0;
        }
        .calendar-day.selected {
          background: #222;
          color: white;
        }
        .calendar-day.in-range {
          background: #f0f0f0;
        }
        .calendar-day.selecting {
          background: #fff3e0;
          border: 2px solid #ff9800;
        }
        .calendar-legend {
          display: flex;
          gap: 16px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #eee;
          flex-wrap: wrap;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #717171;
        }
        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .legend-dot.available { background: #e0ffe0; border: 1px solid #4caf50; }
        .legend-dot.blocked { background: #f0f0f0; }
        .legend-dot.booked { background: #ffe0e0; }
        .host-actions {
          margin-top: 16px;
          display: flex;
          gap: 12px;
        }
        .host-actions button {
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-block {
          background: #ff5a5f;
          color: white;
          border: none;
        }
        .btn-block:hover { background: #e04a4f; }
        .btn-clear {
          background: white;
          border: 1px solid #ddd;
        }
        .btn-clear:hover { background: #f7f7f7; }
        .loading {
          text-align: center;
          padding: 40px;
          color: #717171;
        }
      `}</style>

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
