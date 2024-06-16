import { useFetcher } from "@remix-run/react";

// app/routes/resources/customers.tsx
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";

import { useUpdateQueryStringValueWithoutNavigation } from "~/lib/utils";

export async function loader({ context, request }: LoaderFunctionArgs) {
    const { analyticsEngine } = context;

    const url = new URL(request.url);
    const interval = url.searchParams.get("interval") || "";
    const siteId = url.searchParams.get("site") || "";

    const tz = context.requestTimezone as string;

    const countByReferrer = await analyticsEngine.getCountByReferrer(
        siteId,
        interval,
        tz,
    );
    console.log(siteId, interval, tz);
    console.log(countByReferrer);
    return json({
        countByReferrer: countByReferrer,
        page: Number(url.searchParams.get("referrer_page") || 1),
    });
}

import { useEffect } from "react";
import TableCard from "~/components/TableCard";
import { Card } from "~/components/ui/card";

import { useSearchParams } from "@remix-run/react";

export const ReferrerCard = ({
    siteId,
    interval,
    error,
}: {
    siteId: string;
    interval: string;
    error?: string | null;
}) => {
    const [_, setSearchParams] = useSearchParams();

    const dataFetcher = useFetcher<typeof loader>();
    const countByReferrer = dataFetcher.data?.countByReferrer || [];
    const page = dataFetcher.data?.page || 1;

    useEffect(() => {
        // Your code here
        if (dataFetcher.state === "idle") {
            dataFetcher.load(
                `/resources/referrer?site=${siteId}&interval=${interval}`,
            );
        }
    }, []);

    useEffect(() => {
        // Your code here
        if (dataFetcher.state === "idle") {
            dataFetcher.load(
                `/resources/referrer?site=${siteId}&interval=${interval}`,
            );
        }
    }, [siteId, interval]);

    function handlePagination(page: number) {
        useUpdateQueryStringValueWithoutNavigation(
            "referrer_page",
            page.toString(),
        );
        dataFetcher.load(
            `/resources/referrer?site=${siteId}&interval=${interval}&referrer_page=${page}`,
        );
    }

    return (
        <Card>
            {countByReferrer ? (
                <div>
                    <TableCard
                        countByProperty={countByReferrer}
                        columnHeaders={["Referrer", "Visitors"]}
                    />
                    <div className="text-right">
                        <span>Page: {page}</span>
                        <a
                            onClick={() => handlePagination(page - 1)}
                            className="text-blue-600"
                        >
                            ←
                        </a>
                        <a
                            onClick={() => handlePagination(page + 1)}
                            className="text-blue-600"
                        >
                            →
                        </a>
                    </div>
                </div>
            ) : null}
        </Card>
    );
};