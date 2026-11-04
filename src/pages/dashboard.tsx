import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { useSession } from "@/lib/auth-client";
import { formatDay, localTodayYmd } from "@/lib/dates";


function TypedText({ text, speed = 35, cursorPulses = 3 }: {
    text: string;
    speed?: number;
    cursorPulses?: number;
}) {
    const [count, setCount] = useState(0);
    const [showCursor, setShowCursor] = useState(true);
    const done = count >= text.length;

    useEffect(() => {
        setCount(0);
        setShowCursor(true);
        const id = setInterval(() => {
            setCount((c) => {
                if (c >= text.length) {
                    clearInterval(id);
                    return c;
                }
                return c + 1;
            });
        }, speed);
        return () => clearInterval(id);
    }, [text, speed]);

    useEffect(() => {
        if (!done) return;
        const id = setTimeout(() => setShowCursor(false), cursorPulses * 1500);
        return () => clearTimeout(id);
    }, [done, cursorPulses]);

    return (
        <>
            {text.slice(0, count)}
            {showCursor && <span className="animate-pulse">|</span>}
        </>
    );
}

function partOfDay(hour: number) {
    if (hour < 5) return "Good evening";      // late night
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

function useGreeting() {
    const [hour, setHour] = useState(new Date().getHours());

    // re-check every 15 minutes and stop the timer when the page goes away
    useEffect(() => {
        const id = setInterval(() => setHour(new Date().getHours()), 15 * 60_000);
        return () => clearInterval(id);
    }, []);

    return partOfDay(hour);
}

const Dashboard = () => {
    const { data: session } = useSession();
    const firstName = session?.user?.name?.split(" ")[0];
    const greeting = useGreeting();



    return (
        <div className="min-h-screen bg-background">
            <Breadcrumb />

            <main className="mx-auto max-w-7xl px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight">
                                <TypedText text={`${greeting}, ${firstName}`} />
                            </h1>

                            <p className="mt-2 text-muted-foreground">
                                <TypedText text={`Here's what's happening with your athletes.`} />
                            </p>
                        </div>

                        <div className="hidden text-sm text-muted-foreground sm:block">
                            {formatDay(localTodayYmd(), "EEEE, MMMM d, yyyy")}
                        </div>
                    </div>
                </div>

                {/* Overview */}
                <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Athletes</p>
                        <p className="mt-2 text-3xl font-semibold">—</p>
                        <p className="mt-1 text-sm text-muted-foreground">On roster (inc. on hiatus)</p>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Competitions</p>
                        <p className="mt-2 text-3xl font-semibold">—</p>
                        <p className="mt-1 text-sm text-muted-foreground">Upcoming competitions</p>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Payments</p>
                        <p className="mt-2 text-3xl font-semibold">—</p>
                        <p className="mt-1 text-sm text-muted-foreground">overdue</p>
                    </div>

                    <div className="rounded-xl border bg-card p-5">
                        <p className="text-sm text-muted-foreground">Training blocks</p>
                        <p className="mt-2 text-3xl font-semibold">—</p>
                        <p className="mt-1 text-sm text-muted-foreground">Need to be updated in the next 3 days</p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;