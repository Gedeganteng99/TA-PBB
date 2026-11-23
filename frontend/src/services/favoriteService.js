import api from '../config/api.js';

// user_id disimpan di localStorage; sinkron ke server saat online
const USER_ID_KEY = 'ngopikampus_user_id';

export function getUserId() {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

// Local-first favorites
const LOCAL_FAV_KEY = 'ngopikampus_favorites';

function getLocalFavs() {
  try { return JSON.parse(localStorage.getItem(LOCAL_FAV_KEY) ?? '[]'); }
  catch { return []; }
}

function setLocalFavs(ids) {
  localStorage.setItem(LOCAL_FAV_KEY, JSON.stringify(ids));
}

export const favoriteService = {
  getAll: (userId) => api.get('/api/favorites', { params: { user_id: userId } }),

  toggle: (cafeId, userId) => api.post('/api/favorites/toggle', { cafe_id: cafeId, user_id: userId }),

  // local-first helpers
  isLocalFav: (cafeId) => getLocalFavs().includes(cafeId),

  toggleLocal: (cafeId) => {
    const favs = getLocalFavs();
    const idx = favs.indexOf(cafeId);
    if (idx >= 0) favs.splice(idx, 1);
    else favs.push(cafeId);
    setLocalFavs(favs);
    return idx < 0; // true = added
  },

  getLocalFavIds: () => getLocalFavs(),
};
