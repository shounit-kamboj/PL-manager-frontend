import React, {useState} from 'react';
import {ListView} from "@/components/refine-ui/views/list-view.tsx"
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx"
import {Search} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {WEIGHTCLASSES_OPTIONS} from "@/constants";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";


const AthletesList = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const[selectedDepartment, setSelectedDepartment] = useState("all");
    return (
     <ListView>
        <Breadcrumb />
         <h1 className="page-title">Athlete Roster</h1>
         <div className="intro-row">
             <p>Access to Full Roster</p>
             <div className="action-row">
                 <div className="search-field">
                     <Search className="search-icon"/>
                     <input
                     type="text"
                     placeholder="Search by Athlete Name"
                     className="pl-10 w-full"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     />
                 </div>
                 <div className="flex gap-2 w-full sm:w-auto">
                     <Select value={selectedDepartment}
                             onValueChange={setSelectedDepartment}>
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
                     <CreateButton />
                 </div>
             </div>
         </div>
     </ListView>
    );
};

export default AthletesList;