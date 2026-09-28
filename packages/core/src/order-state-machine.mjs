const transitions = Object.freeze({
  NEW: ["WAITING","CANCELLED"],
  WAITING: ["ACCEPTED","PARTIALLY_ACCEPTED","CANCELLED"],
  ACCEPTED: ["PREPARING","CANCELLED","DISPUTED"],
  PARTIALLY_ACCEPTED: ["PREPARING","CANCELLED","DISPUTED"],
  PREPARING: ["READY","CANCELLED","DISPUTED"],
  READY: ["SHIPPED","CANCELLED","DISPUTED"],
  SHIPPED: ["DELIVERED","PARTIALLY_DELIVERED","DISPUTED"],
  DELIVERED: ["COMPLETED","RETURNED","DISPUTED"],
  PARTIALLY_DELIVERED: ["COMPLETED","RETURNED","DISPUTED"],
  COMPLETED: ["RETURNED","DISPUTED"],
  CANCELLED: [],
  RETURNED: [],
  DISPUTED: []
});

export function canTransition(from, to) {
  return transitions[from]?.includes(to) ?? false;
}

export function transitionOrder(order, to, now = new Date().toISOString()) {
  if (!order?.state || !canTransition(order.state, to)) throw new Error("INVALID_ORDER_TRANSITION");
  return {...order, state: to, updatedAt: now};
}
