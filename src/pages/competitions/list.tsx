import React, {useMemo, useState} from 'react';
import {ListView} from "@/components/refine-ui/views/list-view.tsx"
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx"
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {Competition} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {Search} from "lucide-react";

const UpcomingCompetitionsList = () => {
    const [searchQuery, setSearchQuery] = useState("");

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
                cell: ({getValue}) => (
                    <span className="text-foreground">
                        {getValue<string>()}
                    </span>
                ),
            },
            {
                id: 'enddate',
                accessorKey: 'endDate',
                size: 120,
                header: () => <p className='column-title'>End Date</p>,
                cell: ({getValue}) => (
                    <span className="text-foreground">
                        {getValue<string>()}
                    </span>
                ),
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
                accessorKey: 'url',
                size: 80,
                header: () => <p className='column-title'>Website</p>,
                cell: ({getValue}) => {
                    const url = getValue<string>();
                    if (!url) return <span className="text-muted-foreground">-</span>;
                    return (
                        <a href={url} target="_blank" rel="noreferrer" className="text-primary underline">
                            Link
                        </a>
                    );
                },
            },
        ], []),
        refineCoreProps: {
            resource: 'competitions',
            pagination: {pageSize: 20, mode: 'server'},
            filters: {},
            sorters: {}
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

                </div>
            </div>
            <DataTable table={competitionTable} />
        </ListView>
    );
};

export default UpcomingCompetitionsList;
