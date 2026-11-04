import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { useSession } from "@/lib/auth-client";
import { formatDay, localTodayYmd } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { useDashboardStats } from "@/hooks/useDashboardStats.ts";
import {
    BLOCK_DAY_OPTIONS,
    MEET_DAY_OPTIONS,
    RETENTION_UNIT_OPTIONS,
} from "@/constants";
import type { RetentionUnit } from "@/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Link} from "react-router";

// starting windows: each must be one of its dropdown's values
const DEFAULT_MEET_DAYS = 28; // 4 weeks
const DEFAULT_BLOCK_DAYS = 4;
const DEFAULT_RETENTION_UNIT: RetentionUnit = "years";

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
    if (hour < 5) return "Good evening";
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

function useGreeting() {
    const [hour, setHour] = useState(new Date().getHours());

    useEffect(() => {
        const id = setInterval(() => setHour(new Date().getHours()), 15 * 60_000);
        return () => clearInterval(id);
    }, []);

    return partOfDay(hour);
}

const money = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// a dropdown that sits inside a sentence: "in the next [4 weeks ▾]"
function InlinePicker({ value, options, onChange }: {
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}) {
    const current = options.find((o) => o.value === value)?.label ?? value;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="inline-flex items-center gap-0.5 font-medium text-foreground underline decoration-dotted underline-offset-4 hover:text-primary"
                >
                    {current}
                    <ChevronDown className="h-3 w-3" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
                    {options.map((o) => (
                        <DropdownMenuRadioItem key={o.value} value={o.value}>
                            {o.label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// ---------- building blocks ----------
type Size = "xs" | "sm" | "md" | "lg" | "xl";

const TEXT_SIZES: Record<Size, string> = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-3xl",
    xl: "text-5xl",
};

type PartProps = { children?: ReactNode; className?: string; size?: Size };

// the card: soft shadow, no border
// the card: soft shadow underneath, no border
const Stat = ({ children, className }: PartProps) => (
    <div
        className={cn(
            "rounded-lg bg-card p-6 shadow-[0_6px_12px_-6px_var(--stat-shadow)]",
            className,
        )}
    >
        {children}
    </div>
);

// the big light number, with room for a badge beside it
const StatValue = ({ children, className, size = "xl" }: PartProps) => (
    <div className={cn("flex items-baseline gap-2 font-light tracking-tight wrap-break-word", TEXT_SIZES[size], className)}>
        {children}
    </div>
);

// the line under the number
const StatLabel = ({ children, className, size = "sm" }: PartProps) => (
    <p className={cn("mt-2 text-foreground", TEXT_SIZES[size], className)}>{children}</p>
);

// a quieter extra line
const StatHint = ({ children, className, size = "xs" }: PartProps) => (
    <p className={cn("mt-1 text-muted-foreground", TEXT_SIZES[size], className)}>{children}</p>
);

// small coloured text beside a number
const StatBadge = ({ children, tone = "neutral" }: { children: ReactNode; tone?: "good" | "bad" | "neutral" }) => (
    <span
        className={cn(
            "text-xs font-medium tracking-normal",
            tone === "good" && "text-emerald-600",
            tone === "bad" && "text-red-500",
            tone === "neutral" && "text-muted-foreground",
        )}
    >
        {children}
    </span>
);


const Dashboard = () => {
    const { data: session } = useSession();
    const firstName = session?.user?.name?.split(" ")[0];
    const greeting = useGreeting();

    const [meetDays, setMeetDays] = useState(DEFAULT_MEET_DAYS);
    const [blockDays, setBlockDays] = useState(DEFAULT_BLOCK_DAYS);
    const [retentionUnit, setRetentionUnit] = useState<RetentionUnit>(DEFAULT_RETENTION_UNIT);
    const { data, loading, error } = useDashboardStats({ meetDays, blockDays, retentionUnit });

    const overdue = data?.numOverduePayments ?? 0;

    return (
        <div className="min-h-screen bg-background">
            <Breadcrumb />

            <main className="mx-auto max-w-7xl px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-semibold tracking-tight">
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
                <hr className="my-6 border-border" />
                <br/>
                <br/>

                {error && (
                    <p className="mb-4 text-sm text-destructive">Couldn't load the dashboard ({error}).</p>
                )}

                {/* old numbers stay visible, dimmed, while a changed window reloads */}
                <div className={cn("space-y-4", loading && data && "opacity-60")}>

                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Stat>
                            <StatValue>{data ? data.activeAthletes : "—"}</StatValue>
                            <StatLabel>Active athletes</StatLabel>
                        </Stat>


                        <Stat>
                            <StatValue>{data ? money(data.mrr) : "—"}</StatValue>
                            <StatLabel>Monthly recurring revenue</StatLabel>
                        </Stat>

                        <Stat>
                            <StatValue>
                                {data ? money(data.moneyMadeMonth) : "—"}
                                {data && overdue == 1 && <StatBadge tone="bad">{overdue} Payment overdue</StatBadge>}
                                {data && overdue > 1 && <StatBadge tone="bad">{overdue} Payments overdue</StatBadge>}
                                {data && overdue === 0 && <StatBadge tone="good">No overdue payments</StatBadge>}
                            </StatValue>
                            <StatLabel>Collected this month</StatLabel>
                        </Stat>
                    </section>
                    <br/>

                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Stat>
                            <StatValue>{data ? data.numMyAthletesCompetitions : "—"}</StatValue>
                            <StatLabel>
                                Meet entries in the next{" "}
                                <InlinePicker
                                    value={String(meetDays)}
                                    options={MEET_DAY_OPTIONS}
                                    onChange={(v) => setMeetDays(Number(v))}
                                />
                            </StatLabel>
                        </Stat>

                        <Stat>
                            <StatValue size="lg">
                                {data ? data.nextAthleteMeetName ?? "None scheduled" : "—"}
                            </StatValue>
                            <StatLabel>Next meet</StatLabel>
                            {data?.nextAthleteMeetDate && (
                                <StatHint>{formatDay(data.nextAthleteMeetDate)}</StatHint>
                            )}
                        </Stat>

                        <Stat>
                            <StatValue>{data ? data.numBlockToUpdate : "—"}</StatValue>
                            <StatLabel>
                                Blocks needing an update in the next{" "}
                                <InlinePicker
                                    value={String(blockDays)}
                                    options={BLOCK_DAY_OPTIONS}
                                    onChange={(v) => setBlockDays(Number(v))}
                                />{" "}
                                {blockDays === 1 ? "day" : "days"}
                            </StatLabel>
                        </Stat>
                    </section>
                    <br/>

                        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Stat>
                            <StatValue>{data ? data.athleteRetentionTime : "—"}</StatValue>
                            <StatLabel>
                                Average time with you, in{" "}
                                <InlinePicker
                                    value={retentionUnit}
                                    options={RETENTION_UNIT_OPTIONS}
                                    onChange={(v) => setRetentionUnit(v as RetentionUnit)}
                                />
                            </StatLabel>
                        </Stat>
                        <Stat className="flex flex-col justify-center sm:col-span-2 lg:col-span-2">
                            <StatValue size="lg">Thank you for using Collar PL{firstName ? `, ${firstName}` : ""}.</StatValue>
                            <StatLabel>Your opinion matters highly to us. If you have any feedback please message us
                                <a href="https://www.instagram.com/collar.pl/" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4 hover:text-primary"> here.</a>                            </StatLabel>
                        </Stat>

                    </section>

                </div>
                <br/>
                <br/>
                <hr className="my-6 border-border" />
            </main>
        </div>
    );
};

export default Dashboard;