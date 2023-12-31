export const generateId = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

export const formatDate = (date: Date) => {
    // Ensure the input is a Date object
    if (!(date instanceof Date)) {
      return "Invalid Date";
    }
  
    // Get individual date components
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
  
    // Assemble the formatted string
    const formattedDate = `${month}/${day}/${year}`;
  
    return formattedDate;
}

export const printDate = () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMonth = String(month).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const formattedHoursStr = String(formattedHours).padStart(2, "0");
    const formattedMinutesStr = String(minutes).padStart(2, "0");
    const formattedDateString = `${formattedMonth}/${formattedDay}/${year} ${formattedHoursStr}:${formattedMinutesStr} ${ampm}`;
    return formattedDateString;
}

export const account = {
    username: 'admin',
    password: '123123123'
}