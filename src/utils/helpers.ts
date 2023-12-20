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