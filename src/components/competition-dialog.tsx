import { useEffect, useRef, useState } from "react";
import { useCreate, useDelete, useUpdate } from "@refinedev/core";
import type { BaseRecord } from "@refinedev/core";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FEDS_OPTIONS } from "@/constants";

const EMPTY = { name: "", startDate: "", endDate: "", city: "", province: "", country: "", federation: "", link: "" };
type CompForm = typeof EMPTY;

const text = (v: unknown) => (v == null ? "" : String(v));
const day = (v: unknown) => (v ? String(v).slice(0, 10) : "");

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    competition?: BaseRecord | null // pass one to edit it, leave out to create
    onSaved?: (saved: BaseRecord) => void | Promise<void>;
};

export const CompetitionDialog = ({ open, onOpenChange, competition, onSaved }: Props) => {
    const isEdit = !!competition;
    const [values, setValues] = useState<CompForm>(EMPTY);
    const [error, setError] = useState("");

    const { mutate: createComp, mutation: createMutation } = useCreate();
    const { mutate: updateComp, mutation: updateMutation } = useUpdate();
    const { mutate: deleteComp, mutation: deleteMutation } = useDelete();
    const busy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

    // Fill the form each time the dialog opens. Reads the latest competition through a ref so a background
    // refetch of the list can't wipe what the coach is typing.
    const competitionRef = useRef(competition);
    competitionRef.current = competition;
    useEffect(() => {
        if (!open) return;
        setError("");
        const c = competitionRef.current;
        setValues(
            c
                ? {
                    name: text(c.name),
                    startDate: day(c.startDate),
                    endDate: day(c.endDate),
                    city: text(c.city),
                    province: text(c.province),
                    country: text(c.country),
                    federation: text(c.federation),
                    link: text(c.link),
                }
                : EMPTY,
        );
    }, [open]);

    const todayLocal = new Date().toLocaleDateString("en-CA"); // yyyy-mm-dd in the coach's timezone
    const endMin = values.startDate && values.startDate > todayLocal ? values.startDate : todayLocal;

    const setField = (key: keyof CompForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setValues((prev) => ({ ...prev, [key]: e.target.value }));

    const onSubmit = () => {
        const name = values.name.trim();
        if (!name || !values.startDate || !values.endDate) {
            setError("Name, start date and end date are required");
            return;
        }
        if (values.endDate < values.startDate) {
            setError("End date can't be before the start date");
            return;
        }
        setError("");

        const payload = {
            name,
            startDate: values.startDate,
            endDate: values.endDate,
            city: values.city,
            province: values.province,
            country: values.country,
            federation: values.federation,
            link: values.link.trim(),
        };

        const done = async (res: { data: BaseRecord }) => {
            await onSaved?.(res.data);
            onOpenChange(false);
        };

        if (competition) {
            if (competition.id == null) return;
            updateComp({ resource: "competitions", id: competition.id, values: payload }, { onSuccess: done });
        } else {
            createComp({ resource: "competitions", values: payload }, { onSuccess: done });
        }
    };

    const onDelete = () => {
        if (!competition || competition.id == null) return;
        const ok = window.confirm(
            "Delete this custom competition? It will disappear from your list. " +
            "You can't delete it while meet entries still use it.",
        );
        if (!ok) return;
        deleteComp(
            { resource: "competitions", id: competition.id },
            { onSuccess: () => onOpenChange(false) },
        );
    };

    // Deliberately no <form> element: Enter in a field can't submit a form behind the dialog.
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit custom competition" : "Add custom competition"}</DialogTitle>
                    <DialogDescription>Only you will see this competition.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name <span className="text-orange-500">*</span></label>
                        <Input placeholder="Competition name" value={values.name} onChange={setField("name")} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Start date <span className="text-orange-500">*</span></label>
                            <Input type="date" value={values.startDate} onChange={setField("startDate")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">End date <span className="text-orange-500">*</span></label>
                            <Input type="date" min={endMin} value={values.endDate} onChange={setField("endDate")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">City</label>
                            <Input value={values.city} onChange={setField("city")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Province/State</label>
                            <Input value={values.province} onChange={setField("province")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Country</label>
                            <Input value={values.country} onChange={setField("country")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Federation</label>
                            <Select
                                value={values.federation || "none"}
                                onValueChange={(v) => setValues((prev) => ({ ...prev, federation: v === "none" ? "" : v }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select federation" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    {FEDS_OPTIONS.map((f) => (
                                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Website</label>
                            <Input placeholder="https://..." value={values.link} onChange={setField("link")} />
                        </div>
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                </div>

                <DialogFooter className="sm:justify-between">
                    {isEdit ? (
                        <Button type="button" variant="destructive" onClick={onDelete} disabled={busy}>
                            Delete
                        </Button>
                    ) : (
                        <span />
                    )}
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="button" onClick={onSubmit} disabled={busy}>
                            {isEdit ? "Save changes" : "Create competition"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};