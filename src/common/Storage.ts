const storage = {
    get(key: string, defaultValue: undefined = undefined) {
      try {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error(
          `Error parsing data from localStorage key "${key}":`,
          error,
        );
        return defaultValue;
      }
    },

    set(key: string, value: any) {
      localStorage.setItem(key, JSON.stringify(value));
    },
  
    remove(key: string) {
      localStorage.removeItem(key);
    },
  };
  
  export default storage;