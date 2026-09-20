import "server-only";
import { randomBytes } from "node:crypto";

// 나레이션을 만든 브라우저를 나중에 알아보기 위한 열쇠. 만들 때 한 번 발급해 같이 저장한다
export const newEditKey = () => randomBytes(24).toString("base64url");
