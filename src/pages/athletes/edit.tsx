import React from 'react';
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {useShow} from "@refinedev/core";
import {Athlete} from "@/types";

const AthletesShow = () => {
    const {query} = useShow<Athlete>({
        resource: 'athletes',
    });

    const athlete = query.data?.data;

    return (
        <div className="class-view">
            <Breadcrumb />
            <h1 className="page-title">{athlete?.name ?? 'Athlete Profile'}</h1>
        </div>
    );
};

export default AthletesShow;