import { Favorite } from "./favorites";

type Status = 'loading' | 'pending' | 'success' | 'error'

 
interface UseFavorite {
    status:Status;
    favorites:Favorite []   
}

export const useFavorites= ():UseFavorite => {
    return {status : 'success', favorites:[] }
}