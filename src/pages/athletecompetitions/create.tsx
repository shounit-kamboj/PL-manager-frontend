import { useState } from "react";
import { CreateView } from "@/components/refine-ui/views/create-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { useBack, useSelect } from "@refinedev/core";
import type { BaseRecord, HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {athletesAndCompetitionsSchema } from "@/lib/schema.ts";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CompetitionDialog } from "@/components/competition-dialog.tsx";
import { localTodayYmd } from "@/lib/dates.ts";

type MeetEntryFormValues = z.infer<typeof athletesAndCompetitionsSchema>;

const EQUIPMENT_OPTIONS = [
    { label: "Classic/Raw", value: "Classic/Raw" },
    { label: "Equipped", value: "Equipped" },
    { label: "Both", value: "both" },
];

const AthleteCompetitionsCreate = () => {
    const back = useBack();

    const form = useForm<BaseRecord, HttpError, MeetEntryFormValues>({
        resolver: zodResolver(athletesAndCompetitionsSchema),
        refineCoreProps: {
            resource: "athlete-competitions",
            action: "create",
        },
    });

    const { options: athleteOptions } = useSelect({
        resource: "athletes",
        optionLabel: (a: BaseRecord) => String(a.name),
        optionValue: (a: BaseRecord) => String(a.id),
        pagination: { pageSize: 100 },
    });

    const { options: compOptions, query: compQuery } = useSelect({
        resource: "competitions",
        optionLabel: (c: BaseRecord) =>
            `${c.name ?? `Competition #${c.id}`}${c.startDate ? ` (${String(c.startDate).slice(0, 10)})` : ""}`,
        optionValue: (c: BaseRecord) => String(c.id),
        pagination: { pageSize: 100 },
        filters: [{ field: "today", operator: "eq", value: localTodayYmd() }],
    });

    // the date picker is limited to the selected competition's dates
    const compId = form.watch("compId");
    const selectedComp = compQuery.data?.data?.find((c: BaseRecord) => c.id === compId);
    const minDate = selectedComp ? String(selectedComp.startDate).slice(0, 10) : undefined;
    const maxDate = selectedComp ? String(selectedComp.endDate).slice(0, 10) : undefined;

    // ----- custom competition dialog (shared component) -----
    const [customOpen, setCustomOpen] = useState(false);

    const onCompetitionSaved = async (created: BaseRecord) => {
        await compQuery.refetch(); // so the new competition is in the dropdown
        form.setValue("compId", Number(created.id), { shouldValidate: true });
        form.setValue("date", String(created.startDate).slice(0, 10));
    };

    const onSubmit = async (values: MeetEntryFormValues) => {
        await form.refineCore.onFinish(values);
    };

    return (
        <CreateView className="class-view">
            <Breadcrumb />
            <div className="intro-row">
                <h2>Add meet entry</h2>
                <Button onClick={back}>Go Back</Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center justify-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold">Meet Entry Form</CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="athleteId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Athlete <span className="text-orange-500">*</span></FormLabel>
                                                <Select
                                                    onValueChange={(v) => field.onChange(Number(v))}
                                                    value={field.value ? String(field.value) : ""}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Athlete" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {athleteOptions.map((opt) => (
                                                            <SelectItem key={String(opt.value)} value={String(opt.value)}>
                                                                {opt.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="compId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Competition <span className="text-orange-500">*</span></FormLabel>
                                                <Select
                                                    onValueChange={(v) => {
                                                        field.onChange(Number(v));
                                                        const c = compQuery.data?.data?.find(
                                                            (x: BaseRecord) => x.id === Number(v),
                                                        );
                                                        if (!c) return;
                                                        const start = String(c.startDate).slice(0, 10);
                                                        const end = String(c.endDate).slice(0, 10);
                                                        const current = form.getValues("date");
                                                        if (!current || current < start || current > end) {
                                                            form.setValue("date", start);
                                                        }
                                                    }}
                                                    value={field.value ? String(field.value) : ""}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Competition" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {compOptions.map((opt) => (
                                                            <SelectItem key={String(opt.value)} value={String(opt.value)}>
                                                                {opt.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div>
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="h-auto p-0 text-sm"
                                        onClick={() => setCustomOpen(true)}
                                    >
                                        Don't see your comp? Add a custom one by clicking here.
                                    </Button>
                                </div>

                                <Separator />
                                <h3 className="text-lg font-semibold">Meet Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                            <FormItem>
                                                <FormLabel>Equipment</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
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
                                    <Button type="submit">Add entry</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            <CompetitionDialog open={customOpen} onOpenChange={setCustomOpen} onSaved={onCompetitionSaved} />
        </CreateView>
    );
};

export default AthleteCompetitionsCreate;