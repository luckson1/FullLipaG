// "use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { addDays, format } from "date-fns";
import {
  Activity,
  Calendar as CalendarIcon,
  CreditCard,
  DollarSign,
  Download,
  LogOut,
  PlusCircle,
  Settings,
  User,
  Users,
} from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { api } from "~/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ToastAction } from "~/components/ui/toast";
import { toast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";

export function RecentSales() {
  const { data: recentTransactions, isLoading } =
    api.transaction.getRecentTransactions.useQuery(undefined, {
      onError(err) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: ` There was a problem: ${err.message}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      },
    });
  if (isLoading || !recentTransactions)
    return (
      <div className="space-y-8">
        {Array(5).fill(
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="mx-4 h-12 w-full rounded-md" />
          </div>,
        )}
      </div>
    );
  return (
    <div className="space-y-8">
      {recentTransactions.map((transaction) => (
        <div className="flex items-center" key={transaction.id}>
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={transaction.user.Profile?.image ?? ""}
              alt="Avatar"
            />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.user.Profile?.firstName}{" "}
              {transaction.user.Profile?.lastName}
            </p>
            <p className="text-muted-foreground text-sm">
              {transaction.user.phone}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {" "}
            {transaction.payment.ExchangeRate.target}{" "}
            {transaction.payment.sentAmount}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Overview() {
  const { data } = api.transaction.getSuccessfulTransactionsPerMonth.useQuery();
  if (!data) {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <div className="flex flex-row items-end justify-between">
          {Array(12).fill(<Skeleton className="h-3/4 w-5 rounded-md" />)}
        </div>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={8}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `KES ${value}`}
        />
        <Bar dataKey="total" fill="rgb(20 184 166)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: addDays(new Date(2023, 0, 20), 20),
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size="sm"
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
export function UserNav() {
  const { data: profile } = api.profile.getUserProfile.useQuery();
  const router = useRouter();
  const supabase = useSupabaseClient();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    await router.replace("/");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.firstName}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {profile?.email ?? profile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span></span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Search() {
  return (
    <div>
      <Input
        type="search"
        placeholder="Search..."
        className="h-9 md:w-[100px] lg:w-[300px]"
      />
    </div>
  );
}

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/examples/dashboard"
        className="hover:text-primary text-sm font-medium transition-colors"
      >
        Overview
      </Link>
      <Link
        href="/examples/dashboard"
        className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
      >
        Users
      </Link>
      <Link
        href="/examples/dashboard"
        className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
      >
        Transactions
      </Link>
      <Link
        href="/examples/dashboard"
        className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
      >
        Settings
      </Link>
    </nav>
  );
}
export default function DashboardPage() {
  const { data: transactions } =
    api.transaction.getTransactionsMadeThisMonth.useQuery();
  const { data: totals } = api.payment.getTotalsByCurrency.useQuery();
  const { data: totalUsers } = api.profile.getNumberOfUsers.useQuery();
  const { data: totalActiveUsers } =
    api.profile.getNumberOfActiveUsers.useQuery();
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {!totals && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-4 w-1/3 rounded-md" />
                      <DollarSign className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-1/3 rounded-md" />
                    </CardContent>
                  </Card>
                )}
                {totals &&
                  totals.map((t) => (
                    <Card key={t.exchangeRateId}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Transactions
                        </CardTitle>
                        <DollarSign className="text-muted-foreground h-4 w-4" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {t.targetCurrency} {t.sentAmount}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Users</CardTitle>
                    <Users className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    {!totalUsers && (
                      <Skeleton className="h-4 w-1/3 rounded-md" />
                    )}
                    <div className="text-2xl font-bold">{totalUsers}</div>
                    {/* <p className="text-muted-foreground text-xs">
                      +180.1% from last month
                    </p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Transactions
                    </CardTitle>
                    <CreditCard className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    {!totals &&
                      Array(2).fill(
                        <Skeleton className="h-8 w-1/3 rounded-md" />,
                      )}
                    {totals &&
                      totals.map((t) => (
                        <div
                          className="text-2xl font-bold"
                          key={t.exchangeRateId}
                        >
                          {t.targetCurrency} {t.numberOfTransactions}
                        </div>
                      ))}
                    {/* <p className="text-muted-foreground text-xs">
                      +19% from last month
                    </p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Users
                    </CardTitle>
                    <Activity className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    {!totalActiveUsers &&
                      Array(1).fill(
                        <Skeleton className="h-8 w-1/3 rounded-md" />,
                      )}
                    <div className="text-2xl font-bold">{totalActiveUsers}</div>
                    {/* <p className="text-muted-foreground text-xs">
                      +201 since last hour
                    </p> */}
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      You made {transactions} sales this month.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
