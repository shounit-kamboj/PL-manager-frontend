import React, {useMemo, useState} from 'react';
import {ListView} from "@/components/refine-ui/views/list-view.tsx"
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx"
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {AthleteCompetition} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
// import {Badge} from "@/components/ui/badge.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {ExternalLink, Search} from "lucide-react";

const AthleteCompetitionsList = () => {
    const [searchQuery, setSearchQuery] = useState("");


    const athleteCompetitionTable = useTable<AthleteCompetition>({
        columns: useMemo<ColumnDef<AthleteCompetition>[]>(() => [
            {
                id: 'name',
                accessorKey: 'athlete.name',
                size: 180,
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
                size: 120,
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
                size: 120,
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
                size: 80,
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
        ], []),
        refineCoreProps: {
            resource: 'athlete-competitions',
            pagination: {pageSize: 20, mode: 'server'},
            filters: {},
            sorters: {}
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
                    <CreateButton />
                </div>
            </div>
            <DataTable table={athleteCompetitionTable} />
        </ListView>
    );
};

export default AthleteCompetitionsList;