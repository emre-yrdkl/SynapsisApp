export const TimeDisplay = (time) => {
    const date = new Date(time);
    const hours = date.getUTCHours() + 3;
    const minutes = date.getUTCMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };