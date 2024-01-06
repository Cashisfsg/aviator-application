export const formatTime = (date: string | Date | undefined) => {
    return date
        ? new Date(date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
          })
        : new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
          });
};
