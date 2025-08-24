import create from "zustand";
import { persist } from "zustand/middleware";

export const useFavoriteStore = create(
  persist(
    (set, get) => ({
      surahFavorites: [],
      addToFavorite: (surah) =>
        set({ surahFavorites: [surah, ...get().surahFavorites] }),
      removeFromFavorite: (surahNomor) =>
        set({
          surahFavorites: get().surahFavorites.filter(
            // PERUBAHAN: ganti .number menjadi .nomor
            (surah) => surah.nomor !== surahNomor 
          ),
        }),
      surahIsFavorite: (surahNomor) =>
        // PERUBAHAN: ganti .number menjadi .nomor
        get().surahFavorites.some((surah) => surah.nomor === surahNomor),
      toggleFavorite: (surah) => {
        // PERUBAHAN: ganti .number menjadi .nomor
        get().surahIsFavorite(surah.nomor)
          ? get().removeFromFavorite(surah.nomor)
          : get().addToFavorite(surah);
      },
    }),
    {
      name: "MaosQuran-FavoriteSurah", // unique name
      getStorage: () => localStorage,
      version: 1,
    }
  )
);