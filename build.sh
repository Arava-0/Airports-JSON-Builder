deno compile --allow-net --allow-write --output Airports-JSON-Windows-x86_64.exe --target x86_64-pc-windows-msvc main.ts
deno compile --allow-net --allow-write --output Airports-JSON-Linux-x86_64 --target x86_64-unknown-linux-gnu main.ts
deno compile --allow-net --allow-write --output Airports-JSON-Linux-ARM64 --target aarch64-unknown-linux-gnu main.ts