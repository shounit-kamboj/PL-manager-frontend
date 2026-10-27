import { useEffect } from "react";
import { EditView } from "@/components/refine-ui/views/edit-view.tsx";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb.tsx";
import { useBack, useDelete, useGo } from "@refinedev/core";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { useForm } from "@refinedev/react-hook-form";
import type { BaseRecord, HttpError } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { athleteSchema } from "@/lib/schema.ts";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { WEIGHTCLASSES_OPTIONS, TIMEZONE_OPTIONS } from "@/constants";

type AthleteFormValues = z.infer<typeof athleteSchema>;

const GENDER_OPTIONS = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-binary", value: "non-binary" },
    { label: "Prefer not to say", value: "prefer-not-to-say" },
];

const EQUIPMENT_OPTIONS = [
    { label: "Classic/Raw", value: "Classic/Raw" },
    { label: "Equipped", value: "Equipped" },
    { label: "Both", value: "both" },
];

const STATUS_OPTIONS = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

// DB record -> form values. null becomes "" for text, undefined for numbers,
// and ISO dates are cut down to yyyy-mm-dd for <input type="date">.
const text = (v: unknown) => (v == null ? "" : String(v));
const num = (v: unknown) => (v == null || v === "" ? undefined : Number(v));
const day = (v: unknown) => (v ? String(v).slice(0, 10) : "");

const toFormValues = (a: BaseRecord) => ({
    name: text(a.name),
    email: text(a.email),
    phoneNumber: text(a.phoneNumber),
    gender: a.gender ?? undefined,
    dateOfBirth: day(a.dateOfBirth),
    joinedAt: day(a.joinedAt),
    country: text(a.country),
    province: text(a.province),
    city: text(a.city),
    timezone: text(a.timezone),
    weightClass: a.weightClass ?? undefined,
    equipment: a.equipment ?? undefined,
    paymentPrice: num(a.paymentPrice),
    paymentCycleLengthWeeks: num(a.paymentCycleLengthWeeks),
    prSquat: num(a.prSquat),
    prBench: num(a.prBench),
    prDeadlift: num(a.prDeadlift),
    prTotal: num(a.prTotal),
    meetPrSquat: num(a.meetPrSquat),
    meetPrBench: num(a.meetPrBench),
    meetPrDeadlift: num(a.meetPrDeadlift),
    meetPrTotal: num(a.meetPrTotal),
    link: text(a.link),
    notes: text(a.notes),
    isActive: a.isActive ?? true,
});

const AthletesEdit = () => {
    const form = useForm<BaseRecord, HttpError, AthleteFormValues>({
        resolver: zodResolver(athleteSchema),
        refineCoreProps: {
            resource: "athletes",
            action: "edit",
        },
    });

    const back = useBack();
    const go = useGo();
    const { mutate: deleteAthlete, mutation } = useDelete();
    const deleting = mutation.isPending;
    const athleteId = form.refineCore.id;

    const onDelete = () => {
        if (!athleteId) return;
        const ok = window.confirm(
            "Delete this athlete? They will be removed from your roster, and their payments, training block and meets will be hidden."
        );
        if (!ok) return;
        deleteAthlete(
            { resource: "athletes", id: athleteId },
            { onSuccess: () => go({ to: { resource: "athletes", action: "list" } }) },
        );
    };

    // Load the saved athlete into the form once it arrives.
    // Deferred with setTimeout so it runs after Refine's own reset (which uses the raw record with nulls).
    const { reset } = form;
    const record = form.refineCore.query?.data?.data;
    useEffect(() => {
        if (!record) return;
        const t = setTimeout(() => reset(toFormValues(record) as AthleteFormValues), 0);
        return () => clearTimeout(t);
    }, [record, reset]);

    const onSubmit = async (values: AthleteFormValues) => {
        await form.refineCore.onFinish(values);
    };

    return (
        <EditView className="class-view">
            <div className="my-4 flex items-center justify-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold">Edit Athlete</CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Personal Info */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2 lg:col-span-3">
                                                <FormLabel>Name <span className="text-orange-500">*</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Athlete Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="md:col-span-2 lg:col-span-3">
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="email@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Phone Number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gender <span className="text-orange-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Gender" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {GENDER_OPTIONS.map((opt) => (
                                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dateOfBirth"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date of Birth <span className="text-orange-500">*</span></FormLabel>
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    yearRange={{ from: 1920, to: new Date().getFullYear() }}
                                                    disabled={(d) => d > new Date()}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="joinedAt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Joined At <span className="text-orange-500">*</span></FormLabel>
                                                <DatePicker value={field.value} onChange={field.onChange} />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <Select
                                                    onValueChange={(v) => field.onChange(v === "active")}
                                                    value={field.value === false ? "inactive" : "active"}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
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

                                <Separator />
                                <h3 className="text-lg font-semibold">Location</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Country</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Country" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="province"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Province/State</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Province" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="City" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />
                                <h3 className="text-lg font-semibold">Training & Equipment</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="weightClass"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Weight Class <span className="text-orange-500">*</span></FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Weight Class" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {WEIGHTCLASSES_OPTIONS.map((opt) => (
                                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="equipment"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Equipment Preference</FormLabel>
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

                                <Separator />
                                <h3 className="text-lg font-semibold">Payment Details</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="paymentPrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Payment Price ($)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" placeholder="0.00" min="0" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="paymentCycleLengthWeeks"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Payment Cycle (Weeks)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="4" min="0" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />
                                <h3 className="text-lg font-semibold">Gym Personal Bests (kg)</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="prSquat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Squat</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.5" placeholder="0" min="0" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="prBench"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bench</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.5" placeholder="0" min="0" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="prDeadlift"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Deadlift</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.5" placeholder="0" min="0" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="prTotal"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Total</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.5" placeholder="0" min="0" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />
                                <h3 className="text-lg font-semibold">Meet Personal Bests (kg)</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="meetPrSquat"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Squat</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.5" placeholder="0" min="0" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="meetPrBench"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bench</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.5" placeholder="0" min="0" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="meetPrDeadlift"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Deadlift</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.5" placeholder="0" min="0" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="meetPrTotal"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Total</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.5" placeholder="0" min="0" {...field} value={field.value ?? ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Separator />
                                <div className="grid grid-cols-1 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="link"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Athlete page Link (openipf, arenapl, etc)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Any additional information about the athlete..."
                                                        className="min-h-25"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="destructive" onClick={onDelete} disabled={deleting}>
                                        Delete athlete
                                    </Button>
                                    <Button type="button" variant="outline" onClick={back}>Cancel</Button>
                                    <Button type="submit">Save changes</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </EditView>
    );
};

export default AthletesEdit;