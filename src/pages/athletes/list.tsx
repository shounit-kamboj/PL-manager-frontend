import React, {useMemo, useState} from 'react';
import {ListView} from "@/components/refine-ui/views/list-view.tsx"
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx"
import {Search} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {AGECLASSES_OPTIONS, WEIGHTCLASSES_OPTIONS} from "@/constants";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {Athlete} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {getAgeClass} from "@/lib/getAgeClass.ts";


const AthletesList = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const[selectedWeightClass, setselectedWeightClass] = useState("all");
    const[selectedAgeClass, setselectedAgeClass] = useState("all");

    const athleteTable = useTable<Athlete>({
        columns:useMemo<ColumnDef<Athlete>[]>(() => [
            // {
            //     id: 'name',
            //     accessorKey: 'code',
            //     size:150,
            //     header: () => <p className='column-title ml-2'>Code</p>,
            //     cell: ({getValue}) => <Badge>{getValue<string>()}</Badge>
            // },
            {
                id: 'name',
                accessorKey: 'name',
                size:120,
                header: () => <p className='column-title'>Name</p>,
                cell: ({getValue}) =>
                    <span className="text-foreground">
                        {getValue<string>()}
                    </span>,
                filterFn: 'includesString' as const
            },
            {
                id: 'weightClass',
                accessorKey: 'weightClass',
                size: 70,
                header: () => <p className='column-title'>Weight Class</p>,
                cell: ({getValue}) => <Badge variant={"secondary"}>
                    {getValue<string>()}
                </Badge>,
            },

            {
                id: 'ageclass',
                size: 70,
                header: () => <p className='column-title'>Age Group</p>,

                cell: ({row}) => {
                    const dob = row.original.dateOfBirth;

                    if (!dob) {
                        return <span className="text-muted-foreground">—</span>;
                    }

                    return (
                        <Badge variant="secondary">
                            {getAgeClass(dob)}
                        </Badge>
                    );
                },
            },

            {
                id: 'trainingBlock',
                accessorKey: 'trainginBlock.endDate',
                size: 90,
                header: () => <p className='column-title'>Next Block Update</p>,
                cell: ({row}) => (
                    <span className="text-foreground">
                          {row.original.trainingBlock?.nextUpdateDate}
                    </span>
                )
            },

            {
                id: 'dueDate',
                accessorKey: 'payment.dueDate',
                size: 70,
                header: () => <p className='column-title'>Payment Due Date</p>,
                cell: ({row}) => (
                    <span className={row.original.payment?.overdue ? "text-destructive" : "text-foreground"}>
            {row.original.payment?.dueDate}
        </span>
                ),
            },
            {
                id: 'overdue',
                accessorKey: 'payment.overdue',
                size: 60,
                header: () => <p className='column-title'>Payment Status</p>,
                cell: ({row}) => (
                    <Badge variant={row.original.payment?.overdue ? "destructive" : "secondary"}>
                        {row.original.payment?.overdue ? "Unpaid" : "Paid"}
                    </Badge>
                ),
            },

            {
                id: 'nextcompetitiondate',
                accessorKey: 'nextCompetitionDetails.date',
                size: 70,
                header: () => <p className='column-title'>Next Comp Date</p>,
                cell: ({row}) => (
                    <span className="text-foreground">
            {row.original.nextCompetitionDetails?.date ?? '-'}
        </span>
                ),
            }


        ],[]),
        refineCoreProps: {
            resource: 'athletes',
            pagination:{pageSize:20,mode:'server'},
            filters: {},
            sorters:{}
        }
    });
    return (
     <ListView>
        <Breadcrumb />
         <h1 className="page-title">Athlete Roster</h1>
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
                     <Select value={selectedWeightClass}
                             onValueChange={setselectedWeightClass}>
                         <SelectTrigger>
                             <SelectValue placeholder="Filter by weightclass "/>
                         </SelectTrigger>
                         <SelectContent>
                             <SelectItem value="all">
                                 All Weight classes
                             </SelectItem>
                             {WEIGHTCLASSES_OPTIONS.map(weightclass => (
                                 <SelectItem key ={weightclass.value} value={weightclass.value}>
                                     {weightclass.label}
                                 </SelectItem>
                             ))}
                         </SelectContent>
                     </Select>
                     <div className='flex gap-2 w-full sm:w-auto'>

                         <Select value={selectedAgeClass}
                                 onValueChange={setselectedAgeClass}>
                             <SelectTrigger>
                                 <SelectValue placeholder="Filter by Age Category "/>
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="all">
                                     All Age Groups
                                 </SelectItem>
                                 {AGECLASSES_OPTIONS.map(ageclass => (
                                     <SelectItem key ={ageclass.value} value={ageclass.value}>
                                         {ageclass.label}
                                     </SelectItem>
                                 ))}
                             </SelectContent>
                         </Select>

                     <CreateButton />
                     </div>
                 </div>
             </div>
         </div>
         <DataTable table={athleteTable} />

     </ListView>
    );
};

export default AthletesList;