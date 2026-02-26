import type { NextApiRequest, NextApiResponse } from "next";

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { secret, slug, path } = req.query;

  if (secret !== process.env.STRAPI_PREVIEW_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // if (path != "" || !path) {
  //   res.writeHead(307, { Location: "/" });
  //   res.end();
  // }

  res.setPreviewData({});

  // Redirect to the path from the fetched post
  // We don't redirect to `req.query.slug` as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: `/${path}/${slug}` });
  res.end();
}
