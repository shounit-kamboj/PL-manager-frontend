import { CreateView } from "@/components/refine-ui/views/create-view.tsx";
import { useBack, useSelect } from "@refinedev/core";
import type { BaseRecord, HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { trainingBlockSchema } from "@/lib/schema.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";


type ResourceFormValues = z.input<typeof trainingBlockSchema>;

const TrainingBlockCreate = () => {
    const back = useBack();

    const form = useForm<BaseRecord, HttpError, ResourceFormValues>({
        resolver: zodResolver(trainingBlockSchema),
        refineCoreProps: {
            resource: "training-blocks",
            action: "create",
        },
        defaultValues: {
            isCurrent: true,
        },
    });

    const { options: relatedOptions } = useSelect({
        resource: "athletes",
        optionLabel: (r: BaseRecord) => String(r.name),
        optionValue: (r: BaseRecord) => String(r.id),
        pagination: { pageSize: 100 },
    });

    const onSubmit = async (values: ResourceFormValues) => {
        await form.refineCore.onFinish({
            ...values,
            today: format(new Date(), "yyyy-MM-dd"),
        } as ResourceFormValues);
    };
    return (
        <CreateView className="class-view">
            <div className="my-4 flex items-center justify-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold">Block Form</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Select field (foreign key) */}
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
                                                        {relatedOptions.map((opt) => (
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

                                    {/* Text / date / number input field */}
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
                                                <FormLabel>Start Date<span className="text-orange-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="Date" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Date<span className="text-orange-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="Date" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />



                                    <FormField
                                        control={form.control}
                                        name="lastUpdate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last Update Date<span className="text-orange-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input type="Date" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="daysBetweenUpdates"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Days Between Block Updates<span className="text-orange-500">*</span></FormLabel>
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
                                                    <Input type="text"
                                                           placeholder="Sheets/excel Link"
                                                           className="placeholder:text-input"
                                                           {...field}
                                                           value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="outline" onClick={back}>Cancel</Button>
                                    <Button type="submit">Create</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    );
};

export default TrainingBlockCreate;