import PropTypes, { InferProps } from "prop-types";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table";

type CountByProperty = [string, string][];

function calculateCountPercentages(countByProperty: CountByProperty) {
    const totalCount = countByProperty.reduce(
        (sum, row) => sum + parseInt(row[1]),
        0,
    );

    return countByProperty.map((row) => {
        const count = parseInt(row[1]);
        const percentage = ((count / totalCount) * 100).toFixed(2);
        return `${percentage}%`;
    });
}

function loadingRows(gridCols: string) {
    const NUM_ROWS = 10;
    return (
        <div>
            {[...Array(NUM_ROWS).keys()].map((_, index) => (
                <TableRow
                    key={index}
                    className={`group [&_td]:last:rounded-b-md ${gridCols}`}
                >
                    <TableCell className="min-w-48 break-all">
                        <div className="animate-pulse h-4 w-full bg-orange-300 rounded-md" />
                    </TableCell>
                </TableRow>
            ))}
        </div>
    );
}

function dataRow(
    gridCols: string,
    item: NonNullable<NonNullable<string | number>>[],
) {
    const itemArray = item.map((value) => String(value));
    return (
        <TableRow className={`group [&_td]:last:rounded-b-md ${gridCols}`}>
            <TableCell className="font-medium min-w-48 break-all">
                {itemArray[0]}
            </TableCell>
            <TableCell className="text-right min-w-16">
                {itemArray[1]}
            </TableCell>
        </TableRow>
    );
}

export default function TableCard({
    countByProperty,
    columnHeaders,
    loading,
}: InferProps<typeof TableCard.propTypes>) {
    const barChartPercentages = calculateCountPercentages(
        countByProperty as CountByProperty,
    );

    const countFormatter = Intl.NumberFormat("en", { notation: "compact" });

    const gridCols =
        (columnHeaders || []).length === 3
            ? "grid-cols-[minmax(0,1fr),minmax(0,8ch),minmax(0,8ch)]"
            : "grid-cols-[minmax(0,1fr),minmax(0,8ch)]";
    return (
        <Table>
            <TableHeader>
                <TableRow className={`${gridCols}`}>
                    {(columnHeaders || []).map((header: string, index) => (
                        <TableHead
                            key={header}
                            className={
                                index === 0
                                    ? "text-left"
                                    : "text-right pr-4 pl-0"
                            }
                        >
                            {header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading
                    ? loadingRows(gridCols)
                    : (countByProperty || []).map((item, key) =>
                          dataRow(gridCols, item || ""),
                      )}
            </TableBody>
        </Table>
    );
}

TableCard.propTypes = {
    propertyName: PropTypes.string,
    countByProperty: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string.isRequired,
                PropTypes.number.isRequired,
            ]).isRequired,
        ).isRequired,
    ).isRequired,
    columnHeaders: PropTypes.array,
    loading: PropTypes.bool,
};
