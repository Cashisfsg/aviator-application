export const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
};
