export const formatTimeTo12Hour = (timeString: any) => {
    if (!timeString) return '';

    // Split time into hours and minutes (e.g., "16:48" → ["16", "48"])
    const [hours, minutes] = timeString.split(':');

    // Convert to number
    const hourNum = parseInt(hours, 10);

    // Determine AM/PM
    const period = hourNum >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format (e.g., 16 → 4 PM)
    const hour12 = hourNum % 12 || 12; // Handle midnight (0 → 12 AM)

    // Return formatted string (e.g., "4:48 PM")
    return `${hour12}:${minutes} ${period}`;
};


export const formatEventDate = (dateString: string | Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    // Handle case where dateString might be undefined/null
    if (!dateString) return 'Date not specified';
    
    try {
        const date = new Date(dateString);
        
        // Check if the date is valid
        if (Number.isNaN(date.getTime())) return 'Invalid date';
        
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return 'Invalid date';
    }
};

export function formatTimeToAMPM(dateString: string): string {
    const date = new Date(dateString);

    // Check if the date is valid using Number.isNaN
    if (Number.isNaN(date.getTime())) {
        return 'Invalid Time';
    }

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format using operator assignment
    hours %= 12;
    // Use logical OR for default assignment
    hours = hours || 12; // the hour '0' should be '12'

    // Add leading zero to minutes if needed
    const minutesStr = minutes.toString().padStart(2, '0');

    return `${hours}:${minutesStr} ${ampm}`;
}

export const formatDateTimeCustom = (dateTimeString:any, formatType = 'standard') => {
  try {
    const date = new Date(dateTimeString);
    
    const year = date.getFullYear();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12;
    
    // Pad minutes with leading zero if needed
    const minutesPadded = minutes.toString().padStart(2, '0');
    
    switch (formatType) {
      case 'short':
        return `${month.substring(0, 3)} ${day}, ${year} ${hours12}:${minutesPadded} ${ampm}`;
      case 'date-only':
        return `${month} ${day}, ${year}`;
      case 'time-only':
        return `${hours12}:${minutesPadded} ${ampm}`;
      case 'numeric':
        return `${date.getMonth() + 1}/${day}/${year} ${hours12}:${minutesPadded} ${ampm}`;
      default: // standard
        return `${month} ${day}, ${year} at ${hours12}:${minutesPadded} ${ampm}`;
    }
  } catch (error) {
    return 'Invalid date';
  }
};