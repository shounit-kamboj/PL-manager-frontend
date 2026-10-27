import { useEffect } from "react";
import { EditView } from "@/components/refine-ui/views/edit-view.tsx";
import { useBack, useDelete, useGo } from "@refinedev/core";
import type { BaseRecord, HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { paymentEditSchema } from "@/lib/schema.ts";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

type PaymentEditValues = z.infer<typeof paymentEditSchema>;

const STATUS_OPTIONS = [
    { label: "Paid", value: "paid" },
    { label: "Unpaid", value: "unpaid" },
    { label: "Overdue", value: "overdue" },
    { label: "Paid late", value: "paid_late" },
];

// DB record -> form values. null becomes "", ISO date is cut to yyyy-mm-dd.
const text = (v: unknown) => (v == null ? "" : String(v));
const day = (v: unknown) => (v ? String(v).slice(0, 10) : "");

const toFormValues = (r: BaseRecord) => ({
    dueDate: day(r.dueDate),
    paymentStatus: r.paymentStatus ?? undefined,
});

const PaymentsEdit = () => {
    const back = useBack();
    const go = useGo();
    const { mutate: deletePayment, mutation } = useDelete();
    const deleting = mutation.isPending;

    const form = useForm<BaseRecord, HttpError, PaymentEditValues>({
        resolver: zodResolver(paymentEditSchema),
        refineCoreProps: {
            resource: "payments",
            action: "edit", // Refine reads the id from the URL
        },
    });

    // Load the saved payment into the form once it arrives.
    // Deferred with setTimeout so it runs after Refine's own reset (which uses the raw record with nulls).
    const { reset } = form;
    const record = form.refineCore.query?.data?.data;
    useEffect(() => {
        if (!record) return;
        const t = setTimeout(() => reset(toFormValues(record) as PaymentEditValues), 0);
        return () => clearTimeout(t);
    }, [record, reset]);

    const paymentId = form.refineCore.id;
    const onDelete = () => {
        if (!paymentId) return;
        const ok = window.confirm(
            "Delete this payment? It will disappear from your payments list. This can't be undone from the app." +
            "If you would like the reccuring payemnts to continue working, please create a new payment for this athlete",
        );
        if (!ok) return;
        deletePayment(
            { resource: "payments", id: paymentId },
            { onSuccess: () => go({ to: { resource: "payments", action: "list" } }) },
        );
    };

    const onSubmit = async (values: PaymentEditValues) => {
        await form.refineCore.onFinish(values);
    };

    return (
        <EditView className="class-view">
            <div className="my-4 flex items-center justify-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold">Payment Form</CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Athlete</label>
                                    <Input value={text(record?.athleteName)} disabled readOnly />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    To change the athlete, delete this payment and add a new one.
                                </p>

                                <Separator />
                                <h3 className="text-lg font-semibold pt-2">Payment Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="dueDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Due Date <span className="text-orange-500">*</span></FormLabel>
                                                <DatePicker value={field.value} onChange={field.onChange} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="paymentStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status <span className="text-orange-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {STATUS_OPTIONS.map((opt) => (
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
                                        Delete payment
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

export default PaymentsEdit;