import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function NextPuish(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const redirectUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${process.env.ANILIST_CLIENT_ID}&redirect_url=${process.env.NEXTAUTH_URL}/api/anilist-redirect&response_type=code`;
  const session = await getSession({ req });
  if (session?.uuid) {
    return res.redirect(301, redirectUrl);
  }
  return res.redirect(307, '/add-metrics');
}
