import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::order.order", {
  config: {
    create: { auth: false },
    find: { auth: false },
    findOne: { auth: false },
  },
});

