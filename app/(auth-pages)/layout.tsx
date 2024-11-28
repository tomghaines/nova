export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col mt-72 justify-center'>{children}</div>
  );
}
