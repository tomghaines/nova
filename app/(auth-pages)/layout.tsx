export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className='mt-72 flex flex-col justify-center'>{children}</div>;
}
