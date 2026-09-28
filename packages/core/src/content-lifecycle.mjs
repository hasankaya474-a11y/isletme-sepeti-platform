const transitions = Object.freeze({
  DRAFT: ["REVIEW","ARCHIVED"],
  REVIEW: ["DRAFT","SCHEDULED","PUBLISHED","ARCHIVED"],
  SCHEDULED: ["DRAFT","PUBLISHED","UNPUBLISHED"],
  PUBLISHED: ["UNPUBLISHED"],
  UNPUBLISHED: ["DRAFT","PUBLISHED","ARCHIVED"],
  ARCHIVED: []
});

export function canChangeContentState(from, to) {
  return transitions[from]?.includes(to) ?? false;
}
