import { Card, CardContent } from "@/components/ui/card";

export default function StatsCard({
  title,
  value,
  description,
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {value}
        </h2>

        {description && (
          <p className="text-sm text-muted-foreground mt-2">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}