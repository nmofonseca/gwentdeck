# Card artwork

The default library uses all 183 bundled faces in `public/card-faces/`, in both
local development and GitHub Pages builds. Names match catalogue IDs. `sources.json`
records the pinned source path for each image. See [NOTICE-ART.md](../NOTICE-ART.md)
and [the upstream notice](../public/card-faces/NOTICE.md) for credits and rights.

The full card face is displayed without cropping or a dark portrait overlay.
Personal image overrides still take precedence; failed images use CSS faces.
The library stretches cards within each responsive grid row so descriptions of
different lengths keep the ownership controls aligned.

The earlier AI portrait set and generation scripts remain under `public/card-art/`
and `scripts/card-art/`; their CC0 notice applies only to that earlier set.
Changing the new card-face images must preserve their separate notices and source map.
