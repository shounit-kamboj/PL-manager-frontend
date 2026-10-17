import { CreateView } from "@/components/refine-ui/views/create-view.tsx";
import { useBack, useSelect } from "@refinedev/core";
import type { BaseRecord, HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { paymentSchema } from "@/lib/schema.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type PaymentFormValues = z.input<typeof paymentSchema>;

const PaymentsCreate = () => {
    const back = useBack();

    const form = useForm<BaseRecord, HttpError, PaymentFormValues>({
        resolver: zodResolver(paymentSchema),
        refineCoreProps: {
            resource: "payments",
            action: "create",
        },
        defaultValues: {
            paymentStatus: "unpaid",
            isCurrent: true,
        },
    });

    const { options: athleteOptions } = useSelect({
        resource: "athletes",
        optionLabel: (a: BaseRecord) => String(a.name),
        optionValue: (a: BaseRecord) => String(a.id),
        pagination: { pageSize: 100 },
    });

    const onSubmit = async (values: PaymentFormValues) => {
        await form.refineCore.onFinish(values);
    };

    return (

        <CreateView className="class-view">

            <div className="my-4 flex items-center justify-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold">Payment Form</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="athleteId"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Athlete <span className="text-orange-500">*</span></FormLabel>
                                                <Select
                                                    onValueChange={(v) => field.onChange(Number(v))}
                                                    value={field.value ? String(field.value) : ""}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
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
                                        name="dueDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Due Date <span className="text-orange-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="outline" onClick={back}>Cancel</Button>
                                    <Button type="submit">Add payment</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

        </CreateView>
    );
};

export default PaymentsCreate;