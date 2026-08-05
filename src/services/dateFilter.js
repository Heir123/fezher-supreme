export function getDateRange(filter) {
  if (filter === "all") return null;

  const now = new Date();

  switch (filter) {
    case "today":
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

    case "week": {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;

      return new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - diff
      );
    }

    case "month":
      return new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    case "year":
      return new Date(
        now.getFullYear(),
        0,
        1
      );

    default:
      return null;
  }
}