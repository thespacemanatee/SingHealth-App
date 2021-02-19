export const STORE_RELEVANT_AUDITS = "STORE_RELEVANT_AUDITS";

export const storeRelevantAudits = (audits) => {
  return { type: STORE_RELEVANT_AUDITS, audits: audits };
};
