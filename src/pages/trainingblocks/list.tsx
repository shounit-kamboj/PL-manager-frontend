import React, {useMemo, useState} from 'react';
import {ListView} from "@/components/refine-ui/views/list-view.tsx"
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx"
import {ArrowUpDown, ExternalLink, Search} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {EditButton} from "@/components/refine-ui/buttons/edit.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {TrainingBlock} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {getNextUpdateDate} from "@/lib/nextUpdateDate.ts";
import {formatDay, localTodayYmd} from "@/lib/dates.ts";

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

type BlockStatus = 'current' | 'upcoming' | 'past';

const TrainingBlockList = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCurrentStatus, setselectedCurrentStatus] = useState<BlockStatus>("current");
    const [selectedAutoRenew, setSelectedAutoRenew] = useState("all");

    const searchFilters = searchQuery ? [
        {field: 'search', operator: 'contains' as const, value: searchQuery}
    ]:[];

    // the coach's own date, so "current" and "past" follow their day and not the server's
    const today = localTodayYmd();

    // status is worked out from the block's dates on the server; it needs today to compare against
    const currentStatusFilter = [
        {field: 'status', operator: 'eq' as const, value: selectedCurrentStatus},
        {field: 'today', operator: 'eq' as const, value: today},
    ];
    const autoRenewFilter = selectedAutoRenew === "all" ? [] :
        [
            {field: 'createNextAutomatically', operator: 'eq' as const, value: selectedAutoRenew === 'on'},
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
                id: 'name',
                accessorKey: 'name',
                size: 100,
                header: () => <p className='column-title'>Block Name</p>,
                cell: ({getValue}) =>
                    <span className="text-foreground">
                        {getValue<string>() || '—'}
                    </span>,
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
                            {value ? formatDay(value, 'MMM d, yyyy') : '—'}
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
                            {value ? formatDay(value, 'MMM d, yyyy') : '—'}
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
                            {value ? formatDay(value, 'MMM d, yyyy') : '—'}
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
                    // a block is over on its end date (that is the day the next one starts)
                    const hasEnded = String(block.endDate).slice(0, 10) <= today;
                    if (!block.lastUpdate || !block.daysBetweenUpdates || hasEnded) return <span className="text-muted-foreground">—</span>;
                    return (
                        <span className="text-foreground">
                            {getNextUpdateDate(block.lastUpdate, block.daysBetweenUpdates)}
                        </span>
                    );
                },
            },
            {
                id: 'website',
                accessorKey: 'trainingBlock.link',
                size: 60,
                header: () => <p className='column-title'>Program</p>,
                cell: ({row}) => {
                    const link = row.original.link;
                    if (!link) return <span className="text-muted-foreground">-</span>;
                    return (
                        <a href={link} target="_blank" rel="noreferrer" className="text-primary flex items-center gap-1">
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    );
                },
            },
            {
                id: 'actions',
                size: 30,
                header: () => <p className='column-title'></p>,
                cell: ({row}) => (
                    <EditButton recordItemId={row.original.id} variant="link" />
                ),
            },

        ],[today]),
        refineCoreProps: {
            resource: 'training-blocks',
            pagination:{pageSize:20,mode:'server'},
            filters: {
                permanent: [...searchFilters, ...currentStatusFilter, ...autoRenewFilter]
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
                            placeholder="Search by Athlete or Block Name"
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={selectedCurrentStatus} onValueChange={(val) => setselectedCurrentStatus(val as BlockStatus)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="current">Current</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="past">Past</SelectItem>
                            </SelectContent>
                        </Select>


                        <Select value={selectedAutoRenew} onValueChange={setSelectedAutoRenew}>
                            <SelectTrigger>
                                <SelectValue placeholder="Auto-renew" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Auto create next status: All</SelectItem>
                                <SelectItem value="on">Auto create next: On</SelectItem>
                                <SelectItem value="off">Auto create next: Off</SelectItem>
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