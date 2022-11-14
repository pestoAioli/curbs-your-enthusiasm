// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/prisma';
import cloudinary from "cloudinary";


cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function uploadImage(fileStream) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "curbstwo",
      },
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
    fileStream.pipe(uploadStream);
  });
}
export { uploadImage };

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const spotData = req.body;
  console.log(req.body)
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


