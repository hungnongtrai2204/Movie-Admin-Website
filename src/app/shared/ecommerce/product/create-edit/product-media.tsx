import { useFormContext } from 'react-hook-form';
import UploadZone from '@/components/ui/file-upload/upload-zone';
import FormGroup from '@/app/shared/form-group';
import cn from '@/utils/class-names';

interface ProductMediaProps {
  className?: string;
}

export default function ProductMedia({ className }: ProductMediaProps) {
  const { getValues, setValue } = useFormContext();

  return (
    <FormGroup
      title="Tải lên hình ảnh phim mới"
      description="Tải lên thư viện hình ảnh phim của bạn tại đây"
      className={cn(className)}
    >
      <UploadZone
        className="col-span-full"
        name="productImages"
        getValues={getValues}
        setValue={setValue}
      />
    </FormGroup>
  );
}
