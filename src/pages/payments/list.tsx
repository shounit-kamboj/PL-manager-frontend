import React, {useMemo, useState} from 'react';
import {ListView} from "@/components/refine-ui/views/list-view.tsx"
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx"
import {ArrowUpDown, Search} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {EditButton} from "@/components/refine-ui/buttons/edit.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {Payment} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import { isOverdue } from '@/lib/isOverdue';
import {format} from "date-fns";

const SORTOPTIONS = [
    { field: 'id',       order: 'desc' as const, label: 'Default' },
    { field: 'dueDate',  order: 'asc'  as const, label: 'Due Date ↑' },
    { field: 'dueDate',  order: 'desc' as const, label: 'Due Date ↓' },
];

const PaymentsList = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPaymentStatus, setselectedPaymentStatus] = useState("all");
    const [selectedCurrentStatus, setselectedCurrentStatus] = useState("current");

    const searchFilters = searchQuery ? [
        {field: 'search', operator: 'contains' as const, value: searchQuery}
    ]:[];

    const paymentStatusFilter = selectedPaymentStatus === "all" ? [] :
        [
            {field: "paymentStatus", operator: "eq" as const, value: selectedPaymentStatus},
        ];

    const currentStatusFilter = selectedCurrentStatus === "all" ? [] :
        [
            {field: 'isCurrent', operator: 'eq' as const, value: selectedCurrentStatus === 'current'},
        ];

    const [sortIndex, setSortIndex] = useState(0);
    const currentSort = SORTOPTIONS[sortIndex];

    const paymentTable = useTable<Payment>({
        columns:useMemo<ColumnDef<Payment>[]>(() => [
            {
                id: 'athleteName',
                accessorKey: 'athleteName',
                size:100,
                header: () => <p className='column-title'>Athlete</p>,
                cell: ({getValue}) =>
                    <span className="text-foreground">
                        {getValue<string>() ?? '—'}
                    </span>,
                filterFn: 'includesString' as const
            },
            {
                id: 'amount',
                accessorKey: 'amount',
                size: 70,
                header: () => <p className='column-title'>Amount</p>,
                cell: ({getValue}) => {
                    const value = getValue<string | null>();
                    return (
                        <span className="text-foreground">
                            {value ? `$ ${value}` : '—'}
                        </span>
                    );
                },
            },
            {
                id: 'dueDate',
                accessorKey: 'dueDate',
                size: 90,
                header: () => <p className='column-title'>Due Date</p>,
                cell: ({row}) => (
                    <span className={isOverdue(row.original) ? "text-destructive" : "text-foreground"}>
                        {row.original.dueDate
                            ? format(new Date(row.original.dueDate), 'MMM d, yyyy')
                            : '—'}
                    </span>
                ),
            },
            {
                id: 'paymentStatus',
                accessorKey: 'paymentStatus',
                size: 80,
                header: () => <p className='column-title'>Status</p>,
                cell: ({row}) => {
                    const status = row.original.paymentStatus;
                    const variant = isOverdue(row.original)
                        ? 'destructive'
                        : status === 'unpaid'
                            ? 'outline'
                            : 'secondary';
                    return (
                        <Badge variant={variant}>
                            {status ?? '—'}
                        </Badge>
                    );
                },
            },
            {
                id: 'isCurrent',
                accessorKey: 'isCurrent',
                size: 60,
                header: () => <p className='column-title'>Payment Cycle</p>,
                cell: ({getValue}) => (
                    <Badge variant="outline">
                        {getValue<boolean>() ? 'Current' : 'Past'}
                    </Badge>
                ),
            },
            {
                id: 'actions',
                size: 35,
                header: () => <p className='column-title'></p>,
                cell: ({row}) => (
                    <EditButton recordItemId={row.original.id} variant="link" />
                ),
            },

        ],[]),
        refineCoreProps: {
            resource: 'payments',
            pagination:{pageSize:20,mode:'server'},
            filters: {
                permanent: [...searchFilters, ...paymentStatusFilter, ...currentStatusFilter]
            },
            sorters: {
                permanent: [{ field: currentSort.field, order: currentSort.order }]
            }
        }
    });
    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Payments</h1>
            <div className="intro-row">
                <div className="action-row">
                    <div className="search-field">
                        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none"/>
                        <input
                            type="text"
                            placeholder="Search by Athlete Name"
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={selectedCurrentStatus} onValueChange={setselectedCurrentStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Current or Past" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="current">Current</SelectItem>
                                <SelectItem value="past">Past</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedPaymentStatus} onValueChange={setselectedPaymentStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Payment Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Payment Status</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="unpaid">Unpaid</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                                <SelectItem value="paid late">Paid Late</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className='flex gap-2 w-full sm:w-auto'>
                            <Select
                                value={String(sortIndex)}
                                onValueChange={(val) => setSortIndex(Number(val))}
                            >
                                <SelectTrigger>
                                    <ArrowUpDown className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    {SORTOPTIONS.map((option, index) => (
                                        <SelectItem key={index} value={String(index)}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <CreateButton />
                        </div>
                    </div>
                </div>
            </div>
            <DataTable table={paymentTable} />
        </ListView>
    );
};

export default PaymentsList;