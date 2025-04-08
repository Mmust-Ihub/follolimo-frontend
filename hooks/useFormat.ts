// 2025-04-10T08:00:00.000Z  hook to format date format

export default function useFormat() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      // second: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  return { formatDate };
}
