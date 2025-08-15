
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('invoice-date');
    const today = new Date();
    
    // Format as MM/DD/YY
    const formattedDate = 
        String(today.getMonth() + 1).padStart(2, '0') + '/' + 
        String(today.getDate()).padStart(2, '0') + '/' + 
        String(today.getFullYear()).slice(-2);
    
    dateInput.value = formattedDate;

    // Update date daily at midnight
    setInterval(() => {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            dateInput.value = formatDate(now);
        }
    }, 60000); // Check every minute
});
