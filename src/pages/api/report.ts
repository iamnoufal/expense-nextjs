import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const access_token = req.cookies["access_token"];
  if (!access_token)
    return res.status(401).json({ message: "Unauthorized" });
  if (req.method == "POST") {
    const resp = await fetch(`${process.env.API_URI}/expensereports`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`,
        "X-com-zoho-expense-organizationid": process.env.ORG_ID as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    return res.status(200).json(data);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
