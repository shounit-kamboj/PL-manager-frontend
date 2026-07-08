import React, {useMemo, useState} from 'react';
import {ListView} from "@/components/refine-ui/views/list-view.tsx"
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx"
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {AthleteCompetition} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {ArrowUpDown, ExternalLink, Search} from "lucide-react";
import {EditButton} from "@/components/refine-ui/buttons/edit.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

const SORTOPTIONS = [
    { field: 'id',                     order: 'desc' as const, label: 'Default' },
    { field: 'date',  order: 'asc'  as const, label: 'Comp Date ↑' },
    { field: 'date',  order: 'desc' as const, label: 'Comp Date ↓' },
];

const AthleteCompetitionsList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortIndex, setSortIndex] = useState(0);
    const currentSort = SORTOPTIONS[sortIndex];

    const searchFilters = searchQuery ? [
        {field: 'name', operator: 'contains' as const, value: searchQuery}
    ]:[];



    const athleteCompetitionTable = useTable<AthleteCompetition>({
        columns: useMemo<ColumnDef<AthleteCompetition>[]>(() => [
            {
                id: 'name',
                accessorKey: 'athlete.name',
                size: 100,
                header: () => <p className='column-title'>Athlete</p>,
                cell: ({row}) => (
                    <span className="text-foreground">
                        {row.original.athlete?.name ?? '-'}
                    </span>
                ),
                filterFn: 'includesString' as const
            },
            {
                id: 'compName',
                accessorKey: 'competition.name',
                size: 180,
                header: () => <p className='column-title'>Competition</p>,
                cell: ({row}) => (
                    <span className="text-foreground">
                        {row.original.competition?.name ?? '-'}
                    </span>
                ),
                filterFn: 'includesString' as const
            },
            {
                id: 'date',
                accessorKey: 'date',
                size: 120,
                header: () => <p className='column-title'>Date</p>,
                cell: ({getValue}) => (
                    <span className="text-foreground">
                        {getValue<string>() ?? '-'}
                    </span>
                ),
            },
            {
                id: 'weighInTime',
                accessorKey: 'weighInTime',
                size: 100,
                header: () => <p className='column-title'>Weigh In Time</p>,
                cell: ({getValue}) => (
                    <span className="text-foreground">
                        {getValue<string>() ?? '-'}
                    </span>
                ),
            },
            {
                id: 'startTime',
                accessorKey: 'startTime',
                size: 100,
                header: () => <p className='column-title'>Start Time</p>,
                cell: ({getValue}) => (
                    <span className="text-foreground">
                        {getValue<string>() ?? '-'}
                    </span>
                ),
            },

            {
                id: 'website',
                accessorKey: 'competition.url',
                size: 60,
                header: () => <p className='column-title'>Website</p>,
                cell: ({row}) => {
                    const url = row.original.competition?.url;
                    if (!url) return <span className="text-muted-foreground">-</span>;
                    return (
                        <a href={url} target="_blank" rel="noreferrer" className="text-primary flex items-center gap-1">
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    );
                },
            },
            {
                id: 'actions',
                size: 20,
                header: () => <p className='column-title'>Edit</p>,
                cell: ({row}) => (
                    <EditButton recordItemId={row.original.id} />
                ),
            },
        ], []),
        refineCoreProps: {
            resource: 'athlete-competitions',
            pagination: {pageSize: 20, mode: 'server'},
            filters: {
                permanent: [...searchFilters]
            },
            sorters: {
                permanent: [{ field: currentSort.field, order: currentSort.order }]
            }
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">My Athlete Competitions</h1>
            <div className="intro-row">
                <div className="action-row">
                    <div className="search-field">
                        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none"/>
                        <input
                            type="text"
                            placeholder="Search by Athlete Name"
                            className="pl-10 w-full"
                            value={searchQuery} //takes value from searchQ
                            onChange={(e) => setSearchQuery(e.target.value)} //on chnage  it sets searchq to new val
                        />
                    </div>
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
            <DataTable table={athleteCompetitionTable} />
        </ListView>
    );
};

export default AthleteCompetitionsList;