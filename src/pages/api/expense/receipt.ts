import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { fileFromSync } from "node-fetch";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const access_token = req.cookies["access_token"];
  if (!access_token)
    return res.status(401).json({ message: "Unauthorized" });
  if (req.method == "POST") {
    const imageStr = req.body.receipt
    const image = imageStr.split(';base64,').pop();
    fs.writeFile('image.jpeg', image, {encoding: 'base64'}, async function(err) {
      const imageFile = fileFromSync('image.jpeg', 'image/jpeg');
      const formData = new FormData();
      formData.append('receipt', imageFile, "receipt.jpeg");
      const resp = await fetch(`${process.env.API_URI}/expenses`, {
        method: "POST",
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
          "X-com-zoho-expense-organizationid": process.env.ORG_ID as string,
        },
        body: formData
      });
      const data = await resp.json();
      return res.status(200).json(data);
    });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
