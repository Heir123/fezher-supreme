export default function LoadingSpinner({
  text = "Loading..."
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>

      <p className="mt-4 text-sm text-muted-foreground">
        {text}
      </p>
    </div>
  );
}