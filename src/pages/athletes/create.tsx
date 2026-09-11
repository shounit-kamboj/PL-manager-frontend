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
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter your name" {...field} />
                                            </FormControl>
                                            <FormDescription>descrip</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Submit</Button>

                            </form>
                        </Form>
                    </CardContent>

                </Card>

            </div>

        </CreateView>
    );
};

export default AthletesCreate;