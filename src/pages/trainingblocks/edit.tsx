import { useEffect } from "react";
import { EditView } from "@/components/refine-ui/views/edit-view.tsx";
import { useBack, useDelete, useGo } from "@refinedev/core";
import type { BaseRecord, HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {trainingBlockEditSchema} from "@/lib/schema.ts";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";


type TrainingBlockEditValues = z.input<typeof trainingBlockEditSchema>;


// DB record -> form values. null becomes "", ISO date is cut to yyyy-mm-dd.
const text = (v: unknown) => (v == null ? "" : String(v));
const day = (v: unknown) => (v ? String(v).slice(0, 10) : "");

const toFormValues = (r: BaseRecord) => ({
    name: text(r.name),
    startDate: day(r.startDate),
    endDate: day(r.endDate),
    lastUpdate: day(r.lastUpdate),
    daysBetweenUpdates: r.daysBetweenUpdates ?? "",
    link: text(r.link),
});

const TrainingBlockEdit = () => {
    const back = useBack();
    const go = useGo();
    const { mutate: deleteBlock, mutation } = useDelete();
    const deleting = mutation.isPending;

    const form = useForm<BaseRecord, HttpError, TrainingBlockEditValues>({
        resolver: zodResolver(trainingBlockEditSchema),
        refineCoreProps: {
            resource: "training-blocks",
            action: "edit", // Refine reads the id from the URL
        },
    });

    // Load the saved block into the form once it arrives.
    // Deferred with setTimeout so it runs after Refine's own reset (which uses the raw record with nulls).
    const { reset } = form;
    const record = form.refineCore.query?.data?.data;
    useEffect(() => {
        if (!record) return;
        const t = setTimeout(() => reset(toFormValues(record) as TrainingBlockEditValues), 0);
        return () => clearTimeout(t);
    }, [record, reset]);

    const blockId = form.refineCore.id;
    const onDelete = () => {
        if (!blockId) return;
        const ok = window.confirm(
            "Delete this training block? It will disappear from your training blocks list. This can't be undone from the app.",
        );
        if (!ok) return;
        deleteBlock(
            { resource: "training-blocks", id: blockId },
            { onSuccess: () => go({ to: { resource: "training-blocks", action: "list" } }) },
        );
    };

    const onSubmit = async (values: TrainingBlockEditValues) => {
        await form.refineCore.onFinish({
            ...values,
            today: format(new Date(), "yyyy-MM-dd"),
        } as TrainingBlockEditValues);
    };

    return (
        <EditView className="class-view">
            <div className="my-4 flex items-center justify-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold">Edit Block</CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* athlete can't be changed: delete the block and make a new one */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Athlete</label>
                                    <Input value={text(record?.athleteName)} disabled readOnly />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    To change the athlete, delete this block and add a new one.
                                </p>

                                <Separator />
                                <h3 className="text-lg font-semibold pt-2">Block Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Block Name <span className="text-orange-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="e.g. Block 67: Nats Peak"
                                                        className="placeholder:text-input"
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
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Start Date <span className="text-orange-500">*</span></FormLabel>
                                                <DatePicker value={field.value} onChange={field.onChange} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Date <span className="text-orange-500">*</span></FormLabel>
                                                <DatePicker value={field.value} onChange={field.onChange} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="lastUpdate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Update Date <span className="text-orange-500">*</span></FormLabel>
                                                <DatePicker value={field.value} onChange={field.onChange} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="daysBetweenUpdates"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Days Between Block Updates <span className="text-orange-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="link"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Program Link</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Sheets/excel Link"
                                                        className="placeholder:text-input"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="outline" onClick={back}>Cancel</Button>
                                    <Button type="submit">Save changes</Button>
                                    <Button type="button" variant="destructive" onClick={onDelete} disabled={deleting}>
                                        Delete block
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

export default TrainingBlockEdit;