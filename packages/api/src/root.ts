import { accountRouter } from "./router/account";
import { exchangeRouter } from "./router/exchange";
import { paymentRouter } from "./router/payment";
import { rateRouter } from "./router/rate";
import { recipientROuter } from "./router/recipients";
import { statusRouter } from "./router/status";
import { transactionRouter } from "./router/transaction";
import { profileRouter } from "./router/userData";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  transaction: transactionRouter,
  status: statusRouter,
  recipient: recipientROuter,
  payment: paymentRouter,
  exchange: exchangeRouter,
  rate: rateRouter,
  account: accountRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
