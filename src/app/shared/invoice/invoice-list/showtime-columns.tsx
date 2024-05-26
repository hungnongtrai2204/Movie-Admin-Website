'use client';

import Link from 'next/link';
import { type Invoice } from '@/data/invoice-data';
import { routes } from '@/config/routes';
import { Text, Badge, Tooltip, Checkbox, ActionIcon } from 'rizzui';
import { HeaderCell } from '@/components/ui/table';
import EyeIcon from '@/components/icons/eye';
import PencilIcon from '@/components/icons/pencil';
import TicketIcon from '@/components/icons/ticket';
import AvatarCard from '@/components/ui/avatar-card';
import DateCell from '@/components/ui/date-cell';
import DeletePopover from '@/app/shared/delete-popover';

function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case 'đã chiếu':
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium text-orange-dark">{status}</Text>
        </div>
      );
    case 'chưa chiếu':
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium text-green-dark">{status}</Text>
        </div>
      );
    case 'overdue':
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium text-red-dark">{status}</Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium text-gray-600">{status}</Text>
        </div>
      );
  }
}

function getTypeBadge(status: string) {
  switch (status.toLowerCase()) {
    case 'vip':
      return (
        <div className="flex items-center">
          <Badge color="warning" renderAsDot />
          <Text className="ms-2 font-medium text-orange-dark">Vip</Text>
        </div>
      );
    case 'thuong':
      return (
        <div className="flex items-center">
          <Badge color="success" renderAsDot />
          <Text className="ms-2 font-medium text-green-dark">Thường</Text>
        </div>
      );
    case 'overdue':
      return (
        <div className="flex items-center">
          <Badge color="danger" renderAsDot />
          <Text className="ms-2 font-medium text-red-dark">{status}</Text>
        </div>
      );
    default:
      return (
        <div className="flex items-center">
          <Badge renderAsDot className="bg-gray-400" />
          <Text className="ms-2 font-medium text-gray-600">{status}</Text>
        </div>
      );
  }
}

type Columns = {
  data: any[];
  sortConfig?: any;
  handleSelectAll: any;
  checkedItems: string[];
  onDeleteItem: (id: string) => void;
  onHeaderCellClick: (value: string) => void;
  onChecked?: (id: string) => void;
};

export const getColumns = ({
  data,
  sortConfig,
  checkedItems,
  onDeleteItem,
  onHeaderCellClick,
  handleSelectAll,
  onChecked,
  onDoneShowtime,
}: Columns) => [
  {
    title: (
      <div className="ps-2">
        <Checkbox
          title={'Select All'}
          onChange={handleSelectAll}
          checked={checkedItems.length === data?.length}
          className="cursor-pointer"
        />
      </div>
    ),
    dataIndex: 'checked',
    key: 'checked',
    width: 30,
    render: (_: any, row: any) => (
      <div className="inline-flex ps-2">
        <Checkbox
          className="cursor-pointer"
          checked={checkedItems.includes(row.id)}
          {...(onChecked && { onChange: () => onChecked(row.id) })}
        />
      </div>
    ),
  },

  {
    title: <HeaderCell title="Mã Lịch Chiếu" />,
    dataIndex: 'showtimeId',
    key: 'showtimeId',
    width: 250,
    render: (email: string) => email,
  },
  {
    title: <HeaderCell title="Tên Phim" />,
    dataIndex: 'customer',
    key: 'customer',
    width: 250,

    render: (_: string, row: Invoice) => (
      <AvatarCard
        src={row.avatar}
        name={row.name}
        // description={row.category}
        avatarProps={{
          name: row.name,
          size: 'lg',
          className: 'rounded-lg',
        }}
      />
    ),
  },

  {
    title: (
      <HeaderCell
        title="Ngày Chiếu"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'createdAt'
        }
      />
    ),
    onHeaderCell: () => onHeaderCellClick('createdAt'),
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 200,
    render: (value: Date) => <DateCell date={value} />,
  },
  {
    title: (
      <HeaderCell
        title="Giá Vé"
        sortable
        ascending={
          sortConfig?.direction === 'asc' && sortConfig?.key === 'price'
        }
      />
    ),
    onHeaderCell: () => onHeaderCellClick('price'),
    dataIndex: 'price',
    key: 'price',
    width: 150,
    render: (value: string) => (
      <Text className="font-medium text-gray-700">
        {value.toLocaleString('it-IT', {
          style: 'currency',
          currency: 'VND',
        })}
      </Text>
    ),
  },
  {
    title: <HeaderCell title="Tên Rạp" />,
    dataIndex: 'userName',
    key: 'userName',
    width: 250,
    render: (email: string) => email,
  },
  // {
  //   title: (
  //     <HeaderCell
  //       title="Due Date"
  //       sortable
  //       ascending={
  //         sortConfig?.direction === 'asc' && sortConfig?.key === 'dueDate'
  //       }
  //     />
  //   ),
  //   onHeaderCell: () => onHeaderCellClick('dueDate'),
  //   dataIndex: 'dueDate',
  //   key: 'dueDate',
  //   width: 200,
  //   render: (value: Date) => <DateCell date={value} />,
  // },
  // {
  //   title: (
  //     <HeaderCell
  //       title="Amount"
  //       sortable
  //       ascending={
  //         sortConfig?.direction === 'asc' && sortConfig?.key === 'amount'
  //       }
  //     />
  //   ),
  //   onHeaderCell: () => onHeaderCellClick('amount'),
  //   dataIndex: 'amount',
  //   key: 'amount',
  //   width: 200,
  //   render: (value: string) => (
  //     <Text className="font-medium text-gray-700 dark:text-gray-600">
  //       ${value}
  //     </Text>
  //   ),
  // },
  {
    title: <HeaderCell title="Trạng Thái" />,
    dataIndex: 'status',
    key: 'status',
    width: 120,
    render: (value: string) => getStatusBadge(value),
  },
  {
    title: <></>,
    dataIndex: 'action',
    key: 'action',
    width: 140,
    render: (_: string, row: any) => (
      <div className="flex items-center justify-end gap-3 pe-3">
        <Tooltip
          size="sm"
          content={'Hoàn Thành Lịch Chiếu'}
          placement="top"
          color="invert"
        >
          <div onClick={() => onDoneShowtime(row.id)}>
            <ActionIcon
              as="span"
              size="sm"
              variant="outline"
              className="hover:!border-gray-900 hover:text-gray-700"
            >
              <TicketIcon className="h-4 w-4" />
            </ActionIcon>
          </div>
        </Tooltip>
        <Tooltip
          size="sm"
          content={'Edit Invoice'}
          placement="top"
          color="invert"
        >
          <Link href={routes.invoice.edit(row.id)}>
            <ActionIcon
              as="span"
              size="sm"
              variant="outline"
              className="hover:!border-gray-900 hover:text-gray-700"
            >
              <PencilIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <Tooltip
          size="sm"
          content={'View Invoice'}
          placement="top"
          color="invert"
        >
          <Link href={routes.invoice.details(row.id)}>
            <ActionIcon
              as="span"
              size="sm"
              variant="outline"
              className="hover:!border-gray-900 hover:text-gray-700"
            >
              <EyeIcon className="h-4 w-4" />
            </ActionIcon>
          </Link>
        </Tooltip>
        <DeletePopover
          title={`Delete the invoice`}
          description={`Are you sure you want to delete this #${row.id} invoice?`}
          onDelete={() => onDeleteItem(row.id)}
        />
      </div>
    ),
  },
];
