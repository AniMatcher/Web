import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function NextPuish(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;
  const session = await getSession({ req });
  if (session) {
    const { uuid } = session;
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/anilist/redirect?code=${code}&uuid=${uuid}`,
      {
        method: 'POST',
      }
    );
    return res.redirect(307, '/profile');
  }
  return res.redirect(307, '/add-metrics');
}
