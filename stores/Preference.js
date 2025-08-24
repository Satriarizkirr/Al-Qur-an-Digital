import create from "zustand"; // <-- PERUBAHAN DI SINI
import { persist } from "zustand/middleware";

// Daftar Qari yang tersedia dari API untuk komponen pilihan
export const QARI_LIST = {
  "01": "Abdullah Al-Juhany",
  "02": "Abdul Muhsin Al-Qasim ",
  "03": "Abdurrahman as-Sudais ",
  "04": "Ibrahim Al-Akhdar ",
  "05": "Misyari Rasyid Al-Afasi ",
};

export const usePreferenceStore = create(
  persist(
    (set) => ({
      preference: {
        translation: true,
        tafsir: false,
        qari: "05",
      },
      setQari: (qariId) =>
        set((prev) => ({
          preference: {
            ...prev.preference,
            qari: qariId,
          },
        })),
      showTranslation: () =>
        set((prev) => ({
          preference: {
            ...prev.preference,
            translation: !prev.preference.translation,
          },
        })),
      showTafsir: () =>
        set((prev) => ({
          preference: {
            ...prev.preference,
            tafsir: !prev.preference.tafsir,
          },
        })),
    }),
    {
      name: "MaosQuran-Preference",
      getStorage: () => localStorage,
      version: 1,
    }
  )
);