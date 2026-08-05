import StatCard from "./StatCard";

export default function StatsGrid({
  cards,
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => (
        <StatCard
          key={card.title}
          {...card}
        />
      ))}

    </div>
  );
}