import { Button } from "@/components/ui/button";

export default function PageHeader({
  title,
  description,
  buttonText,
  onButtonClick,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>

      {buttonText && (
        <Button onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}