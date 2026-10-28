#!/usr/bin/env python3
"""Rebuild prompts.json with distinctive visual subjects + tight portrait framing (v2)."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CATALOGUE = ROOT / "src/data/catalogue.json"
OUT = Path(__file__).resolve().parent

FACTION_MOOD = {
    "monsters": "blood-crimson and bone-white accents, necrotic cold blues, Wild Hunt winter night",
    "nilfgaard": "black-and-gold imperial pageantry, sunburst motifs, desert dusk heat haze",
    "northern_realms": "Temerian blue and lily-gold heraldry, rainy northern keep stone",
    "scoiatael": "forest greens and amber leaf-light, guerrilla woodland camouflage",
    "skellige": "cold sea teal, storm grey, clan tattoos, salt-spray cliffs",
    "neutral": "warm parchment bronze and charcoal, tavern-road wanderer mood",
}

KIND_FRAMING = {
    "leader": "commanding shoulder-up portrait of a faction leader, regal presence, face large and readable",
    "hero": "heroic legendary figure portrait, elevated dramatic lighting, face and upper torso fill frame",
    "unit": "character or creature portrait suitable for a collectible card, subject fills most of the frame",
    "special": "symbolic magical object as the clear centered subject, close crop, readable silhouette",
    "weather": "atmospheric weather phenomenon as the sole subject, bold readable silhouette, landscape mood",
}

# Distinctive ORIGINAL visual descriptions — inspired by lore role/name only, not CDPR art.
VISUAL: dict[str, str] = {
    # Monsters leaders / heroes
    "monsters-eredin-breacc-glas-the-treacherous": "A treacherous elven warlord in jagged bone-and-steel armor with a skull-like helm, icy blue eyes glowing through slits, treacherous smirk energy",
    "monsters-eredin-bringer-of-death": "A death-bringing Wild Hunt rider king in spiky black armor, skull helm with glowing cold eyes, frost steam around pauldrons",
    "monsters-eredin-commander-of-the-red-riders": "Wild Hunt commander with crimson rider banners behind him, black armor edged in red, skeletal crown helm",
    "monsters-eredin-destroyer-of-worlds": "Apocalyptic armored conqueror with cracked world-ice motifs on armor, towering skeletal crown, storm of ash",
    "monsters-eredin-king-of-the-wild-hunt": "King of the spectral hunt: tall figure in ornate bone crown and ribcage plate, glowing azure eyes, frost-bitten night",
    "monsters-imlerith": "Massive Wild Hunt warrior in heavy spiked plate with a brutal horned helm, wielding a huge mace, intimidating bulk",
    "monsters-draug": "Undead armored general with a blank faceplate helm, tattered royal cape, ghostly pale aura",
    "monsters-kayran": "Huge tentacled river monster, many writhing arms and a beaked maw, dripping swamp water",
    "monsters-leshen": "Ancient forest spirit of antlers and bark, deer skull face, twig fingers, glowing hollow eyes",
    # Monsters units
    "monsters-arachas": "Giant armored insectoid with sickle forelimbs and a plated thorax, close-up of head and claws",
    "monsters-arachas-behemoth": "Colossal arachas brute with oversized carapace and crushing claws",
    "monsters-botchling": "Tiny twisted childlike monster with pale skin, black eyes, and ragged cloth, uncanny and sad-horrific",
    "monsters-celaeno-harpy": "Winged harpy with pale feathers, sharp talons, and a cruel avian face",
    "monsters-cockatrice": "Wyvern-like rooster dragon with wattles, beak, and leathery wings, hissing",
    "monsters-crone-brewess": "Hag crone stirring a foul cauldron, warty face, crooked nose, herbalist rags",
    "monsters-crone-weavess": "Hag weaving cursed thread, spindly fingers, veiled eyes, spiderweb motifs",
    "monsters-crone-whispess": "Whispering hag with cupped hands and misty breath, gaunt face, conspiratorial look",
    "monsters-earth-elemental": "Walking mound of stone and soil with glowing fissures for eyes",
    "monsters-endrega": "Spiked insect warrior with chitin plates and venomous stinger limbs",
    "monsters-fiend": "Three-eyed horned beast with a massive antlered head and muscular torso",
    "monsters-fire-elemental": "Humanoid blaze of magma and flame, coal-black core, roaring heat",
    "monsters-foglet": "Lanky fog-dwelling humanoid with stretched limbs and glowing eyes in mist",
    "monsters-forktail": "Dragon-like forktail with twin-tipped tail and lean predatory head",
    "monsters-frightener": "Towering golem of scrap metal and bone, vacant iron face, raised fists",
    "monsters-gargoyle": "Stone gargoyle perched mid-snarl, bat wings, horned head, granite texture",
    "monsters-ghoul": "Hunched corpse-eater with mottled skin, bloody muzzle, and clawed hands",
    "monsters-grave-hag": "Long-tongued grave hag with corpse-pale skin and stringy hair, crypt setting",
    "monsters-griffin": "Majestic griffin: eagle head and wings on a lion body, mid-scree",
    "monsters-harpy": "Fierce feathered harpy with humanoid torso and raptor claws",
    "monsters-ice-giant": "Frost-covered giant with ice-crusted beard and club of frozen wood",
    "monsters-nekker": "Small pack monster with oversized head, needle teeth, and muddy skin",
    "monsters-plague-maiden": "Spectral plague maiden in a tattered white dress, diseased mist aura",
    "monsters-toad": "Enormous bloated toad monster with toxic warts and a gaping maw",
    "monsters-vampire-bruxa": "Elegant female vampire mid-hiss, dark gown, predatory eyes, bat-wing suggestion",
    "monsters-vampire-ekimmara": "Feral bat-vampire with membranous wings and a snarling snout",
    "monsters-vampire-fleder": "Hunched fleder vampire with elongated ears and dripping fangs",
    "monsters-vampire-garkain": "Ugly garkain vampire with wrinkled bald head and bestial jaw",
    "monsters-vampire-katakan": "Powerful katakan vampire mid-transformation, clawed hands, red eyes",
    "monsters-werewolf": "Towering werewolf mid-howl, fur bristling, moonlit shoulders",
    "monsters-wyvern": "Lean green wyvern with leather wings and a venomous barbed tail",
    # Neutral
    "neutral-geralt-of-rivia": "White-haired witcher with cat-like amber eyes, facial scars, twin swords on his back, weathered dark armor",
    "neutral-yennefer-of-vengerberg": "Striking sorceress with raven-black hair and violet eyes, elegant black-and-white dress, powerful presence",
    "neutral-triss-merigold": "Red-haired sorceress with warm green eyes, embroidered crimson-and-teal gown, gentle but strong",
    "neutral-cirilla-fiona-elen-riannon": "Ashen-haired young warrior princess with emerald eyes, sword at her side, determined expression",
    "neutral-dandelion": "Flamboyant bard with feathered hat, lute, stylish doublet, charming smile",
    "neutral-vesemir": "Older white-haired witcher mentor with grey beard, battered armor, fatherly severity",
    "neutral-zoltan-chivay": "Red-bearded dwarf warrior with a tattooed face, axe, and stout armor",
    "neutral-emiel-regis-rohellec-terzieff": "Elegant pale higher vampire gentleman with a goatee, refined coat, knowing calm eyes",
    "neutral-olgierd-von-everec": "Aristocrat with a red sash and haunted eyes, sabre at hip, immortal weariness",
    "neutral-gaunter-o-dimm": "Mysterious man in a tall hat and dark coat, spoon motif, unsettling glass-bead eyes",
    "neutral-gaunter-o-dimm-darkness": "Shadowy mirror-reflection of a smiling man in a coat, darkness swirling around him",
    "neutral-mysterious-elf": "Hooded ancient elf with ageless eyes and subtle pointed ears, enigmatic smile",
    "neutral-villentretenmerth": "Golden dragon mid-transformation hint, or coiled golden dragon head filling the frame",
    "neutral-cow": "Plain brown dairy cow looking oddly solemn, pastoral but slightly comic",
    "neutral-biting-frost": "Frozen battlefield under biting frost, ice crystals and blue-white cold dominating",
    "neutral-impenetrable-fog": "Thick grey fog swallowing silhouettes of trees and banners",
    "neutral-torrential-rain": "Sheets of heavy rain over a muddy battlefield, storm-dark sky",
    "neutral-clear-weather": "Break of sunlight through parting storm clouds over green hills",
    "neutral-skellige-storm": "Violent sea storm with lightning over jagged northern cliffs",
    "neutral-scorch": "Wall of roaring fire scorching a battlefield, heat shimmer",
    "neutral-commander-s-horn": "Ornate war horn of brass and bone, close-up, battle banners soft behind",
    "neutral-decoy": "Wooden training dummy in soldier kit, decoy on a battlefield",
    "neutral-mardroeme": "Strange hallucinogenic mushrooms glowing on a forest stump",
    # Nilfgaard
    "nilfgaard-emhyr-var-emreis-emperor-of-nilfgaard": "Stern black-haired emperor in black-and-gold imperial armor with a sunburst crest, cold commanding stare",
    "nilfgaard-emhyr-var-emreis-his-imperial-majesty": "Imperial majesty portrait: black armor, gold filigree, laurel-like sun crown motif",
    "nilfgaard-emhyr-var-emreis-invader-of-the-north": "Emperor on campaign cloak, map of conquest behind, ruthless invader presence",
    "nilfgaard-emhyr-var-emreis-the-relentless": "Relentless emperor close-up, scarred resolve, black steel and gold",
    "nilfgaard-emhyr-var-emreis-the-white-flame": "Emperor silhouetted against a white flame / sunburst, black armor rim-lit",
    "nilfgaard-letho-of-gulet": "Bald heavyset witcher assassin with a thick neck, yellow eyes, and brutal calm",
    "nilfgaard-menno-coehoorn": "Field marshal in Nilfgaardian officer plate with a stern goatee",
    "nilfgaard-morvran-voorhis": "Young aristocratic general with pale hair and ornate black-gold armor",
    "nilfgaard-tibor-eggebracht": "Heroic Nilfgaardian officer with a proud chin and polished black armor",
    "nilfgaard-cahir-mawr-dyffryn-aep-ceallach": "Young dark-haired knight in black winged helm / armor, conflicted intensity",
    "nilfgaard-albrich": "Bearded Nilfgaardian mage in dark robes with sunburst embroidery",
    "nilfgaard-assire-var-anahid": "Elegant Nilfgaardian sorceress with dark hair and gold jewelry",
    "nilfgaard-fringilla-vigo": "Beautiful sorceress with pale blonde hair and emerald accents",
    "nilfgaard-cynthia": "Nilfgaardian agent-sorceress with sharp features and dark cloak",
    "nilfgaard-black-infantry-archer": "Black-armored Nilfgaardian archer drawing a longbow",
    "nilfgaard-etolian-auxiliary-archers": "Desert-auxilia archer in lighter gear with Nilfgaard sun markings",
    "nilfgaard-impera-brigade-guard": "Elite Impera guardsman in ornate black plate with gold sun",
    "nilfgaard-nausicaa-cavalry-rider": "Cavalry rider in black lacquered armor, horse plume suggestion",
    "nilfgaard-heavy-zerrikanian-fire-scorpion": "Huge ballista-like fire scorpion siege engine, iron and flame",
    "nilfgaard-zerrikanian-fire-scorpion": "Siege scorpion engine aiming, bolts tipped with fire pots",
    "nilfgaard-rotten-mangonel": "Weathered mangonel siege catapult, rotting wood and iron",
    "nilfgaard-morteisen": "Grizzled Nilfgaardian captain with a scar and black cloak",
    "nilfgaard-puttkammer": "Bespectacled Nilfgaardian officer with a thin face",
    "nilfgaard-rainfarn": "Young Nilfgaardian noble soldier in polished gear",
    "nilfgaard-renuald-aep-matsen": "Nilfgaardian mage-officer with a cruel expression",
    "nilfgaard-shilard-fitz-oesterlen": "Aging diplomat in rich black robes, calculating smile",
    "nilfgaard-stefan-skellen": "Ambitious courtier with a pointed beard and dagger",
    "nilfgaard-sweers": "Harsh Nilfgaardian inquisitor-type officer",
    "nilfgaard-vanhemar": "Nilfgaardian mage with frost motifs and dark robes",
    "nilfgaard-vattier-de-rideaux": "Spymaster in a hooded black coat, sharp intelligent eyes",
    "nilfgaard-vreemde": "Scarred veteran sergeant of the empire",
    "nilfgaard-young-emissary": "Youthful black-clad emissary with a sealed scroll",
    "nilfgaard-siege-engineer": "Engineer with calipers and soot-stained apron beside siege gear",
    "nilfgaard-siege-technician": "Technician adjusting gears on a siege machine",
    # Northern Realms
    "northern_realms-foltest-king-of-temeria": "Temerian king with a gold crown, blue-and-gold royal mantle, trimmed beard, regal authority",
    "northern_realms-foltest-lord-commander-of-the-north": "King Foltest in campaign cloak over armor, commander’s baton, northern banners",
    "northern_realms-foltest-son-of-medell": "Younger crowned Foltest portrait, Temerian lilies, proud lineage",
    "northern_realms-foltest-the-siegemaster": "King overlooking siege engines, crowned helm under arm, smoke of war",
    "northern_realms-foltest-the-steel-forged": "King in battle-scarred steel plate with Temerian blue sash",
    "northern_realms-vernon-roche": "Special forces commander with short dark hair, blue stripes scarf, hard jaw",
    "northern_realms-john-natalis": "Decorated Temerian general with a white beard and ornate armor",
    "northern_realms-esterad-thyssen": "Bearded Redanian king/hero in red-and-gold, stern nobility",
    "northern_realms-philippa-eilhart": "Powerful sorceress with dark hair, owl motif suggestion, violet-tinged magic",
    "northern_realms-keira-metz": "Blonde sorceress with a coy smile and layered mage robes",
    "northern_realms-sabrina-glevissig": "Fierce Kaedweni sorceress with red hair and stormy expression",
    "northern_realms-sile-de-tansarville": "Elegant sorceress with silver hair and sharp aristocratic features",
    "northern_realms-sigismund-dijkstra": "Heavyset spymaster with a cane and expensive coat, shrewd eyes",
    "northern_realms-thaler": "Grubby intelligence officer with a sly grin and messy clothes",
    "northern_realms-ves": "Tough female special-forces soldier with a braid and Blue Stripes kit",
    "northern_realms-yarpen-zigrin": "Stout dwarf warrior with a braided beard and axe",
    "northern_realms-blue-stripes-commando": "Blue Stripes elite soldier with blue-striped scarf and crossbow",
    "northern_realms-poor-fucking-infantry": "Tired poorly-equipped peasant spearman, muddy and resigned",
    "northern_realms-redanian-foot-soldier": "Redanian infantry in red tabard with eagle emblem",
    "northern_realms-crinfrid-reavers-dragon-hunter": "Scarred dragon hunter with a crossbow and trophy scales",
    "northern_realms-dun-banner-medic": "Field medic of the Dun Banner with satchel and red sash",
    "northern_realms-kaedweni-siege-expert": "Kaedweni engineer with unicorn banner colors and siege plans",
    "northern_realms-prince-stennis": "Arrogant young prince in polished armor and ermine",
    "northern_realms-sheldon-skaggs": "Dwarf soldier with a wry look and battered helm",
    "northern_realms-siegfried-of-denesle": "Knight of the Flaming Rose with rose emblem and zealous eyes",
    "northern_realms-dethmold": "Kaedweni court mage with a thin cruel face and dark robes",
    "northern_realms-ballista": "Large wooden ballista siege weapon ready to fire",
    "northern_realms-catapult": "Heavy catapult on a muddy field, tensioned arm",
    "northern_realms-trebuchet": "Tall trebuchet silhouette against smoke",
    "northern_realms-siege-tower": "Wooden siege tower rolling toward walls",
    # Scoia'tael
    "scoiatael-francesca-findabair-daisy-of-the-valley": "Elven queen with golden hair and floral crown, ethereal beauty, forest-light gown",
    "scoiatael-francesca-findabair-hope-of-the-aen-seidhe": "Elven queen as hope of her people, luminous presence, autumn leaves",
    "scoiatael-francesca-findabair-pureblood-elf": "Pureblood Aen Seidhe queen, pointed ears clear, regal gold jewelry",
    "scoiatael-francesca-findabair-queen-of-dol-blathanna": "Queen of the Valley of Flowers, throne of living wood suggestion",
    "scoiatael-francesca-findabair-the-beautiful": "Radiant elven queen portrait emphasizing beauty and calm power",
    "scoiatael-iorveth": "Scarred elven guerrilla with an eyepatch-like scar, green hood, deadly calm",
    "scoiatael-isengrim-faoiltiarna": "Iron wolf elf commander with a grim scarred face and green cloak",
    "scoiatael-eithne": "Ancient dryad queen of Brokilon, green hair and bark-like accents",
    "scoiatael-saesenthessis": "Golden-scaled dragon woman / golden dragon head, fierce beauty",
    "scoiatael-milva": "Human archer ally with a red headscarf and longbow",
    "scoiatael-yaevinn": "Scoia'tael elf officer with braided hair and forest camouflage",
    "scoiatael-toruviel": "Elven archer woman with silver hair and a proud snarl",
    "scoiatael-schirru": "Half-elf pyromaniac with burn scars and wild hair",
    "scoiatael-barclay-els": "Dwarf Scoia'tael ally with a hammer and green sash",
    "scoiatael-dennis-cranmer": "Mahakaman dwarf commander with a thick beard and stout armor",
    "scoiatael-ciaran-aep-easnillien": "Agile elf scout with dual blades and leaf-cloak",
    "scoiatael-filavandrel-aen-fidhail": "Noble elf lord with silver hair and ancestral armor",
    "scoiatael-ida-emean-aep-sivney": "Sage elven sorceress with calm eyes and rune jewelry",
    "scoiatael-dol-blathanna-archer": "Elegant Dol Blathanna elven archer drawing a bow",
    "scoiatael-dol-blathanna-scout": "Elven scout in light armor among trees",
    "scoiatael-elven-skirmisher": "Scoia'tael skirmisher with camouflage paint and shortbow",
    "scoiatael-vrihedd-brigade-recruit": "Young Vrihedd brigade elf recruit, determined",
    "scoiatael-vrihedd-brigade-veteran": "Veteran Vrihedd elf with scars and elite gear",
    "scoiatael-dwarven-skirmisher": "Stout dwarf skirmisher with a throwing axe",
    "scoiatael-mahakaman-defender": "Heavy Mahakaman dwarf defender with tower shield",
    "scoiatael-havekar-healer": "Forest healer with herbs and glowing hands",
    "scoiatael-havekar-smuggler": "Cloaked smuggler with a crate of goods in woods",
    "scoiatael-riordain": "Elven warrior with a long spear and green cloak",
    # Skellige
    "skellige-crach-an-craite": "Jarl with a fierce red beard, sea-weathered face, and clan an Craite armor",
    "skellige-king-bran": "Elderly Skellige king with a white beard, heavy furs, and a simple crown",
    "skellige-cerys": "Young shieldmaiden princess with braided red hair and determined eyes",
    "skellige-hjalmar": "Boastful young warrior with red hair, scars, and a huge grin",
    "skellige-ermion": "Druid with wild grey hair, antler staff, and rune tattoos",
    "skellige-hemdall": "Mythic guardian warrior with glowing eyes and ancient Skellige armor",
    "skellige-birna-bran": "Ambitious queen with dark hair, fur-lined gown, and cold calculation",
    "skellige-madman-lugos": "Wild-eyed jarl with a manic smile and bloodied axe",
    "skellige-blueboy-lugos": "Young Skellige warrior with blue warpaint",
    "skellige-donar-an-hindar": "Pious clan elder with a hammer of Freya motifs",
    "skellige-draig-bon-dhu": "Horn-blowing skald with a massive war horn",
    "skellige-holger-blackhand": "Pirate-like warrior with a blackened hand and grimace",
    "skellige-svanrige": "Young prince with uncertain eyes and royal Skellige garb",
    "skellige-udalryk": "Tormented warrior with haunted eyes and salt-stained armor",
    "skellige-olaf": "Bear-like champion with a huge frame and fur cloak",
    "skellige-kambi": "Mysterious black rooster / prophetic bird on a rocky shore",
    "skellige-berserker": "Bare-chested berserker with rage-filled eyes and axe",
    "skellige-young-berserker": "Younger berserker youth mid-battle cry",
    "skellige-transformed-vildkaarl": "Bear-transformed vildkaarl warrior, half-man half-bear",
    "skellige-transformed-young-vildkaarl": "Younger bear-warrior mid-transformation",
    "skellige-clan-an-craite-warrior": "An Craite clan warrior with rope motifs and axe",
    "skellige-clan-brokvar-archer": "Brokvar archer with a longbow on a cliff",
    "skellige-clan-dimun-pirate": "Dimun pirate with a cutlass and sea gear",
    "skellige-clan-drummond-shield-maiden": "Drummond shieldmaiden with round shield and spear",
    "skellige-clan-heymaey-skald": "Heymaey skald with a lyre and storytelling pose",
    "skellige-clan-tordarroch-armorsmith": "Tordarroch armorsmith at a forge, hammer raised",
    "skellige-light-longship": "Skellige light longship cutting through waves",
    "skellige-war-longship": "Heavily manned war longship with shields on the rail",
}

BASE = (
    "Original dark-fantasy digital painting for a collectible card game. "
    "Tight vertical portrait crop 3:4. Subject face and upper body fill at least 70 percent of the frame, "
    "head placed in the upper third, centered, no empty sky-dominant composition. "
    "Painterly brushwork, high contrast silhouette, readable at thumbnail size. "
    "No text, no logos, no UI chrome, no watermarks, no official Gwent or CDPR likeness, "
    "not a copy of any existing card art composition — original design inspired only by name and role."
)


def build_prompt(card: dict) -> str:
    fid = card["id"]
    faction = card["faction"]
    kind = card["kind"]
    visual = VISUAL.get(fid)
    if not visual:
        # Fallback from name tokens
        visual = (
            f"Distinctive original fantasy depiction of '{card['name']}' "
            f"as a clear single subject matching the card's role ({kind})"
        )
    ability = card.get("abilityText") or "none"
    strength = card.get("strength")
    row = card.get("row") or "none"
    abilities = ", ".join(card.get("abilities") or []) or "none"
    strength_bit = f" combat strength vibe ~{strength}." if strength is not None else ""
    return (
        f"{BASE} Faction mood: {FACTION_MOOD[faction]}. "
        f"Card type framing: {KIND_FRAMING.get(kind, KIND_FRAMING['unit'])}. "
        f"Subject: {visual}. "
        f"Card name for lore context only (do not render text): '{card['name']}' — {kind} of {faction}. "
        f"Combat row: {row}. Abilities theme: {abilities}.{strength_bit} "
        f"Ability flavour (inspiration only, do not render as text): {ability}"
    )


def main() -> None:
    cards = json.loads(CATALOGUE.read_text())["cards"]
    entries = []
    missing = []
    for c in cards:
        if c["id"] not in VISUAL:
            missing.append(c["id"])
        entries.append(
            {
                "id": c["id"],
                "name": c["name"],
                "faction": c["faction"],
                "kind": c["kind"],
                "prompt": build_prompt(c),
            }
        )
    OUT.joinpath("prompts.json").write_text(json.dumps(entries, indent=2) + "\n")
    by_f: dict[str, list] = {}
    for e in entries:
        by_f.setdefault(e["faction"], []).append(e)
    for faction, items in by_f.items():
        OUT.joinpath(f"prompts-{faction}.json").write_text(json.dumps(items, indent=2) + "\n")
    print(f"wrote {len(entries)} prompts; visual_hints={len(VISUAL)}; missing_hints={len(missing)}")
    if missing:
        print("missing:", ", ".join(missing[:20]), ("..." if len(missing) > 20 else ""))


if __name__ == "__main__":
    main()
