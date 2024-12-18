import storage from "../common/Storage";
import { setKeyPair } from "../common/helpers/helpers";

interface Keys {
  private_key: string;
  public_key: string;
}

export default function ImportExportKeys() {
  const handleExport = () => {
    const keysForExport: Keys = {
      private_key: storage.get("private_key"),
      public_key: storage.get("public_key"),
    };

    const blob = new Blob([JSON.stringify(keysForExport, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "backup_user_keys.json";

    a.click();

    URL.revokeObjectURL(url);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");

    fileReader.onload = (event) => {
      const result = event.target?.result;

      if (result) {
        const importedKeyPair: Keys = JSON.parse(result as string);

        setKeyPair(importedKeyPair.private_key, importedKeyPair.public_key);
      }
    };
  };

  return (
    <>
      <label htmlFor="files" className="my-button btn btn-lg px-5 text-white">
        Import Keys
      </label>
      <input
        className="my-button btn btn-lg px-5 text-white d-none"
        id="files"
        type="file"
        onChange={handleChange}
      />
      <button
        data-mdb-button-init
        data-mdb-ripple-init
        className="my-button btn btn-lg px-5 text-white"
        onClick={handleExport}
      >
        Export Keys
      </button>
    </>
  );
}
