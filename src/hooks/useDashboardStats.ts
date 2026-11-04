// src/hooks/useDashboardStats.ts
import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "@/constants";
import { localTodayYmd } from "@/lib/dates";
import type { DashboardParams, DashboardStats } from "@/types";

export function useDashboardStats({ meetDays, blockDays, retentionUnit }: DashboardParams) {
    const [data, setData] = useState<DashboardStats | null>(null);
    const [error, setError] = useState<string | null>(null);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: make an AbortController for this request
        const controller = new AbortController();

        // TODO: set loading on, clear the old error
        setLoading(true);
        setError(null);

        // TODO: build the query string with URLSearchParams:
        //   today (from localTodayYmd), meetDays, blockDays, retentionUnit
        //   (every value must be a string)
        const qs = new URLSearchParams({
            today: localTodayYmd(),
            meetDays : String(meetDays),
            blockDays: String(blockDays),
            retentionUnit: String(retentionUnit)
        });

        // TODO: fetch `${BACKEND_BASE_URL}/dashboard?...`
        //   options: send the login cookie, connect the abort signal
        //   .then  -> if the response isn't ok, throw; otherwise parse the JSON
        //   .then  -> save the data
        //   .catch -> ignore an AbortError; otherwise save a message
        //   .finally -> turn loading off, unless this request was aborted
        fetch(`${BACKEND_BASE_URL}dashboard?${qs}`, {
            credentials: "include",
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(
                stats => {setData(stats);}
            )
            .catch((e: unknown) => {
                if (e instanceof DOMException && e.name === "AbortError") return; // we cancelled it: not an error
                setError(e instanceof Error ? e.message : "Something went wrong");
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false); // a newer request is running if aborted
            });


        return () => controller.abort();
    }, [meetDays, blockDays, retentionUnit]);

    return { data, loading, error };
}
