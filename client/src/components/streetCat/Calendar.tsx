import React, { useState } from "react";
import DatePicker, { CalendarContainer } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import "../../styles/scss/components/streetCat/calendar.scss";
import { getMonth, getYear } from "date-fns";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaRegCalendar } from "react-icons/fa6";

interface IProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
}

const YEARS = Array.from({ length: getYear(new Date()) + 1 - 2000 }, (_, i) => getYear(new Date()) - i);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Calendar: React.FC<IProps> = ({ selectedDate, setSelectedDate }: IProps) => {
  return (
    <div className="datePicker">
      <FaRegCalendar className="calendar-icon"/>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        placeholderText="발견 날짜를 입력해 주세요"
        dateFormat="yyyy년 MM월 dd일"
        formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        renderCustomHeader={({
          date,
          changeYear,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="customHeaderContainer">
            <button
              type='button'
              onClick={decreaseMonth}
              className="monthButton"
              disabled={prevMonthButtonDisabled}
            >
              <IoIosArrowBack fill='#ffffff' />
            </button>
            <div>
              <span className="month">{MONTHS[getMonth(date)]}</span>
              <select
                value={getYear(date)}
                className="year"
                onChange={({ target: { value } }) => changeYear(+value)}
              >
                {YEARS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type='button'
                onClick={increaseMonth}
                className="monthButton"
                disabled={nextMonthButtonDisabled}
              >
                <IoIosArrowForward fill='#ffffff' />
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Calendar;