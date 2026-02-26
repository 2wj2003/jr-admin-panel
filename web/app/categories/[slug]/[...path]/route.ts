import { redirect } from "next/navigation";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: { path: string[] };
  }
) {
  const slug = params.path.pop(); // 'a', 'b', or 'c'

  redirect("/categories/" + slug);
}
