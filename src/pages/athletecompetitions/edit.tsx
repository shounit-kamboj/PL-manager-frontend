import { useEffect } from "react";
import { EditView } from "@/components/refine-ui/views/edit-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { useBack, useDelete, useGo } from "@refinedev/core";
import type { BaseRecord, HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { athletesAndCompetitionsEditSchema } from "@/lib/schema.ts";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type MeetEntryEditValues = z.infer<typeof athletesAndCompetitionsEditSchema>;

const EQUIPMENT_OPTIONS = [
    { label: "Classic/Raw", value: "Classic/Raw" },
    { label: "Equipped", value: "Equipped" },
    { label: "Both", value: "both" },
];

// DB record -> form values. null becomes "", ISO date is cut to yyyy-mm-dd,
// and "09:30:00" is cut to "09:30" for <input type="time">.
const text = (v: unknown) => (v == null ? "" : String(v));
const day = (v: unknown) => (v ? String(v).slice(0, 10) : "");

const toFormValues = (r: BaseRecord) => ({
    date: day(r.date),
    weighInTime: text(r.weighInTime).slice(0, 5),
    equipment: r.equipment ?? undefined,
});

const AthleteCompetitionsEdit = () => {
    const back = useBack();
    const go = useGo();
    const { mutate: deleteEntry, mutation } = useDelete();
    const deleting = mutation.isPending;

    const form = useForm<BaseRecord, HttpError, MeetEntryEditValues>({
        resolver: zodResolver(athletesAndCompetitionsEditSchema),
        refineCoreProps: {
            resource: "athlete-competitions",
            action: "edit", // Refine reads the id from the URL
        },
    });

    // Load the saved entry into the form once it arrives.
    // Deferred with setTimeout so it runs after Refine's own reset (which uses the raw record with nulls).
    const { reset } = form;
    const record = form.refineCore.query?.data?.data;
    useEffect(() => {
        if (!record) return;
        const t = setTimeout(() => reset(toFormValues(record) as MeetEntryEditValues), 0);
        return () => clearTimeout(t);
    }, [record, reset]);

    // the date picker is limited to this competition's dates
    const comp = record?.competition as BaseRecord | undefined;
    const minDate = comp?.startDate ? String(comp.startDate).slice(0, 10) : undefined;
    const maxDate = comp?.endDate ? String(comp.endDate).slice(0, 10) : undefined;
    const compLabel = comp
        ? `${comp.name ?? `Competition #${comp.id}`}${minDate ? ` (${minDate}${maxDate && maxDate !== minDate ? ` to ${maxDate}` : ""})` : ""}`
        : "";

    const entryId = form.refineCore.id;
    const onDelete = () => {
        if (!entryId) return;
        const ok = window.confirm(
            "Delete this meet entry? It will disappear from your meet list. This can't be undone from the app.",
        );
        if (!ok) return;
        deleteEntry(
            { resource: "athlete-competitions", id: entryId },
            { onSuccess: () => go({ to: { resource: "athlete-competitions", action: "list" } }) },
        );
    };

    const onSubmit = async (values: MeetEntryEditValues) => {
        await form.refineCore.onFinish(values);
    };

    return (
        <EditView className="class-view">
            <div className="my-4 flex items-center justify-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold">Meet Entry Form</CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* athlete and competition can't be changed: delete the entry and make a new one */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Athlete</label>
                                        <Input value={text(record?.athleteName)} disabled readOnly />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Competition</label>
                                        <Input value={compLabel} disabled readOnly />
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    To change the athlete or competition, delete this entry and add a new one.
                                </p>

                                <Separator />
                                <h3 className="text-lg font-semibold pt-2">Meet Details</h3>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        min={minDate}
                                                        max={maxDate}
                                                        {...field}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="weighInTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Weigh-in Time</FormLabel>
                                                <FormControl>
                                                    <Input type="time" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="equipment"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Equipment</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Equipment" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {EQUIPMENT_OPTIONS.map((opt) => (
                                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="outline" onClick={back}>Cancel</Button>
                                    <Button type="submit">Save changes</Button>
                                    <Button type="button" variant="destructive" onClick={onDelete} disabled={deleting}>
                                        Delete entry
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </EditView>
    );
};

export default AthleteCompetitionsEdit;