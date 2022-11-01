// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../utils/db.ts';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'sowwy u cant do dat D:' });
  }
  const spotData = JSON.parse(req.body);

  const savedSpot = await prisma.spots.create({ data: spotData });
  res.json(savedSpot);
}


