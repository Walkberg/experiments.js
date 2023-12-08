import { Favorite } from "../favorites";
import { useFavorites } from "../useFavorites";

export const Favorites = () => {
  const { status, favorites } = useFavorites();

  if (status === "loading") {
    return <div>... loading</div>;
  }

  return (
    <div>
      <div>List de favories</div>
      {favorites.map((favorite) => (
        <FavoriteIcon favorite={favorite} />
      ))}
    </div>
  );
};

interface FavoriteIconProps {
  favorite: Favorite;
}

const FavoriteIcon = ({}: FavoriteIconProps) => {
  return <div>Favorite</div>;
};
