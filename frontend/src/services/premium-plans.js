const plans = {
  STARTER: { maxDevices: 5, subscriptionPlanId: 552214, name: "Starter" },
  GROWING: { maxDevices: 10, subscriptionPlanId: 552215, name: "Growing" },
  BUSINESS: { maxDevices: 20, subscriptionPlanId: 552216, name: "Business" },
  ON_PREMISES: { maxDevices: 10000, subscriptionPlanId: 1, name: "On Premises" }
};

Object.defineProperties(plans, {
  552214: { value: plans.STARTER, enumerable: false },
  552215: { value: plans.GROWING, enumerable: false },
  552216: { value: plans.BUSINESS, enumerable: false },
  1: { value: plans.ON_PREMISES, enumerable: false }
});

export default plans;