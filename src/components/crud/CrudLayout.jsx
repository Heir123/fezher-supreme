import PageHeader from "@/components/common/PageHeader";
import StatsCard from "@/components/common/StatsCard";
import SearchBar from "@/components/common/SearchBar";
import Toolbar from "@/components/common/Toolbar";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";

export default function CrudLayout({
  title,
  description,
  buttonText,
  onButtonClick,

  total,
  totalLabel,

  search,
  setSearch,
  searchPlaceholder,

  loading,

  emptyTitle,
  emptyDescription,

  children,
}) {
  return (
    <div className="space-y-6">

      <PageHeader
        title={title}
        description={description}
        buttonText={buttonText}
        onButtonClick={onButtonClick}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title={totalLabel}
          value={total}
          description={description}
        />
      </div>

      <Toolbar>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={searchPlaceholder}
        />
      </Toolbar>

      {loading ? (
        <LoadingSpinner text={`Loading ${title.toLowerCase()}...`} />
      ) : total === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        children
      )}

    </div>
  );
}