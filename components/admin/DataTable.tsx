import React from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({ data, columns, className, onRowClick }: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-hidden rounded-2xl border border-white/5 bg-[#121214]/50 backdrop-blur-sm", className)}>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/[0.02] border-b border-white/5 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((col, idx) => (
                <th key={String(col.key) + idx} className="px-6 py-4 font-medium">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "group transition-colors duration-200",
                    onRowClick ? "cursor-pointer hover:bg-white/[0.02]" : "hover:bg-white/[0.01]"
                  )}
                >
                  {columns.map((col, colIndex) => (
                    <td key={String(col.key) + colIndex} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
