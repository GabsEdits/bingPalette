import sharp from "npm:sharp";
import { Resvg } from "npm:@resvg/resvg-js";

const bingRes = await fetch("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1");
const bingData = await bingRes.json();
const bingUrl = "https://www.bing.com" + bingData.images[0].url;

const imageBuffer = await (await fetch(bingUrl)).arrayBuffer();
const imagePath = "bing.jpg";
await Deno.writeFile(imagePath, new Uint8Array(imageBuffer));

const resizedImage = await sharp(imagePath).resize(17, 17).raw().toBuffer();
const pixels = new Uint8Array(resizedImage);

const colors = [];
for (let i = 0; i < pixels.length; i += 3) {
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];
  const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  colors.push(hex);
}

const uniqueColors = Array.from(new Set(colors)).slice(0, 11);

while (uniqueColors.length < 11) {
  uniqueColors.push(...uniqueColors.slice(0, 11 - uniqueColors.length));
}

const backgroundColor = uniqueColors.shift();
const svg = `
<svg width="3840" height="2160" viewBox="0 0 3840 2160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="3840" height="2160" fill="${backgroundColor}"/>
  ${uniqueColors.map((hex, i) => `
    <rect width="380" height="1460" rx="190" transform="matrix(-1 0 0 1 ${3185.5 - i * 239} 350)" fill="${hex}"/>
  `).join("\n")}
</svg>
`;

await Deno.writeFile("bing-palette.svg", new TextEncoder().encode(svg));

const resvg = new Resvg(svg, {
  fitTo: { mode: "width", value: 3840 }
});
const pngData = resvg.render().asPng();
await Deno.writeFile("bing-palette.png", pngData);

console.log("Done — Saved as bing-palette.png");

// Optional cleanup
await Deno.remove(imagePath);

const command = new Deno.Command("osascript", {
  args: [
    "-e",
    `tell application "System Events" to tell every desktop to set picture to "${Deno.cwd()}/bing-palette.png"`,
  ],
});
await command.output();

console.log("Wallpaper set");

console.log("Done");
