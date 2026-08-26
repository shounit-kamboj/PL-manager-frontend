import React, {useMemo, useState} from 'react';
import {ListView} from "@/components/refine-ui/views/list-view.tsx"
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx"
import {ArrowUpDown, Search} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {EditButton} from "@/components/refine-ui/buttons/edit.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {TrainingBlock} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {getNextUpdateDate} from "@/lib/nextUpdateDate.ts";
import {format} from "date-fns";

const SORTOPTIONS = [
    { field: 'id',           order: 'desc' as const, label: 'Default' },
    { field: 'startDate',    order: 'asc'  as const, label: 'Start Date ↑' },
    { field: 'startDate',    order: 'desc' as const, label: 'Start Date ↓' },
    { field: 'endDate',      order: 'asc'  as const, label: 'End Date ↑' },
    { field: 'endDate',      order: 'desc' as const, label: 'End Date ↓' },
    { field: 'lastUpdate',   order: 'asc'  as const, label: 'Last Update ↑' },
    { field: 'lastUpdate',   order: 'desc' as const, label: 'Last Update ↓' },
    { field: 'nextUpdate',   order: 'asc'  as const, label: 'Next Update ↑' },
    { field: 'nextUpdate',   order: 'desc' as const, label: 'Next Update ↓' },
];

const TrainingBlockList = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCurrentStatus, setselectedCurrentStatus] = useState<'current' | 'past'>("current");

    const searchFilters = searchQuery ? [
        {field: 'search', operator: 'contains' as const, value: searchQuery}
    ]:[];

    const currentStatusFilter = [
        {field: 'isCurrent', operator: 'eq' as const, value: selectedCurrentStatus === 'current'},
    ];

    const [sortIndex, setSortIndex] = useState(0);
    const currentSort = SORTOPTIONS[sortIndex];

    const trainingBlockTable = useTable<TrainingBlock>({
        columns:useMemo<ColumnDef<TrainingBlock>[]>(() => [
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
                id: 'startDate',
                accessorKey: 'startDate',
                size: 90,
                header: () => <p className='column-title'>Start Date</p>,
                cell: ({getValue}) => {
                    const value = getValue<string>();
                    return (
                        <span className="text-foreground">
                            {value ? format(new Date(value), 'MMM d, yyyy') : '—'}
                        </span>
                    );
                },
            },
            {
                id: 'endDate',
                accessorKey: 'endDate',
                size: 90,
                header: () => <p className='column-title'>End Date</p>,
                cell: ({getValue}) => {
                    const value = getValue<string>();
                    return (
                        <span className="text-foreground">
                            {value ? format(new Date(value), 'MMM d, yyyy') : '—'}
                        </span>
                    );
                },
            },
            {
                id: 'lastUpdate',
                accessorKey: 'lastUpdate',
                size: 90,
                header: () => <p className='column-title'>Last Update</p>,
                cell: ({getValue}) => {
                    const value = getValue<string>();
                    return (
                        <span className="text-foreground">
                            {value ? format(new Date(value), 'MMM d, yyyy') : '—'}
                        </span>
                    );
                },
            },
            {
                id: 'nextUpdate',
                size: 90,
                header: () => <p className='column-title'>Next Update</p>,
                cell: ({row}) => {
                    const block = row.original;
                    if (!block.lastUpdate || !block.daysBetweenUpdates) return <span className="text-muted-foreground">—</span>;
                    return (
                        <span className="text-foreground">
                            {getNextUpdateDate(block.lastUpdate, block.daysBetweenUpdates)}
                        </span>
                    );
                },
            },
            {
                id: 'actions',
                size: 45,
                header: () => <p className='column-title'></p>,
                cell: ({row}) => (
                    <EditButton recordItemId={row.original.id} variant="link" />
                ),
            },

        ],[]),
        refineCoreProps: {
            resource: 'training-blocks',
            pagination:{pageSize:20,mode:'server'},
            filters: {
                permanent: [...searchFilters, ...currentStatusFilter]
            },
            sorters: {
                permanent: [{ field: currentSort.field, order: currentSort.order }]
            }
        }
    });
    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Training Blocks</h1>
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
                        <Select value={selectedCurrentStatus} onValueChange={(val) => setselectedCurrentStatus(val as 'current' | 'past')}>
                            <SelectTrigger>
                                <SelectValue placeholder="Current or Past" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="current">Current</SelectItem>
                                <SelectItem value="past">Past</SelectItem>
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
            <DataTable table={trainingBlockTable} />
        </ListView>
    );
};

export default TrainingBlockList;