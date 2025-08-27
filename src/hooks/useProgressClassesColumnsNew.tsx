import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { progressClassesInterface } from "../interface/progresssheet.interface";

export const useProgressClassesColumns = (getEventById: (eventId: string) => { name?: string } | undefined): ColumnDef<progressClassesInterface>[] => {
  const columns = useMemo<ColumnDef<progressClassesInterface>[]>(
    () => [
      {
        accessorFn: (row) => row.createdAt,
        id: "createdAt",
        cell: (info) => {
          const timestamp = info.getValue() as number;
          const date = new Date(timestamp);
          return <p className="text-start text-nowrap text-xs">{date.toLocaleDateString()}</p>;
        },
        header: () => <span>Date</span>,
      },
      {
        accessorKey: "a",
        id: "a",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>A</span>,
      },
      {
        accessorKey: "book",
        id: "book",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Book</span>,
      },
      {
        accessorFn: (row) => row.eventInfo?.label || row.eventInfo?.value || "",
        id: "eventId",
        cell: (info) => {
          const eventValue = info.getValue() as string;
          const event = getEventById(eventValue);
          return <p className="text-start text-xs">{event?.name || eventValue || "Sin evento"}</p>;
        },
        header: () => <span>Reservación</span>,
      },
      {
        accessorFn: (row) => row.lesson,
        id: "lesson",
        cell: (info) => <p className="text-start text-nowrap text-xs">{info.getValue() as string}</p>,
        header: () => <span>Lesson</span>,
      },
      {
        accessorFn: (row) => row.observation,
        id: "observation",
        cell: (data) => <p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>,
        enableColumnFilter: false,
        header: () => <span>Observation</span>,
      },
      {
        accessorFn: (row) => row.part,
        id: "part",
        cell: (data) => <p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>,
        enableColumnFilter: false,
        header: () => <span>Part</span>,
      },
      {
        accessorFn: (row) => row.progress,
        id: "progress",
        cell: (data) => <p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>,
        enableColumnFilter: false,
        header: () => <span>Progress</span>,
      },
      {
        accessorFn: (row) => row.test,
        id: "test",
        cell: (data) => <p className="text-start text-nowrap text-xs">{data.getValue() as string}</p>,
        enableColumnFilter: false,
        header: () => <span>Test</span>,
      },
    ],
    [getEventById]
  );

  return columns;
};
