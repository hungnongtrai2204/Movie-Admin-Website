import { Select, type SelectProps, type SelectOption } from 'rizzui';
import cn from '@/utils/class-names';

export default function CinemaField({
  placeholder = 'Chọn hệ thống rạp',
  dropdownClassName,
  ...props
}: SelectProps<SelectOption>) {
  return (
    <Select
      inPortal={false}
      placeholder={placeholder}
      selectClassName="h-9 min-w-[250px]"
      dropdownClassName={cn('p-1.5 !z-0', dropdownClassName)}
      optionClassName="h-9"
      {...props}
    />
  );
}
