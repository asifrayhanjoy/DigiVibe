import { POST as registerPOST } from "../register/route";

export async function POST(req: Request) {
  return registerPOST(req);
}
