import { accountRouter } from "./router/account";
import { authRouter } from "./router/auth";
import { exchangeRouter } from "./router/exchange";
import { paymentRouter } from "./router/payment";
import { recipientROuter } from "./router/recipients";
import { statusRouter } from "./router/status";
import { transactionRouter } from "./router/transaction";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  transaction: transactionRouter,
  status: statusRouter,
  recipient: recipientROuter,
  payment: paymentRouter,
  exchange: exchangeRouter,
  account: accountRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
