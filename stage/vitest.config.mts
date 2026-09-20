import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // 서버 전용 모듈 가드는 테스트(Node)에서는 필요 없다
      "server-only": fileURLToPath(new URL("./src/test/serverOnlyStub.ts", import.meta.url)),
    },
  },
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
