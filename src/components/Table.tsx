import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

type TableColumn = {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
};

type TableProps = {
  columns: TableColumn[];
  data: any[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  isLoading?: boolean;
};

export function Table({ columns, data, onEdit, onDelete, isLoading }: TableProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Carregando...
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Nenhum registro encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Ações</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={item.id || index}>
              {columns.map((column) => (
                <td
                  key={`${item.id}-${column.key}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {column.render
                    ? column.render(item[column.key])
                    : item[column.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
