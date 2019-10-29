const legacyPlans = {
  STARTER: { maxDevices: 5, subscriptionPlanId: 552214, name: "Starter" },
  GROWING: { maxDevices: 10, subscriptionPlanId: 552215, name: "Growing" },
  BUSINESS: { maxDevices: 30, subscriptionPlanId: 552216, name: "Business" },
  ON_PREMISES: { maxDevices: 10000, subscriptionPlanId: 1, name: "On Premises" }
};

const newPlans = {
  STARTER: { maxDevices: 2, subscriptionPlanId: 552214, name: "Starter" },
  GROWING: { maxDevices: 5, subscriptionPlanId: 552215, name: "Growing" },
  BUSINESS: { maxDevices: 30, subscriptionPlanId: 552216, name: "Business" },
  ON_PREMISES: { maxDevices: 10000, subscriptionPlanId: 1, name: "On Premises" }
};

Object.defineProperties(legacyPlans, {
  552214: { value: legacyPlans.STARTER, enumerable: false },
  552215: { value: legacyPlans.GROWING, enumerable: false },
  552216: { value: legacyPlans.BUSINESS, enumerable: false },
  1: { value: legacyPlans.ON_PREMISES, enumerable: false }
});

Object.defineProperties(newPlans, {
  552214: { value: newPlans.STARTER, enumerable: false },
  552215: { value: newPlans.GROWING, enumerable: false },
  552216: { value: newPlans.BUSINESS, enumerable: false },
  1: { value: newPlans.ON_PREMISES, enumerable: false }
});

export default userCreatedAt => (userCreatedAt > 1572031551573 ? newPlans : legacyPlans);
