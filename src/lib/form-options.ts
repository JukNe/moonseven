/** Steam `language` query values (see Store review filters). */
export const LANGUAGE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All languages" },
  { value: "english", label: "English" },
  { value: "schinese", label: "Simplified Chinese" },
  { value: "tchinese", label: "Traditional Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "russian", label: "Russian" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "spanish", label: "Spanish — Spain" },
  { value: "latam", label: "Spanish — Latin America" },
  { value: "brazilian", label: "Portuguese — Brazil" },
  { value: "portuguese", label: "Portuguese — Portugal" },
  { value: "polish", label: "Polish" },
  { value: "turkish", label: "Turkish" },
  { value: "italian", label: "Italian" },
  { value: "dutch", label: "Dutch" },
  { value: "swedish", label: "Swedish" },
  { value: "norwegian", label: "Norwegian" },
  { value: "finnish", label: "Finnish" },
  { value: "danish", label: "Danish" },
  { value: "czech", label: "Czech" },
  { value: "hungarian", label: "Hungarian" },
  { value: "romanian", label: "Romanian" },
  { value: "bulgarian", label: "Bulgarian" },
  { value: "greek", label: "Greek" },
  { value: "ukrainian", label: "Ukrainian" },
  { value: "thai", label: "Thai" },
  { value: "vietnamese", label: "Vietnamese" },
  { value: "indonesian", label: "Indonesian" },
];

export const PURCHASE_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All purchase types" },
  { value: "steam", label: "Purchased on Steam" },
  { value: "non_steam_purchase", label: "Non-Steam purchase (e.g. retail key)" },
];

/** `filter` — see Steam Get Reviews docs. */
export const FILTER_OPTIONS: { value: string; label: string }[] = [
  {
    value: "recent",
    label: "Recent (by creation time; best for paging cursors)",
  },
  {
    value: "updated",
    label: "Updated (by last update; best for paging cursors)",
  },
  {
    value: "all",
    label: "All / helpfulness (uses day range; default Steam sort)",
  },
];

export const REVIEW_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All reviews" },
  { value: "positive", label: "Positive only" },
  { value: "negative", label: "Negative only" },
];

/**
 * `filter_offtopic_activity` — omit param = Steam default (hide off-topic);
 * `0` = include off-topic / review-bomb-filtered reviews.
 */
export const OFFTOPIC_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "default", label: "Default (exclude off-topic / review bombs)" },
  { value: "include", label: "Include off-topic (pass 0)" },
];
