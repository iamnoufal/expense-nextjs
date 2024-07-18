import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const access_token = req.cookies["access_token"];
  if (!access_token)
    return res.status(401).json({ message: "Unauthorized" });
  if (req.method == "GET") {
    console.log(process.env.API_URI)
    const resp = await fetch(`${process.env.API_URI}/contacts`, {
      method: "GET",
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`,
        "X-com-zoho-expense-organizationid": process.env.ORG_ID as string,
      },
    });
    console.log(resp)
    const data = await resp.json();
    console.log(data)
    if (data.code === 0) {
      return res.status(200).json(data.contacts);
    }
    return res.status(500).json(data);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
