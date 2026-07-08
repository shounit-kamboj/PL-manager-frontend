import React from 'react';
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {useShow} from "@refinedev/core";
import {AthleteCompetition} from "@/types";

const AthleteCompetitionShow = () => {
    const {query} = useShow<AthleteCompetition>({
        resource: 'athlete-competitions',
    });

    const athleteComp = query.data?.data;

    return (
        <div className="class-view">
            <Breadcrumb />
            <h1 className="page-title">{athleteComp?.competition?.name ?? 'Competition Details'}</h1>
        </div>
    );
};

export default AthleteCompetitionShow;