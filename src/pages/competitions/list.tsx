import React, {useMemo, useState} from 'react';
import {ListView} from "@/components/refine-ui/views/list-view.tsx"
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx"
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {Competition} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {ArrowUpDown, ExternalLink, Search} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {format, parseISO} from "date-fns";
import {FEDS_OPTIONS} from "@/constants";

const SORTOPTIONS = [
    { field: 'id',                     order: 'desc' as const, label: 'Default' },
    { field: 'startDate',  order: 'asc'  as const, label: 'Comp Start Date ↑' },
    { field: 'startDate',  order: 'desc' as const, label: 'Comp Start Date ↓' },
];

const UpcomingCompetitionsList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortIndex, setSortIndex] = useState(0);
    const currentSort = SORTOPTIONS[sortIndex];
    const[selectedFed, setselectedFed] = useState("all");


    const searchFilters = searchQuery ? [
        {field: 'search', operator: 'contains' as const, value: searchQuery}
    ]:[];


    const fedFilters = selectedFed === 'all' ? []:
        [
            {field: 'federation', operator: 'eq' as const, value: selectedFed}
        ];

    const competitionTable = useTable<Competition>({
        columns: useMemo<ColumnDef<Competition>[]>(() => [
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className='column-title'>Meet Name</p>,
                cell: ({getValue}) => (
                    <span className="text-foreground">
                        {getValue<string>()}
                    </span>
                ),
                filterFn: 'includesString' as const
            },
            {
                id: 'startdate',
                accessorKey: 'startDate',
                size: 120,
                header: () => <p className='column-title'>Start Date</p>,
                cell: ({getValue}) => {
                    const rawDate = getValue<string>();
                    if (!rawDate) return <span className="text-foreground">-</span>;
                    const formattedDate = format(parseISO(rawDate), 'MMM d, yyyy');
                    return (
                        <span className="text-foreground">
                            {formattedDate}
                        </span>
                    );
                },
            },
            {
                id: 'enddate',
                accessorKey: 'endDate',
                size: 120,
                header: () => <p className='column-title'>End Date</p>,
                cell: ({getValue}) => {
                    const rawDate = getValue<string>();
                    if (!rawDate) return <span className="text-foreground">-</span>;
                    const formattedDate = format(parseISO(rawDate), 'MMM d, yyyy');
                    return (
                        <span className="text-foreground">
                            {formattedDate}
                        </span>
                    );
                },
            },
            {
                id: 'location',
                accessorKey: 'location',
                size: 150,
                header: () => <p className='column-title'>Location</p>,
                cell: ({getValue}) => (
                    <span className="text-foreground">
                        {getValue<string>() ?? '-'}
                    </span>
                ),
            },
            {
                id: 'federation',
                accessorKey: 'federation',
                size: 100,
                header: () => <p className='column-title'>Federation</p>,
                cell: ({getValue}) => (
                    <Badge variant="secondary">
                        {getValue<string>() ?? '-'}
                    </Badge>
                ),
            },
            {
                id: 'website',
                accessorKey: 'link',
                size: 80,
                header: () => <p className='column-title'>Website</p>,
                cell: ({getValue}) => {
                    const link = getValue<string>();
                    if (!link) return <span className="text-muted-foreground">-</span>;
                    return (
                        <a href={link} target="_blank" rel="noreferrer" className="text-primary flex items-center gap-1">
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    );
                },
            },
        ], []),
        refineCoreProps: {
            resource: 'competitions',
            pagination: {pageSize: 20, mode: 'server'},
            filters: {
                permanent: [...searchFilters, ...fedFilters]
            },
            sorters: {
                permanent: [{ field: currentSort.field, order: currentSort.order }]
            }
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">All Competitions</h1>
            <div className="intro-row">
                <div className="action-row">
                    <div className="search-field">
                        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none"/>
                        <input
                            type="text"
                            placeholder="Search by Comp Name"
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={selectedFed}
                            onValueChange={setselectedFed}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Fed"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                All Feds
                            </SelectItem>
                            {FEDS_OPTIONS.map(fdrtns => (
                                <SelectItem key ={fdrtns.value} value={fdrtns.value}>
                                    {fdrtns.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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

                </div>
            </div>
            <DataTable table={competitionTable} />
        </ListView>
    );
};

export default UpcomingCompetitionsList;
