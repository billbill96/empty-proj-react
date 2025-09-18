import React, { useState, useMemo } from 'react'

export default function Datepicker({ value = null, onChange }) {
  const initial = value ? new Date(value) : null
  const [selectedDate, setSelectedDate] = useState(initial)
  const [showCalendar, setShowCalendar] = useState(false)
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString()
    : ''

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()

  const calendarDays = useMemo(() => {
    const days = []

    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()

    // previous month days
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const prevMonthDays = daysInMonth(prevYear, prevMonth)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(prevYear, prevMonth, prevMonthDays - i),
        otherMonth: true,
      })
    }

    // current month days
    const thisMonthDays = daysInMonth(currentYear, currentMonth)
    for (let i = 1; i <= thisMonthDays; i++) {
      days.push({ date: new Date(currentYear, currentMonth, i), otherMonth: false })
    }

    // next month days to fill 42 cells (6 weeks)
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear
    const nextDays = 42 - days.length
    for (let i = 1; i <= nextDays; i++) {
      days.push({ date: new Date(nextYear, nextMonth, i), otherMonth: true })
    }

    return days
  }, [currentMonth, currentYear])

  const currentMonthName = useMemo(
    () => new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' }),
    [currentMonth, currentYear]
  )

  const toggleCalendar = () => setShowCalendar((s) => !s)
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else setCurrentMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else setCurrentMonth((m) => m + 1)
  }

  const selectDate = (day) => {
    if (day.otherMonth) return
    setSelectedDate(day.date)
    setShowCalendar(false)
    if (onChange) onChange(day.date)
  }

  const isSelected = (day) =>
    selectedDate && day.date.toDateString() === selectedDate.toDateString()

  return (
    <div className="relative inline-block">
      <input
        type="text"
        readOnly
        value={formattedDate}
        onClick={toggleCalendar}
        placeholder="Select date"
        className="w-40 p-2 border border-gray-300 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showCalendar && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-50 p-4">
          <div className="flex justify-between items-center mb-2">
            <button onClick={prevMonth} className="p-1 hover:bg-gray-200 rounded">&lt;</button>
            <span className="font-medium">{currentMonthName} {currentYear}</span>
            <button onClick={nextMonth} className="p-1 hover:bg-gray-200 rounded">&gt;</button>
          </div>

          <div className="grid grid-cols-7 text-center mb-1">
            {weekdays.map((d) => (
              <span key={d} className="font-semibold text-gray-700">{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 text-center gap-1">
            {calendarDays.map((dayObj) => (
              <button
                key={dayObj.date.toISOString()}
                onClick={() => selectDate(dayObj)}
                className={`p-2 cursor-pointer rounded-full ${dayObj.otherMonth ? 'text-gray-400' : ''} ${isSelected(dayObj) ? 'bg-blue-500 text-white' : ''} ${!dayObj.otherMonth ? 'hover:bg-blue-100' : ''}`}
                type="button"
              >
                {dayObj.date.getDate()}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
