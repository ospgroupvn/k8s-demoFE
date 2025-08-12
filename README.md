## Build
- Chạy lệnh `pnpm build` (nếu server hỗ trợ pnpm) hoặc `yarn build`
- Copy `.next/static` vào trong `.next/standalone/.next`
- Copy `.next/standalone` lên server
- Chạy lệnh `pm2 start "PORT=3456 node server.js" --name bttp`