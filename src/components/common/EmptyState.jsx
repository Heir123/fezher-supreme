import { Card, CardContent } from "@/components/ui/card";

export default function EmptyState({
  title = "No Data Found",
  description = "There is nothing to display yet.",
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-5xl mb-4">📦</div>

        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        <p className="text-muted-foreground mt-2 max-w-md">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}