<div align="center">
<h1>Bing Palette</h1>
<p>Generate a color palette using today's Bing image</p>
</div>

> ![WARNING]
> This project was mostly done for fun, without a real world application, so you
*can* expect bugs, espacially about the colors being a little off.

## How it works

It's not that complicated. The script first fetches the `HPImageArchive` api from
Bing, then it exctracts the jpg from it, it resizes the image to `17x17`, uses
`sharp` to extract the dominant colors. It sorts the colors based on their
lightness, then hue.

## Installation

There are only 2 real requirements:
- Deno v2
- Access to the internet (for fetching the image)

## Usage

You clone the repository and run the script with Deno:

```sh
deno task generate
```

For now, it can set the background desktop image only for macos, as I haven't optimized
it for other platforms yet.
