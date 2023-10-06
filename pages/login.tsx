import { Button } from '@chakra-ui/react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function IndexPage() {
  const { data, status } = useSession();
  if (status === 'loading') return <h1> loading... please wait</h1>;
  if (status === 'authenticated') {
    return (
      <div>
        <h1> hi {data?.user?.name || 'NO Name'}</h1>
        <Button
          onClick={() => {
            signOut();
          }}
        >
          sign out
        </Button>
      </div>
    );
  }
  return (
    <div>
      <Button onClick={() => signIn('google')}>sign in with gooogle</Button>
    </div>
  );
}
