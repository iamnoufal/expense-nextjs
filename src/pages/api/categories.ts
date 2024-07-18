import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const access_token = req.cookies["access_token"];
  if (!access_token)
    return res.status(401).json({ message: "Unauthorized" });
  if (req.method == "GET") {
    const resp = await fetch(`${process.env.API_URI}/expensecategories`, {
      method: "GET",
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`,
        "X-com-zoho-expense-organizationid": process.env.ORG_ID as string,
      },
    });
    const data = await resp.json();
    if (data.code === 0) {
      return res.status(200).json(data.expense_accounts);
    }
    return res.status(500).json(data);
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
