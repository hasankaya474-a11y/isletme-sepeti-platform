export const PHASE4_EVENTS=Object.freeze({
  PRICE_BOOK_CREATED:"pricing.price_book.created",
  OFFER_PRICE_CREATED:"pricing.offer_price.created",
  TAX_PROFILE_CHANGED:"pricing.tax_profile.changed",
  STOCK_RECEIVED:"stock.received",
  STOCK_RESERVED:"stock.reserved",
  STOCK_RESERVATION_RELEASED:"stock.reservation.released",
  STOCK_RESERVATION_COMMITTED:"stock.reservation.committed",
  DELIVERY_ZONE_CHANGED:"delivery.zone.changed",
  DELIVERY_CALENDAR_CHANGED:"delivery.calendar.changed",
  DELIVERY_SLA_CHANGED:"delivery.sla.changed"
});

export function phase4Event({type,resourceType,resourceId,actorId,occurredAt=new Date().toISOString(),payload={}}){
  if(!Object.values(PHASE4_EVENTS).includes(type)) throw new Error("PHASE4_EVENT_TYPE_INVALID");
  if(!resourceType||!resourceId||!actorId) throw new TypeError("PHASE4_EVENT_FIELDS_REQUIRED");
  return Object.freeze({type,resourceType,resourceId,actorId,occurredAt,payload:structuredClone(payload)});
}
