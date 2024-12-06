export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className='flex w-full mt-28 h-2/4 justify-center items-center'>{children}</div>;
}
