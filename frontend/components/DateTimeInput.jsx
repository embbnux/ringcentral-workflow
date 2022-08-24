import React from 'react';
import { styled } from '@ringcentral/juno/foundation';

import { RcDatePicker, RcTimePicker } from '@ringcentral/juno';

const DateTimeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledDatePicker = styled(RcDatePicker)`
  margin-right: 5px;
  width: 110px;
`;

const StyleTimePicker = styled(RcTimePicker)`
  width: 70px;
`;

function updateFullYear(preTime, currTime) {
  const y = currTime.getFullYear();
  const m = currTime.getMonth();
  const d = currTime.getDate();
  return new Date(preTime.setFullYear(y, m, d));
}

function updateFullTime(preTime, currTime) {
  const newTime = new Date(currTime);
  preTime.setHours(newTime.getHours());
  preTime.setMinutes(newTime.getMinutes());
  preTime.setSeconds(newTime.getSeconds());
  return new Date(preTime);
}

const minutes = Array.from(Array(60).keys());

export function DateTimeInput({
  dateTime,
  onDateTimeChange,
}) {
  let currentDate = new Date();
  
  return (
    <DateTimeWrapper>
      <StyledDatePicker
        label={null}
        value={dateTime}
        clearBtn={false}
        onChange={(newTime) => {
          onDateTimeChange(updateFullYear(dateTime || currentDate, newTime));
        }}
        required
      />
      <StyleTimePicker
        clearBtn={false}
        dateMode
        value={dateTime}
        onChange={(newTime) => {
          onDateTimeChange(updateFullTime(dateTime || currentDate, newTime));
        }}
        required
        MinutePickerProps={{
          step: 1,
          source: minutes,
          min: 0,
          max: 59,
          getScreenReaderLabel: (minute) =>
            `Minute: ${minute}, use up and down arrow keys to change minutes time by 1 minutes`,
        }}
      />
    </DateTimeWrapper>
  );
}