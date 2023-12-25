import { Input } from "@/components/ui/input";
import { useSearch } from "../providers/DriveSearchProvider";

export const DriveSearch = () => {
  const { search, updateSearch } = useSearch();
  return (
    <div className="w-full">
      <Input
        placeholder="Rechercher"
        value={search}
        onChange={(e) => updateSearch(e.target.value)}
      />
    </div>
  );
};
