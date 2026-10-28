import type { ReactNode } from "react";
import { useBack, useShow } from "@refinedev/core";
import type { BaseRecord, HttpError } from "@refinedev/core";
import { ShowView } from "@/components/refine-ui/views/show-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { EditButton } from "@/components/refine-ui/buttons/edit.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { WEIGHTCLASSES_OPTIONS } from "@/constants";
import { formatDay } from "@/lib/dates.ts";

const GENDER_LABELS: Record<string, string> = {
    male: "Male",
    female: "Female",
    "non-binary": "Non-binary",
    "prefer-not-to-say": "Prefer not to say",
};

const EQUIPMENT_LABELS: Record<string, string> = {
    "Classic/Raw": "Classic/Raw",
    Equipped: "Equipped",
    both: "Both",
};

// numbers can arrive as strings from the API (numeric columns), so convert before formatting
const money = (v: unknown) => (v == null || v === "" ? undefined : `$${Number(v).toFixed(2)}`);
const kg = (v: unknown) => (v == null || v === "" ? undefined : `${Number(v)} kg`);
const day = (v: unknown) => (v ? formatDay(String(v)) : undefined);
const cycle = (v: unknown) => {
    const weeks = Number(v);
    if (!weeks) return undefined; // null, "", 0
    return `Every ${weeks} week${weeks === 1 ? "" : "s"}`;
};

// Squat / Bench / Deadlift / Total in one row (2x2 on phones)
const PB_GRID = "grid-cols-2 gap-x-6 sm:grid-cols-4 lg:gap-x-12";

// one label + value; empty values show a dash. `wide` spans both columns of its section
const Field = ({ label, value, wide }: { label: string; value?: ReactNode; wide?: boolean }) => (
    <div className={wide ? "col-span-2 space-y-1" : "space-y-1"}>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium wrap-break-word">
            {value === undefined || value === null || value === "" ? "—" : value}
        </p>
    </div>
);

// a heading, a rule under it, then the fields (two columns unless told otherwise)
const Section = ({
                     title,
                     children,
                     gridClassName = "grid-cols-2 gap-x-6",
                 }: {
    title: string;
    children: ReactNode;
    gridClassName?: string;
}) => (
    <section className="space-y-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Separator />
        <div className={`grid gap-y-5 ${gridClassName}`}>{children}</div>
    </section>
);

const AthletesShow = () => {
    const back = useBack();
    const { query } = useShow<BaseRecord, HttpError>({ resource: "athletes" });
    const record = query.data?.data;

    // only turn the link into a clickable one if it is a real http(s) address
    const link = record?.link ? String(record.link) : "";
    const linkValue = /^https?:\/\//i.test(link) ? (
        <a href={link} target="_blank" rel="noreferrer" className="underline underline-offset-4 break-all hover:text-secondary-foreground hover:underline-offset-5">
            {link}
        </a>
    ) : (
        link || undefined
    );

    const weightClassLabel =
        WEIGHTCLASSES_OPTIONS.find((o) => o.value === record?.weightClass)?.label ?? record?.weightClass;

    return (
        <ShowView className="w-full">
            <Breadcrumb />

            {query.isLoading ? (
                <p className="text-muted-foreground">Loading…</p>
            ) : query.isError || !record ? (
                <div className="space-y-4">
                    <p>Athlete not found.</p>
                    <Button variant="outline" onClick={back}>Back</Button>
                </div>
            ) : (
                <div className="flex flex-col gap-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold">{record.name}</h1>
                            <Badge variant={record.isActive === false ? "outline" : "secondary"}>
                                {record.isActive === false ? "Inactive" : "Active"}
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={back}>Back</Button>
                            <EditButton resource="athletes" recordItemId={record.id} />
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2 2xl:grid-cols-4">
                        <Section title="Personal Info">
                            <Field label="Email" value={record.email} wide />
                            <Field label="Phone Number" value={record.phoneNumber} />
                            <Field label="Gender" value={GENDER_LABELS[record.gender] ?? record.gender} />
                            <Field label="Date of Birth" value={day(record.dateOfBirth)} />
                            <Field label="Joined At" value={day(record.joinedAt)} />
                        </Section>

                        <Section title="Location">
                            <Field label="Country" value={record.country} />
                            <Field label="Province/State" value={record.province} />
                            <Field label="City" value={record.city} />
                        </Section>

                        <Section title="Training & Equipment">
                            <Field label="Weight Class" value={weightClassLabel} />
                            <Field label="Equipment Preference" value={EQUIPMENT_LABELS[record.equipment] ?? record.equipment} />
                        </Section>

                        <Section title="Payment Details">
                            <Field label="Payment Price" value={money(record.paymentPrice)} />
                            <Field label="Payment Cycle" value={cycle(record.paymentCycleLengthWeeks)} />
                        </Section>
                    </div>

                    <Section title="Meet Personal Bests" gridClassName={PB_GRID}>
                        <Field label="Squat" value={kg(record.meetPrSquat)} />
                        <Field label="Bench" value={kg(record.meetPrBench)} />
                        <Field label="Deadlift" value={kg(record.meetPrDeadlift)} />
                        <Field label="Total" value={kg(record.meetPrTotal)} />
                    </Section>

                    <Section title="Gym Personal Bests" gridClassName={PB_GRID}>
                        <Field label="Squat" value={kg(record.prSquat)} />
                        <Field label="Bench" value={kg(record.prBench)} />
                        <Field label="Deadlift" value={kg(record.prDeadlift)} />
                        <Field label="Total" value={kg(record.prTotal)} />
                    </Section>

                    <Section title="Link & Notes">
                        <Field label="Athlete page Link" value={linkValue} wide />
                        <Field
                            label="Notes"
                            value={record.notes ? <span className="whitespace-pre-wrap">{record.notes}</span> : undefined}
                            wide
                        />
                    </Section>
                </div>
            )}
        </ShowView>
    );
};

export default AthletesShow;