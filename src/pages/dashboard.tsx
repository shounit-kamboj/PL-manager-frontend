
import React from "react";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";

const Dashboard = () => {
    const coachName = "Coach";

    const [athleteCount, setAthleteCount] = React.useState<number | null>(null);

    React.useEffect(() => {
        const fetchAthleteCount = async () => {
            try {
                //todo: change when deploy

                //todo:go over all athletes and count++ if active only
                const response = await fetch(
                    "http://localhost:8000/api/athletes?limit=1"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch athletes");
                }

                const result = await response.json();

                setAthleteCount(result.total);
            } catch (error) {
                console.error("Failed to fetch athlete count:", error);
            }
        };

        fetchAthleteCount();
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Breadcrumb />

            <main className="mx-auto max-w-7xl px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <p className="mb-2 text-sm text-muted-foreground">
                        Dashboard
                    </p>

                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                Welcome back, {coachName}
                            </h1>

                            <p className="mt-2 text-muted-foreground">
                                Here's what's happening with your athletes.
                            </p>
                        </div>

                        <div className="hidden text-sm text-muted-foreground sm:block">
                            {new Intl.DateTimeFormat("en-CA", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            }).format(new Date())}
                        </div>
                    </div>
                </div>

                {/* Overview */}
                <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">
                            Athletes
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            {athleteCount ?? "—"}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            On roster (inc. on hiatus)
                        </p>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">
                            Competitions
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            —
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Upcoming competitions
                        </p>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">
                            Payments
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            —
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            overdue
                        </p>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">
                            Training blocks
                        </p>

                        <p className="mt-2 text-3xl font-semibold">
                            —
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Need to be updated in the next 3 days
                        </p>
                    </div>
                </section>


                {/* Footer / Product intro */}
                <section className="mt-6 rounded-xl border bg-card p-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-semibold">
                            CollarPL
                        </h2>

                        <p className="max-w-2xl text-sm text-muted-foreground">
                            Manage your athletes, competitions, payments, and
                            training blocks from one place.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;

