export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sz = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' }[size];
  return (
    <div className={`animate-spin rounded-full border-gray-200 border-t-brand-600 ${sz}`} />
  );
};
