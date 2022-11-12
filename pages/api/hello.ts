// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const spotData = req.body;
  switch (req.method) {
    case 'GET':
      try {
        const newSpot = await prisma.Spot.findMany();
        return res.status(200).json(newSpot);
      } catch (e) {
        return res.status(400).json(e);
      }
    case 'POST':
      try {
        const savedSpot = await prisma.Spot.create({ data: spotData });
        return res.status(200).json(savedSpot);
      } catch (e) {
        return res.status(400).json(e)
      }

    case 'DELETE':
      try {
        const deleteSpot = await prisma.Spot.delete({
          where: {
            id: spotData.id
          }
        });
        return res.status(200).json(deleteSpot);
      } catch (e) {
        return res.status(400).json(e);
      }
    default:
      return res.status(404).json({ msg: 'no can do buddy' })
  }

}


