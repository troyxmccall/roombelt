const legacyPlans = {
  552214: { maxDevices: 5 },
  552215: { maxDevices: 10 },
  552216: { maxDevices: 30 },
  1: { maxDevices: 10000 }
};

const newPlans = {
  552214: { maxDevices: 2 },
  552215: { maxDevices: 5 },
  552216: { maxDevices: 30 },
  1: { maxDevices: 10000 }
};

module.exports = userCreatedAt => (userCreatedAt > 1572031551573 ? newPlans : legacyPlans);
