import { CharacterProfile, CountingObject, MapDestination, AssetItem, ColorSwatch } from '../types/creativeFoundation';

export const CHARACTERS: CharacterProfile[] = [
  {
    id: 'andy',
    name: 'Andy',
    role: 'The Curious Explorer',
    age: 5,
    species: 'Human',
    heightCm: 105,
    heightRelative: 'Middle height (Baseline 1.0x)',
    colorTheme: {
      primary: '#EC4899', // Playful Bubblegum Pink
      secondary: '#8B5CF6', // Purple backpack violet
      accent: '#FBBF24', // Star hair clip gold
      bgGlow: 'from-pink-100 to-rose-50',
      badgeBg: 'bg-pink-100 text-pink-700',
    },
    visualTraits: {
      hairOrFur: 'Voluminous, bouncy curly chocolate-brown hair with soft rounded highlight coils.',
      eyesAndGlasses: 'Big, bright hazel-brown eyes with expressive curved eyelashes.',
      clothing: 'Bright pastel pink crewneck top with soft ribbed collar, over casual denim blue shorts.',
      footwear: 'Two-tone pink and white sneakers with soft rubber toe caps.',
      backpack: 'Vibrant lilac-purple backpack with rounded utility pouches.',
      signatureAccessory: 'Luminous 5-point yellow star hair clip pinned above right ear.',
    },
    personality: 'Energetic, observant, hands-on. Loves spotting patterns in nature, collecting counting tokens, and asking "What if we count one more?"',
    mathRole: 'Guides counting, pattern recognition, matching, and physical one-to-one correspondence.',
    catchphrases: {
      idle: "Ready to explore the number trail? I see something shiny!",
      happy: "Yay! Look how many we collected together!",
      thinking: "Hmm... let's count them one by one to be sure!",
      encouraging: "You're doing fantastic! Try tapping the next one!",
      celebration: "Star-tastic! We solved the puzzle together!"
    }
  },
  {
    id: 'sancho',
    name: 'Sancho',
    role: 'The Thoughtful Builder',
    age: 6,
    species: 'Human',
    heightCm: 118,
    heightRelative: 'Taller than Andy (~1.12x)',
    colorTheme: {
      primary: '#2563EB', // Royal Sky Blue
      secondary: '#D97706', // Warm Khaki
      accent: '#10B981', // Emerald green notebook
      bgGlow: 'from-blue-100 to-indigo-50',
      badgeBg: 'bg-blue-100 text-blue-700',
    },
    visualTraits: {
      hairOrFur: 'Neat, soft curly dark-brown hair framing his forehead.',
      eyesAndGlasses: 'Charming round tortoiseshell glasses over warm dark brown eyes.',
      clothing: 'Cozy sky-blue pullover hoodie with cream drawstrings, paired with durable khaki shorts.',
      footwear: 'Sporty blue sneakers with white soles and blue laces.',
      backpack: 'Sturdy navy-blue backpack with side bottle pocket for adventure tools.',
      signatureAccessory: 'Round circular spectacles that sparkle when solving a math riddle.',
    },
    personality: 'Patient, gentle, analytical, structured. Sancho is a boy (not a dog!) who loves building blocks, comparing sizes (bigger/smaller), and geometry.',
    mathRole: 'Guides size comparison, addition concepts, spatial shapes, and organizing grouped objects.',
    catchphrases: {
      idle: "My map shows a riddle ahead. Want to check it out?",
      happy: "That fits just right! Great thinking!",
      thinking: "Let's see... if we put 2 here and 1 there, how many in total?",
      encouraging: "Take your time! Every great explorer learns step by step.",
      celebration: "Bingo! Exactly right! You're a super math detective!"
    }
  },
  {
    id: 'osi',
    name: 'Osi',
    role: 'The Playful Scout',
    age: 'Puppy (2 yrs)',
    species: 'Dog',
    heightCm: 28,
    heightRelative: 'Small companion pup (~0.27x height of Sancho)',
    colorTheme: {
      primary: '#854D0E', // All-brown warm fur
      secondary: '#3B82F6', // Blue bandana and glasses
      accent: '#F59E0B', // Golden treat star
      bgGlow: 'from-amber-100 to-orange-50',
      badgeBg: 'bg-amber-100 text-amber-800',
    },
    visualTraits: {
      hairOrFur: 'All-brown, fluffy Shih Tzu puppy fur with soft rounded ear tufts and curly tail.',
      eyesAndGlasses: 'Tiny round sky-blue glasses perched cutely over his dark button nose and shiny eyes.',
      clothing: 'Vibrant sky-blue bandana around neck featuring a crisp white paw-print badge.',
      footwear: 'Four soft paws with mocha pads (no shoes).',
      backpack: 'Tiny miniature navy doggy backpack strapped snugly across back.',
      signatureAccessory: 'Blue glasses + White paw print bandana + Bouncing happy tail wag.',
    },
    personality: 'Affectionate, goofy, sensory-driven scout. Barks happily in counts (Woof! Woof!), nudges objects with nose, and celebrates with playful spins.',
    mathRole: 'Guides auditory counting (bark counts), tracking moving objects, and emotional comfort.',
    catchphrases: {
      idle: "*Tail wags* Woof! The trail smells like yummy numbers!",
      happy: "Arf arf! High paw! That was so fun!",
      thinking: "*Tilts head, paws chin* Rrrr? Which one is the biggest?",
      encouraging: "Woof woof! You can do it! I'm cheering for you!",
      celebration: "*Happy spin and joyful bounce* WOOF! Triple star victory!"
    }
  }
];

export const COUNTING_OBJECTS: CountingObject[] = [
  {
    id: 'apple',
    name: 'Sweet Ruby Apple',
    category: 'fruit',
    color: '#EF4444',
    soundPitch: 1,
    description: 'Chunky rounded red apple with a glossy soft-3D shine, tiny brown stem, and single lime leaf.',
    mathUsage: 'Primary one-to-one counting, fruit basket sorting, subtraction ("one eaten!").'
  },
  {
    id: 'star',
    name: 'Golden Glow Star',
    category: 'celestial',
    color: '#FBBF24',
    soundPitch: 2,
    description: 'Soft 3D star with rounded bevel tips, friendly curved smile, and warm ambient golden halo.',
    mathUsage: 'Level milestones, score tallies, pattern sequencing (1 star, 2 stars, 3 stars).'
  },
  {
    id: 'frog',
    name: 'Bouncy Meadow Frog',
    category: 'nature',
    color: '#10B981',
    soundPitch: 3,
    description: 'Adorable rounded emerald tree frog with peach belly spots, big round eyes, and jumpy legs.',
    mathUsage: 'Number line jumps, skip counting, interactive hop animations.'
  },
  {
    id: 'ball',
    name: 'Playful Polka Ball',
    category: 'toy',
    color: '#3B82F6',
    soundPitch: 4,
    description: 'Soft rubber playground ball with pastel turquoise, peach, and periwinkle curved geometric segments.',
    mathUsage: 'Grouping by 2s and 5s, physics bouncy interactions, spatial balance.'
  },
  {
    id: 'flower',
    name: 'Sunny Meadow Blossom',
    category: 'nature',
    color: '#EC4899',
    soundPitch: 5,
    description: 'Chunky 5-petal daisy with lavender-pink petals and a warm smiling buttercup center.',
    mathUsage: 'Petal counting, color sorting, symmetrical patterning.'
  }
];

export const MAP_DESTINATIONS: MapDestination[] = [
  {
    id: 'dest_01',
    number: 1,
    title: 'Sunny Meadow',
    theme: 'Sunny Blossom Hill & Apple Orchard',
    mathTopic: 'First Addition (Totals ≤ 5)',
    learningGoal: 'Addition with totals no greater than 5 (e.g., 1 + 1, 2 + 2).',
    status: 'unlocked',
    starsEarned: 0,
    totalStars: 3,
    xPercent: 18,
    yPercent: 88,
    accentColor: '#10B981'
  },
  {
    id: 'dest_02',
    number: 2,
    title: 'Counting Forest',
    theme: 'Giant Whispering Mushroom Forest',
    mathTopic: 'Counting and Addition (Totals ≤ 10)',
    learningGoal: 'Count objects and add quantities with totals no greater than 10.',
    status: 'locked',
    starsEarned: 0,
    totalStars: 3,
    xPercent: 42,
    yPercent: 80,
    accentColor: '#059669'
  },
  {
    id: 'dest_03',
    number: 3,
    title: 'Number Bridge',
    theme: 'Rainbow River Wooden Crossing',
    mathTopic: 'Basic Subtraction (Nonnegative)',
    learningGoal: 'Take objects away with nonnegative answers and visual demonstrations.',
    status: 'locked',
    starsEarned: 0,
    totalStars: 3,
    xPercent: 72,
    yPercent: 72,
    accentColor: '#D97706'
  },
  {
    id: 'dest_04',
    number: 4,
    title: 'Candy Valley',
    theme: 'Gummy Bear & Swirl Lollipop Pastures',
    mathTopic: 'Mixed Operations (Within 10)',
    learningGoal: 'Mix basic addition and subtraction within 10.',
    status: 'locked',
    starsEarned: 0,
    totalStars: 3,
    xPercent: 82,
    yPercent: 58,
    accentColor: '#EC4899'
  },
  {
    id: 'dest_05',
    number: 5,
    title: 'Shape Hills',
    theme: 'Geometric Rolling Pyramids',
    mathTopic: 'Missing Numbers',
    learningGoal: 'Find unknown numbers in addition and subtraction (e.g., 3 + ? = 5, 7 − ? = 4).',
    status: 'locked',
    starsEarned: 0,
    totalStars: 3,
    xPercent: 54,
    yPercent: 50,
    accentColor: '#8B5CF6'
  },
  {
    id: 'dest_06',
    number: 6,
    title: 'Starry Lake',
    theme: 'Sparkling Twilight Waters & Lilypads',
    mathTopic: 'Addition and Subtraction to 20',
    learningGoal: 'Age-appropriate sums and differences within 20 with visual aids.',
    status: 'locked',
    starsEarned: 0,
    totalStars: 3,
    xPercent: 22,
    yPercent: 42,
    accentColor: '#3B82F6'
  },
  {
    id: 'dest_07',
    number: 7,
    title: 'Puzzle Mountain',
    theme: 'Stepping Stone Cliffs & Gem Caverns',
    mathTopic: 'Patterns and Sequences',
    learningGoal: 'Complete clear numerical, color, shape, and object patterns.',
    status: 'locked',
    starsEarned: 0,
    totalStars: 3,
    xPercent: 32,
    yPercent: 28,
    accentColor: '#6366F1'
  },
  {
    id: 'dest_08',
    number: 8,
    title: 'Rocket Station',
    theme: 'Starlit Space Launchpad',
    mathTopic: 'Multi-Step Math',
    learningGoal: 'Two simple operations with an explicit, unambiguous sequence.',
    status: 'locked',
    starsEarned: 0,
    totalStars: 3,
    xPercent: 64,
    yPercent: 22,
    accentColor: '#EA580C'
  },
  {
    id: 'dest_09',
    number: 9,
    title: 'Crystal Castle',
    theme: 'Rainbow Prism Fortress & Spires',
    mathTopic: 'Grouping & Early Multiplication',
    learningGoal: 'Equal groups and repeated addition before introducing multiplication symbols.',
    status: 'locked',
    starsEarned: 0,
    totalStars: 3,
    xPercent: 86,
    yPercent: 14,
    accentColor: '#A855F7'
  },
  {
    id: 'dest_10',
    number: 10,
    title: 'Math Master Island',
    theme: 'Golden Floating Island in the Sky',
    mathTopic: 'Math Word Problems',
    learningGoal: 'Short illustrated stories with familiar characters (Andy, Sancho, and Osi).',
    status: 'locked',
    starsEarned: 0,
    totalStars: 3,
    xPercent: 50,
    yPercent: 7,
    accentColor: '#EAB308'
  }
];

export const ASSET_INVENTORY: AssetItem[] = [
  // Characters
  {
    id: 'AST-CHR-01',
    name: 'Andy - Full Rig',
    category: 'character',
    fileName: 'char_andy_full_v01.svg',
    format: 'SVG',
    dimensions: '512 x 768 px',
    variants: ['Idle', 'Walking', 'Pose_HandsOnHips', 'Trio_Lockup'],
    description: 'Girl with curly brown hair, pink outfit, denim shorts, pink sneakers, purple backpack, star hair clip.',
    specNotes: 'Layered vector groups for hair coils, star clip, head, torso, backpack straps, limbs.'
  },
  {
    id: 'AST-CHR-02',
    name: 'Sancho - Full Rig',
    category: 'character',
    fileName: 'char_sancho_full_v01.svg',
    format: 'SVG',
    dimensions: '512 x 860 px',
    variants: ['Idle', 'Walking', 'Pose_HoldingNotebook', 'Trio_Lockup'],
    description: 'Boy taller than Andy, curly dark-brown hair, round glasses, blue hoodie, khaki shorts, blue sneakers, backpack.',
    specNotes: 'Spectacle frame group with subtle lens glare layer. Taller baseline proportion preserved.'
  },
  {
    id: 'AST-CHR-03',
    name: 'Osi - Full Rig',
    category: 'character',
    fileName: 'char_osi_full_v01.svg',
    format: 'SVG',
    dimensions: '400 x 380 px',
    variants: ['Idle', 'Wagging', 'Pose_PawRaised', 'Trio_Lockup'],
    description: 'Small Shih Tzu dog with all-brown fur, blue glasses, blue bandana with white paw print, small backpack.',
    specNotes: 'Fluffy contour paths with rounded joints. Bandana paw badge centered.'
  },
  // Expressions
  {
    id: 'AST-EXP-01',
    name: 'Expression Matrix - Andy',
    category: 'expression',
    fileName: 'char_andy_exp_[type]_v01.svg',
    format: 'SVG',
    dimensions: '256 x 256 px',
    variants: ['idle', 'happy', 'thinking', 'encouraging', 'celebration'],
    description: 'Modular facial layers: eyebrow curvature, eye shapes (open, sparkle, wink, squint), mouth shapes.',
    specNotes: 'Star clip twinkles during celebration state.'
  },
  {
    id: 'AST-EXP-02',
    name: 'Expression Matrix - Sancho',
    category: 'expression',
    fileName: 'char_sancho_exp_[type]_v01.svg',
    format: 'SVG',
    dimensions: '256 x 256 px',
    variants: ['idle', 'happy', 'thinking', 'encouraging', 'celebration'],
    description: 'Round glasses tilt slightly during thinking; warm friendly beam on celebration.',
    specNotes: 'Clear eye pupils visible through circular frames.'
  },
  {
    id: 'AST-EXP-03',
    name: 'Expression Matrix - Osi',
    category: 'expression',
    fileName: 'char_osi_exp_[type]_v01.svg',
    format: 'SVG',
    dimensions: '256 x 256 px',
    variants: ['idle', 'happy', 'thinking', 'encouraging', 'celebration'],
    description: 'Doggy expressions: tongue pant, ear cock, curious head tilt, joyful barking smile.',
    specNotes: 'Preserve round blue glasses across all 5 states.'
  },
  // Map Artwork
  {
    id: 'AST-MAP-01',
    name: 'Adventure Map Backdrop Art',
    category: 'map_background',
    fileName: 'bg_adventure_map_clean_v01.webp',
    format: 'WebP',
    dimensions: '2560 x 1440 px',
    variants: ['Clean_Day', 'Sunset_Golden', 'Night_Starry'],
    description: 'Soft 3D landscape with rolling hills, winding dirt trail, gentle rivers, fluffy clouds. Completely zero text or buttons in artwork.',
    specNotes: 'Strict decoupling: UI tokens, pathway lines, and level nodes placed in React interface layer.'
  },
  {
    id: 'AST-DST-01',
    name: 'Destination Token Set',
    category: 'destination',
    fileName: 'token_dest_[id]_v01.svg',
    format: 'SVG',
    dimensions: '160 x 160 px',
    variants: ['Meadow', 'Grove', 'Lagoon', 'Summit', 'Castle'],
    description: 'Thematic 3D landmark icons: blossom hill, giant toadstool, sparkling lilypad, snowy peak, pastel turret.',
    specNotes: 'Circular baseplate with soft drop-shadow.'
  },
  // Counting Objects
  {
    id: 'AST-OBJ-01',
    name: 'Counting Object - Apple',
    category: 'counting_object',
    fileName: 'obj_count_apple_v01.svg',
    format: 'SVG',
    dimensions: '128 x 128 px',
    variants: ['Normal', 'Collected', 'Selected', 'Outline'],
    description: 'Ruby red apple with soft bevel gloss highlight, curved leaf, drop shadow.',
    specNotes: 'Minimum touch target container 64x64px for preschool fingers.'
  },
  {
    id: 'AST-OBJ-02',
    name: 'Counting Object - Star',
    category: 'counting_object',
    fileName: 'obj_count_star_v01.svg',
    format: 'SVG',
    dimensions: '128 x 128 px',
    variants: ['Normal', 'Glow', 'Collected', 'Spinning'],
    description: 'Rounded 5-point golden star with friendly curved eyes and soft radiant aura.',
    specNotes: 'SVGs use radial gradients for gentle clay/3D volume.'
  },
  {
    id: 'AST-OBJ-03',
    name: 'Counting Object - Frog',
    category: 'counting_object',
    fileName: 'obj_count_frog_v01.svg',
    format: 'SVG',
    dimensions: '128 x 128 px',
    variants: ['Sit', 'Jump', 'Ribbit', 'Collected'],
    description: 'Emerald tree frog with circular peach spots and friendly smile.',
    specNotes: 'Supports CSS bounce transform animation.'
  },
  {
    id: 'AST-OBJ-04',
    name: 'Counting Object - Ball',
    category: 'counting_object',
    fileName: 'obj_count_ball_v01.svg',
    format: 'SVG',
    dimensions: '128 x 128 px',
    variants: ['Normal', 'Squashed', 'Rolling', 'Collected'],
    description: 'Striped beach ball with pastel blue, peach, and mint segments.',
    specNotes: 'Radial spherical gradient for soft rubber depth.'
  },
  {
    id: 'AST-OBJ-05',
    name: 'Counting Object - Flower',
    category: 'counting_object',
    fileName: 'obj_count_flower_v01.svg',
    format: 'SVG',
    dimensions: '128 x 128 px',
    variants: ['Normal', 'Wiggle', 'Picked', 'Blooming'],
    description: 'Pink daisy with sunny yellow center button and 5 rounded petals.',
    specNotes: 'Interactive petal click highlights.'
  },
  // UI Kit Elements
  {
    id: 'AST-UI-01',
    name: 'Chunky Action Button Primary',
    category: 'ui_element',
    fileName: 'ui_btn_primary_[state].svg',
    format: 'SVG',
    dimensions: '240 x 72 px',
    variants: ['Default', 'Hover', 'Active_Pressed', 'Disabled'],
    description: 'Soft 3D pill button with 6px tactile extrusion, glossy top reflection, bold icon.',
    specNotes: 'CSS active transform translateY(4px) simulates real push toy.'
  },
  {
    id: 'AST-UI-02',
    name: 'Level Star Reward System',
    category: 'ui_element',
    fileName: 'ui_reward_star_[state].svg',
    format: 'SVG',
    dimensions: '96 x 96 px',
    variants: ['Empty_Slot', 'Bronze', 'Silver', 'Gold_Full'],
    description: 'Thick beveled reward stars with sparkling particle effect on earning.',
    specNotes: 'Displays in clusters of 3 on level nodes and end summaries.'
  },
  {
    id: 'AST-UI-03',
    name: 'Lock & Key System',
    category: 'ui_element',
    fileName: 'ui_lock_[state].svg',
    format: 'SVG',
    dimensions: '80 x 80 px',
    variants: ['Locked_Silver', 'Unlocked_Open', 'Shaking_Denial'],
    description: 'Friendly rounded padlock with smiling keyhole and shiny metal hoop.',
    specNotes: 'Rotates hoop 45 degrees on unlock sequence with sound.'
  },
  {
    id: 'AST-UI-04',
    name: 'Progress Path & Milestone Bar',
    category: 'ui_element',
    fileName: 'ui_progress_tracker.svg',
    format: 'SVG',
    dimensions: '480 x 48 px',
    variants: ['SteppingStones', 'ContinuousBar', 'AvatarPin'],
    description: 'Chunky rounded track with wooden border, pastel fill, and Osi head avatar moving along it.',
    specNotes: 'Accessible high-contrast indicator with current number digit.'
  }
];

export const COLOR_PALETTE: ColorSwatch[] = [
  {
    name: 'Cotton Candy Pink',
    hex: '#F472B6',
    role: 'Andy Signature / Joy Accent',
    usage: 'Andy outfit, active selection rings, celebration confetti',
    contrastRatio: '4.8:1 on dark / 3.9:1 on white (with outline)'
  },
  {
    name: 'Sky Explorer Blue',
    hex: '#3B82F6',
    role: 'Sancho & Osi Brand / Primary Nav',
    usage: 'Sancho hoodie, Osi bandana & glasses, primary interactive buttons',
    contrastRatio: '5.2:1 against white'
  },
  {
    name: 'Meadow Sprout Green',
    hex: '#10B981',
    role: 'Success / Nature Counting',
    usage: 'Correct answer rings, frogs, grass paths, unlock checkmarks',
    contrastRatio: '4.6:1 against dark / 3.2:1 against white'
  },
  {
    name: 'Sunshine Star Gold',
    hex: '#FBBF24',
    role: 'Reward & Star Highlights',
    usage: 'Reward stars, star hair clip, celebration sparkles, highlights',
    contrastRatio: '3.1:1 (paired with warm amber outline #B45309)'
  },
  {
    name: 'Lilac Adventure Purple',
    hex: '#8B5CF6',
    role: 'Mystery & Backpacks',
    usage: 'Andy backpack, magical castle accents, thinking thought bubbles',
    contrastRatio: '5.1:1 against white'
  },
  {
    name: 'Shih Tzu Warm Mocha',
    hex: '#78350F',
    role: 'Osi Fur / Warm Outlines',
    usage: 'Osi fur body, rich warm line art, soft earth ground surfaces',
    contrastRatio: '8.4:1 against white (WCAG AAA)'
  },
  {
    name: 'Cream Canvas Background',
    hex: '#FDFCF7',
    role: 'Dominant 60% Canvas Field',
    usage: 'Soft gentle warm paper background, comfortable on young eyes',
    contrastRatio: 'Base Canvas'
  },
  {
    name: 'Soft Shadow Slate',
    hex: '#1E293B',
    role: 'High-Legibility Text & Contrast',
    usage: 'Main text headlines, instructions, high-contrast readable numbers',
    contrastRatio: '14.2:1 against Cream Canvas'
  }
];
