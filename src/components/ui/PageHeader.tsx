interface PageHeaderProps {
  title: string;
  rightContent?: React.ReactNode;
}
export const PageHeader = ({ title, rightContent }: PageHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {rightContent && <div>{rightContent}</div>}
    </div>
  );
};
