import { redirect } from "next/navigation";

export const dynamic = "force-static";

export default function AGBRedirect() {
  // AGB werden zentral unter legal/terms gepflegt.
  redirect("/legal/terms");
}

