import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { getURL } from "@/utils/helpers";

const BASE_URL = getURL();

async function getLastModifiedDate(filePath: string): Promise<Date> {
  filePath = path.join(process.cwd(), filePath);
  const stats = await fs.promises.stat(filePath);
  return stats.mtime;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pageRoutes = ["account","job-cover-letter","pricing","profile"];
  const staticRoutes = await Promise.all(
    pageRoutes.map(async (pageRoute) => {
      const lastModified = await getLastModifiedDate(
        `app/${pageRoute}/page.tsx`
      );
      const page = pageRoute.replace(/\/?\(.*?\)/g, "").replace(/^\/+/, "");
      return {
        url: `${BASE_URL}/${page}`,
        lastModified,
      };
    })
  );


  const sitemap = [...staticRoutes];

  return sitemap;
}