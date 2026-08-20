import StatCard from "./StatCard";

export default function StatsGrid({ cards = [] }) {
  // Helper function to safely extract a displayable value
  const getSafeValue = (value, title) => {
    // Handle null/undefined/boolean
    if (value === null || value === undefined || typeof value === "boolean") {
      return "0";
    }

    // Handle arrays - show the length
    if (Array.isArray(value)) {
      console.warn(
        "StatsGrid received an array instead of a primitive:",
        title,
        value
      );
      return value.length; // Return the count of items in the array
    }

    // Handle primitives
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }

    // Handle objects
    if (typeof value === "object") {
      console.warn(
        "StatsGrid received an object instead of a primitive:",
        title,
        value
      );

      // If it's an object with a length property (like array-like objects)
      if (value.length !== undefined && typeof value.length === "number") {
        return value.length;
      }

      // Try to extract a primitive value from the object
      const possibleKeys = [
        // Common display fields
        'name', 'email', 'title', 'label', 'displayName',
        // Number fields
        'value', 'count', 'total', 'amount', 'total_amount', 'revenue', 'price',
        'id', 'key', 'code',
        // Date fields
        'date', 'created_at', 'updated_at',
      ];

      for (const key of possibleKeys) {
        if (value[key] !== undefined && value[key] !== null) {
          const extracted = value[key];
          // If extracted value is a primitive, return it
          if (typeof extracted === "string" || typeof extracted === "number") {
            return extracted;
          }
          // If it's an array, return its length
          if (Array.isArray(extracted)) {
            return extracted.length;
          }
          // If it's an object, try to stringify it
          if (typeof extracted === "object") {
            try {
              return JSON.stringify(extracted);
            } catch {
              return "0";
            }
          }
        }
      }

      // Try to get any primitive value from the object
      const primitiveValues = Object.values(value).filter(
        v => typeof v === "string" || typeof v === "number"
      );

      if (primitiveValues.length > 0) {
        return primitiveValues[0];
      }

      // Last resort: stringify
      try {
        return JSON.stringify(value);
      } catch {
        return "0";
      }
    }

    // Fallback: convert to string
    return String(value);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
        width: "100%",
      }}
    >
      {cards.map((card, index) => {
        const safeValue = getSafeValue(card?.value, card?.title);

        return (
          <StatCard
            key={card?.id ?? card?.title ?? index}
            title={card?.title ?? ""}
            value={safeValue}
            description={card?.description ?? ""}
          />
        );
      })}
    </div>
  );
}