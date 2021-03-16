export const STORE_DATABASE = "STORE_DATABASE";

export const storeDatabase = (database) => {
  return { type: STORE_DATABASE, database };
};
