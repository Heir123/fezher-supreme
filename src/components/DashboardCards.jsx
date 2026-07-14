import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardStats } from "@/services/dashboardService";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

const initialCards = [
  {
    title: "Products",
    value: "0",
    icon: Package,
    key: "products",
  },
  {
    title: "Customers",
    value: "0",
    icon: Users,
    key: "customers",
  },
  {
    title: "Sales",
    value: "0",
    icon: ShoppingCart,
    key: "sales",
  },
  {
    title: "Suppliers",
    value: "0",
    icon: DollarSign,
    key: "suppliers",
  },
];

export default function DashboardCards() {
  const [cards, setCards] = useState(initialCards);

useEffect(() => {
  async function loadStats() {
    const stats = await getDashboardStats();

    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        value: stats[card.key] ?? "0",
      }))
    );
  }

  loadStats();
}, []);
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
              </div>

              <Icon className="h-10 w-10 text-blue-600" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}