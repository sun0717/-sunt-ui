import React, { useContext } from 'react';

import cs from 'classnames';

import { CalendarProps } from '.';
import allLocales from './locale';
import LocaleContext from './LocaleContext';

import type { Dayjs } from 'dayjs';
import './index.less';

interface MonthCalendarProps extends CalendarProps {
  selectHandler?: (date: Dayjs) => void;
  curMonth: Dayjs;
}

function getAllDays(date: Dayjs) {
  const startDate = date.startOf('month');
  const day = startDate.day();

  const daysInfo: Array<{ date: Dayjs; currentMonth: boolean }> = new Array(
    6 * 7,
  );

  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, 'day'),
      currentMonth: false,
    };
  }

  for (let i = day; i < daysInfo.length; i++) {
    const calcDate = startDate.add(i - day, 'day');

    daysInfo[i] = {
      date: calcDate,
      currentMonth: calcDate.month() === date.month(),
    };
  }

  return daysInfo;
}

function MonthCalendar(props: MonthCalendarProps) {
  const localeContext = useContext(LocaleContext);

  const { value, curMonth, dateRender, dateInnerContent, selectHandler } =
    props;

  const CalendarLocale = allLocales[localeContext.locale];

  const weekList = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];

  const allDays = getAllDays(curMonth);

  function renderDays(
    days: Array<{ date: Dayjs; currentMonth: boolean }>,
    // 如果传了 dateRender 就覆盖日期单元格，否则只在下面渲染 dateInnerContent 的内容
    // dateRender: MonthCalendarProps['dateRender'],
    // dateInnerContent: MonthCalendarProps['dateInnerContent'],
    // value: Dayjs,
    // selectHandler: MonthCalendarProps['selectHandler']
  ) {
    const rows = [];
    let index = 0;
    for (let i = 0; i < 6; i++) {
      const row = [];
      for (let j = 0; j < 7; j++) {
        const item = days[i * 7 + j];

        row[j] = (
          <div
            key={`${i}-${j}`}
            className={
              'calendar-month-body-cell ' +
              (item.currentMonth ? 'calendar-month-body-cell-current' : '')
            }
            onClick={() => selectHandler?.(item.date)}
          >
            {dateRender ? (
              dateRender(item.date)
            ) : (
              <div className="calendar-month-body-cell-inner">
                <div
                  className={cs(
                    'calendar-month-body-cell-date-value',
                    value.format('YYYY-MM-DD') ===
                      item.date.format('YYYY-MM-DD')
                      ? 'calendar-month-body-cell-date-selected'
                      : '',
                  )}
                >
                  {item.date.date()}
                </div>
                <div className="calendar-month-cell-body-date-content">
                  {dateInnerContent?.(item.date)}
                </div>
              </div>
            )}
          </div>
        );
      }
      rows.push(row);
      console.log(row);
    }
    return rows.map((row) => (
      <div key={index++} className="calendar-month-body-row">
        {row}
      </div>
    ));
  }

  return (
    <div className="calendar-month">
      <div className="calendar-month-week-list">
        {weekList.map((week) => (
          <div className="calendar-month-week-list-item" key={week}>
            {CalendarLocale.week[week]}
          </div>
        ))}
      </div>
      <div className="calendar-month-body">{renderDays(allDays)}</div>
    </div>
  );
}

export default MonthCalendar;
