import React from 'react';
import {CreateView} from "@/components/refine-ui/views/create-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {useBack} from "@refinedev/core";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {athleteSchema} from "@/lib/schema.ts";
import * as z from "zod";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {WEIGHTCLASSES_OPTIONS, TIMEZONE_OPTIONS} from "@/constants";

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

const AthletesCreate = () => {
    const back = useBack();
    const form = useForm({
        resolver: zodResolver(athleteSchema),
        refineCoreProps:{
          resource: 'athletes',
          action: 'create'
        },
        defaultValues:{
            name: "",
            email: "",
            gender: undefined,
            weightClass: undefined,
            dateOfBirth: "",
            phoneNumber: "",
            country: "",
            city: "",
            province: "",
            timezone: "",
            equipment: undefined,
            paymentPrice: undefined,
            paymentCycleLengthWeeks: undefined,
            prSquat: undefined,
            prBench: undefined,
            prDeadlift: undefined,
            prTotal: undefined,
            meetPrSquat: undefined,
            meetPrBench: undefined,
            meetPrDeadlift: undefined,
            meetPrTotal: undefined,
            notes: "",
            link: "",
            joinedAt: new Date().toISOString().split('T')[0],
        },
    })

    const  onSubmit = (values: z.infer<typeof athleteSchema>) => {
        try{
            console.log(values);
        }
        catch(e){
            console.log(e);
        }
    }
    return (
        <CreateView className="class-view">
            <Breadcrumb/>
            <h1>Create New Athlete</h1>

            <div className='intro-row'>
                <p>Please provide the required information to add a new athlete to your roster</p>
                <Button onClick={back}>Go Back</Button>
            </div>

            <Separator/>


            <div className='my-4 flex items-center'>
                <Card className='class-form-card'>
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold">Athlete Form</CardTitle>
                    </CardHeader>

                    <Separator/>

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Personal Info */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
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
                                            <FormItem>
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
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
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
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
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
                                    <FormField
                                        control={form.control}
                                        name="timezone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Timezone</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Timezone" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {TIMEZONE_OPTIONS.map((opt) => (
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
                                                    <Input type="number" step="0.5" placeholder="0.00" {...field} />
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
                                                    <Input type="number" placeholder="4" {...field} />
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
                                                    <Input type="number" step="0.5" placeholder="0" {...field} />
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
                                                    <Input type="number" step="0.5" placeholder="0" {...field} />
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
                                                    <Input type="number" step="0.5" placeholder="0" {...field} />
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
                                                    <Input type="number" step="0.5" placeholder="0" {...field} />
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
                                                    <Input type="number" step="0.5" placeholder="0" {...field} />
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
                                                    <Input type="number" step="0.5" placeholder="0" {...field} />
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
                                                    <Input type="number" step="0.5" placeholder="0" {...field} />
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
                                                    <Input type="number" step="0.5" placeholder="0" {...field} />
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
                                                <FormLabel>Training Progam Link (sheets, excel etc)</FormLabel>
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
                                                        className="min-h-[100px]"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button type="button" variant="outline" onClick={back}>Cancel</Button>
                                    <Button type="submit">Create Athlete</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>

                </Card>

            </div>

        </CreateView>
    );
};

export default AthletesCreate;