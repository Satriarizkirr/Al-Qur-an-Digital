// components/SelectQari.js

import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { usePreferenceStore, QARI_LIST } from "stores/Preference";

export default function SelectQari() {
  // Ambil state dan fungsi dari Zustand store
  const { preference, setQari } = usePreferenceStore();

  const handleQariChange = (event) => {
    setQari(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel htmlFor="qari-select">Pilih Qari (Pembaca)</FormLabel>
      <Select
        id="qari-select"
        value={preference.qari}
        onChange={handleQariChange}
      >
        {/* Loop melalui QARI_LIST untuk membuat pilihan dropdown */}
        {Object.entries(QARI_LIST).map(([id, name]) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
}