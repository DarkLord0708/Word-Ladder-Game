import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ===================================================================
 * Word Ladder — single-file React + Tailwind app
 * -------------------------------------------------------------------
 * Two tabs:
 *   1. Play   - random Start/Target puzzle. Player builds a ladder by
 *               changing exactly one letter per step.
 *   2. Solver - user enters any two 4-letter dictionary words; BFS
 *               returns the absolute shortest ladder between them.
 *
 * Everything (dictionary, BFS, UI) lives in this file so the project
 * has minimal files: main.jsx, App.jsx, index.css, plus config.
 * =================================================================== */

/* -------------------------------------------------------------------
 * 1. Dictionary
 * ------------------------------------------------------------------- */
const WORDS = [
  "able","ably","ache","achy","acid","acne","acre","aged","ages","ahem",
  "aide","aids","aims","airs","airy","ajar","akin","alas","ales","alms",
  "aloe","also","alto","amen","amid","ammo","amok","amps","anew","anti",
  "ants","aped","apes","apex","apps","apse","arch","arcs","area","arid","arks",
  "arms","army","arts","arty","ashy","asks","atom","aunt","aura","auto",
  "aver","avid","avow","away","awed","awes","awry","axes","axis","axle",
  "babe","baby","back","bade","bags","bail","bait","bake","bald",
  "bale","balk","ball","balm","band","bane","bang","bank","barb","bard",
  "bare","barf","bark","barn","bars","base","bash","bask","bass","bath",
  "bats","baud","bawd","bawl","bays","bead","beak","beam","bean","bear",
  "beat","beau","beck","beds","beef","been","beep","beer","bees","beet",
  "begs","bell","belt","bend","bent","best","beta","bets","bevy","bias",
  "bibs","bide","bids","bier","bike","bile","bilk","bill","bind","bins",
  "bios","bird","bite","bits","blab","blah","bled","blew","blip","blob",
  "bloc","blog","blot","blow","blue","blur","boar","boat","bobs","bode",
  "body","bogs","boil","bold","bole","bolt","bomb","bond","bone","bong",
  "bony","book","boom","boon","boor","boos","boot","bops","bore","born",
  "boss","both","bout","bowl","bows","boys","bozo","brag","bran","bras",
  "bray","bred","brew","brig","brim","brow","buck","buds","buff","bugs",
  "bulb","bulk","bull","bump","bums","bung","bunk","buns","buoy","burl",
  "burn","burp","burr","burs","bury","bush","bust","busy","butt","buys",
  "buzz","byes","byte","cabs","cafe","cage","cake","calf","call","calm",
  "came","camp","cane","cans","cape","caps","card","care","carp","cars",
  "cart","case","cash","cask","cast","cats","cave","caws","cell","cent",
  "chap","char","chat","chef","chew","chic","chin","chip","chit","chop",
  "chow","chub","chug","chum","cite","city","clad","clam","clan","clap",
  "claw","clay","clip","clod","clog","clop","clot","cloy","club","clue",
  "coal","coat","coax","cobs","cock","coco","coda","code","cods","coed",
  "cogs","coif","coil","coin","coke","cola","cold","cole","colt","coma",
  "comb","come","cone","cons","cony","cook","cool","coop","coos","coot",
  "cope","cops","copy","cord","core","cork","corn","cost","cosy","cots",
  "coup","cove","cowl","cows","cozy","crab","crag","cram","crap","craw",
  "crew","crib","crop","crow","crud","crus","crux","cube","cubs","cued",
  "cues","cuff","cull","cult","cups","curb","curd","cure","curl","curs",
  "curt","cusp","cuss","cute","cuts","cyan","cyst","czar","dabs","dads",
  "daft","dais","dale","dame","damn","damp","dams","dank","dare","dark",
  "darn","dart","dash","data","date","daub","dawn","days","daze","dead",
  "deaf","deal","dean","dear","debt","deck","deed","deem","deep","deer",
  "deft","defy","deli","dell","demo","dens","dent","deny","desk","dews",
  "dewy","dial","dice","died","dies","diet","digs","dike","dill","dime",
  "dims","dine","ding","dins","dint","dips","dire","dirt","disc","dish",
  "disk","diss","diva","dive","does","doff","dogs","dole","doll","dolt",
  "dome","done","dons","doom","door","dope","dorm","dory","dose","doss",
  "dote","dots","dour","dove","down","doze","dozy","drab","drag","dram",
  "drat","draw","dray","drew","drip","drop","drub","drug","drum","drys",
  "dual","dubs","duct","dude","duds","duel","dues","duet","duff","duke",
  "dull","duly","dumb","dump","dune","dung","dunk","duns","dupe","dusk",
  "dust","duty","dyad","dyed","dyer","dyes","dyne","each","earl","earn",
  "ears","ease","east","easy","eats","ebbs","echo","eddy","edge","edgy",
  "edit","eels","eggs","egos","eked","ekes","elks","ells","else","emir",
  "emit","emus","ends","envy","epic","eras","ergo","errs","etch","even",
  "ever","eves","evil","ewes","exam","exes","exit","eyed","eyes","face",
  "fact","fade","fads","fail","fair","fake","fall","fame","fang","fans",
  "fare","farm","fart","fast","fate","fats","faux","fave","fawn","faze",
  "fear","feat","feds","feed","feel","fees","feet","fell","felt","fend",
  "fens","fern","fess","feta","fete","feud","fibs","fief","fife","figs",
  "file","fill","film","find","fine","fink","fins","fire","firm","firs",
  "fish","fist","fits","five","fizz","flab","flag","flak","flan","flap",
  "flat","flaw","flax","flea","fled","flee","flew","flex","flip","flit",
  "floe","flog","flop","flow","flub","flue","flux","foal","foam","fobs",
  "foes","fogs","fogy","foil","fold","folk","fond","font","food","fool",
  "foot","fops","ford","fore","fork","form","fort","foul","four","fowl",
  "foxy","frat","fray","free","fret","frog","from","fuel","full","fume",
  "fund","funk","furs","fury","fuse","fuss","fuzz","gaff","gage","gags",
  "gain","gait","gala","gale","gall","gals","game","gang","gaol","gape",
  "gaps","garb","gash","gasp","gate","gave","gawk","gays","gaze","gear",
  "geek","geld","gels","gems","gene","gent","germ","gets","ghat","gibe",
  "gift","gigs","gild","gill","gilt","gins","gird","girl","girt","gist",
  "give","glad","glee","glib","glob","glop","glow","glue","glum","glut",
  "gnat","gnaw","goad","goal","goat","gobs","gods","goer","goes","gold",
  "golf","gone","gong","good","goof","gook","goon","gore","gory","gosh",
  "gout","gown","grab","grad","gram","gray","grew","grey","grid","grim",
  "grin","grip","grit","grog","grow","grub","guff","gulf","gull","gulp",
  "gums","gunk","guns","guru","gush","gust","guts","guys","gyms","gyps",
  "hack","hags","hail","hair","hake","hale","half","hall","halo","halt",
  "hams","hand","hang","hank","hard","hare","hark","harm","harp","hash",
  "hasp","hate","hath","hats","haul","have","hawk","haws","hays","haze",
  "hazy","head","heal","heap","hear","heat","heck","heed","heel","heft",
  "heir","held","hell","helm","help","hemp","hems","hens","herb","herd",
  "here","hero","hers","hewn","hews","hick","hide","high","hike","hill",
  "hilt","hims","hind","hint","hips","hire","hiss","hits","hive","hoax",
  "hobo","hobs","hock","hods","hoed","hoes","hogs","hold","hole","holy",
  "home","hone","honk","hood","hoof","hook","hoop","hoot","hope","hops",
  "horn","hose","host","hots","hour","hove","howl","hows","hubs","huff",
  "huge","hugs","hula","hulk","hull","hump","hums","hung","hunk","huns",
  "hunt","hurl","hurt","hush","husk","huts","hymn","hype","hypo","ibex",
  "ibis","iced","ices","icky","icon","idea","ides","idle","idly","idol",
  "iffy","ilks","ills","imps","inch","info","inks","inky","inns","into",
  "ions","iota","ires","iris","irks","iron","isle","itch","item","jabs",
  "jack","jade","jail","jamb","jams","jape","jars","java","jaws","jays",
  "jazz","jeep","jeer","jell","jerk","jest","jets","jibe","jibs","jigs",
  "jilt","jinx","jive","jobs","jock","jogs","john","join","joke","jolt",
  "josh","jots","joys","judo","jugs","juju","juke","jump","junk","jury",
  "just","jute","juts","kale","keel","keen","keep","kegs","kelp","kept",
  "keys","kick","kids","kiln","kilo","kilt","kind","king","kink","kins",
  "kips","kirk","kiss","kite","kits","kiwi","knee","knew","knit","knob",
  "knot","know","kohl","labs","lace","lack","lacy","lade","lads","lady",
  "lags","laid","lain","lair","lake","lamb","lame","lamp","lams","land",
  "lane","laps","lard","lark","lash","lass","last","late","lath","laud",
  "lava","lawn","laws","lays","laze","lazy","lead","leaf","leak","lean",
  "leap","leas","leek","leer","lees","left","legs","lend","lens","lent",
  "lest","lets","levy","liar","libs","lice","lick","lids","lied","lien",
  "lies","lieu","life","lift","like","lilt","lily","limb","lime","limn",
  "limo","limp","line","ling","link","lint","lion","lips","lira","lisp",
  "list","lite","live","load","loaf","loam","loan","lobe","lobs","loci",
  "lock","loco","lode","loft","loge","logo","logs","loin","loll","lone",
  "long","look","loom","loon","loop","loos","loot","lope","lops","lord",
  "lore","lose","loss","lost","loth","lots","loud","love","lows","luau",
  "lube","luck","lugs","lull","lump","lung","lure","lurk","lush","lust",
  "lute","lyes","lynx","lyre","mace","made","mage","magi","mags","maid",
  "mail","maim","main","make","male","mall","malt","mama","mane","many",
  "maps","mare","mark","mars","mart","mash","mask","mass","mast","mate",
  "math","mats","matt","maul","maws","mayo","mays","maze","mead","meal",
  "mean","meat","meek","meet","meld","mels","melt","memo","mend","menu",
  "meow","mere","mesa","mesh","mess","meta","mete","mews","mica","mice",
  "mick","midi","mids","miff","mike","mild","mile","milk","mill","mils",
  "mime","mind","mine","ming","mini","mink","mins","mint","minx","mire",
  "miry","mise","miss","mist","mite","mitt","moan","moat","mobs","mock",
  "mode","mods","mojo","mold","mole","molt","mono","mood","moon","moor",
  "moos","moot","mope","mops","more","morn","mosh","moss","most","mote",
  "moth","move","mown","mows","much","muck","muff","mugs","mule","mull",
  "mums","muon","muse","mush","musk","muss","must","mute","mutt","myth",
  "nabs","nada","nags","nail","name","naps","narc","nard","nark","nary",
  "nave","navy","nays","near","neat","neck","need","neon","nerd","ness",
  "nest","nets","news","newt","next","nibs","nice","nick","nigh","nine",
  "nips","nits","nobs","node","nods","noes","none","nook","noon","nope",
  "norm","nose","nosh","nosy","note","noun","nous","nova","nubs","nude",
  "nuke","null","numb","nuns","nuts","oafs","oaks","oars","oast","oath",
  "oats","obey","oboe","odds","odes","odor","offs","ogle","ogre","ohms",
  "oils","oily","oink","okay","okra","olds","ones","only","onto","onus",
  "onyx","oohs","oops","ooze","oozy","opal","open","opts","opus","oral",
  "orbs","ores","orgy","ouch","ours","oust","outs","oval","oven","over",
  "owed","owes","owls","owns","oxen","pace","pack","pact","pads","page",
  "paid","pail","pain","pair","pale","pall","palm","pals","pang","pans",
  "pant","papa","paps","para","pard","pare","park","pars","part","pass",
  "past","pate","path","pats","pave","pawl","pawn","paws","pays","peak",
  "peal","pear","peas","peat","peck","peek","peel","peep","peer","pegs",
  "pelt","pens","pent","peon","peps","perk","perm","pert","pest","pets",
  "pews","phew","pica","pick","pied","pier","pies","pigs","pike","pile",
  "pill","pimp","pine","ping","pink","pins","pint","piny","pipe","pips",
  "pita","pith","pits","pity","pixy","plan","play","plea","pled","plod",
  "plop","plot","plow","ploy","plug","plum","plus","pock","pods","poem",
  "poet","pogo","poke","poky","pole","poll","polo","pomp","pond","pone",
  "pong","pons","pony","pooh","pool","poop","poor","pope","pops","pore",
  "pork","porn","port","pose","posh","post","posy","pots","pour","pout",
  "pows","pram","pray","prep","prey","prig","prim","prod","prof","prom",
  "prop","pros","prow","puck","puds","puff","pugs","puke","pull","pulp",
  "puma","pump","punk","puns","punt","puny","pupa","pups","pure","purl",
  "purr","push","puss","puts","putt","pyre","pyro","quad","quay","quid",
  "quip","quit","quiz","race","rack","racy","rads","raft","rage","rags",
  "raid","rail","rain","raja","rake","ramp","rams","rang","rank","rant",
  "raps","rapt","rare","rash","rasp","rate","rats","rave","raws","rays",
  "raze","read","real","ream","reap","rear","reck","reds","reed","reef",
  "reek","reel","refs","rein","rely","rend","rent","reps","rest","revs",
  "rial","ribs","rice","rich","rick","ride","rids","rife","riff","rift",
  "rigs","rile","rill","rime","rims","rind","ring","rink","riot","ripe",
  "rips","rise","risk","rite","road","roam","roar","robe","robs","rock",
  "rode","rods","roes","role","roll","romp","roof","rook","room","root",
  "rope","rose","rosy","rote","rots","roue","rout","rove","rows","rube",
  "rubs","ruby","rude","rued","rues","ruff","rugs","ruin","rule","rump",
  "rune","rung","runs","runt","ruse","rush","rust","ruts","ryes","sack",
  "sacs","sage","sago","sags","said","sail","sake","sale","salt","same",
  "sand","sane","sang","sank","saps","sari","sash","sate","save","sawn",
  "saws","says","scab","scad","scam","scan","scar","scat","scot","scow",
  "scud","scum","seal","seam","sear","seas","seat","sect","seed","seek",
  "seem","seen","seep","seer","sees","self","sell","semi","send","sent",
  "sera","serf","sets","sewn","sews","sexy","shag","shah","sham","shed",
  "shes","shew","shim","shin","ship","shod","shoe","shoo","shop","shot",
  "show","shun","shut","sick","side","sift","sigh","sign","silk","sill",
  "silo","silt","sing","sink","sins","sips","sire","sirs","site","sits",
  "size","skat","skew","skid","skim","skin","skip","skis","skit","skua",
  "slab","slag","slam","slap","slat","slaw","slay","sled","slew","slid",
  "slim","slip","slit","slob","sloe","slog","slop","slot","slow","slug",
  "slum","slur","smit","smog","smug","smut","snag","snap","snip","snit",
  "snob","snot","snow","snub","snug","soak","soap","soar","sobs","sock",
  "soda","sods","sofa","soft","soil","sold","sole","sols","some","song",
  "sons","soon","soot","sops","sore","sort","soul","soup","sour","sown",
  "sows","soya","spam","span","spar","spas","spat","spay","spec","sped",
  "spew","spin","spit","spot","spry","spud","spun","spur","stab","stag",
  "star","stat","stay","stem","step","stet","stew","stir","stop","stow",
  "stub","stud","stum","stun","stye","subs","such","suck","suds","sued",
  "sues","suet","suit","sulk","sums","sung","sunk","suns","sups","sure",
  "surf","swab","swag","swam","swan","swap","swat","sway","swig","swim",
  "swum","sync","tabs","tack","taco","tact","tads","tags","tail","take",
  "talc","tale","talk","tall","tame","tamp","tang","tans","tape","taps",
  "tare","tarn","taro","tarp","tars","tart","task","tats","taut","taxi",
  "teak","teal","team","tear","teas","teat","tech","teds","teed","teem",
  "teen","tees","tell","temp","tend","tens","tent","term","tern","test",
  "text","than","that","thaw","thee","them","then","they","thin","this",
  "thou","thru","thud","thug","thus","tick","tics","tide","tidy","tied",
  "tier","ties","tiff","tile","till","tilt","time","tine","tins","tint",
  "tiny","tipi","tips","tire","toad","toed","toes","toff","tofu","toga",
  "togs","toil","told","toll","tomb","tome","toms","tone","tong","tons",
  "tony","took","tool","toot","tops","tore","torn","tors","tort","tory",
  "toss","tost","tote","tots","tour","tout","town","tows","toys","tram",
  "trap","tray","tree","trek","trev","trey","trim","trio","trip","trod",
  "trot","troy","true","tsar","tuba","tube","tubs","tuck","tufa","tuff",
  "tuft","tugs","tuna","tune","tuns","turd","turf","turn","tusk","tutu",
  "twas","twee","twig","twin","twit","twos","tyke","type","typo","tyre",
  "ugly","ulna","umps","undo","unit","unto","upon","urea","urge","urns",
  "used","user","uses","utes","vain","vale","vamp","vane","vans","vary",
  "vase","vast","vats","veal","veep","veer","veil","vein","vena","vend",
  "vent","verb","very","vest","vets","veto","vial","vibe","vice","vide",
  "vied","vies","view","vile","vine","vino","viny","viol","visa","vise",
  "viva","void","vole","volt","vote","vows","wack","wade","wadi","wads",
  "waft","wage","wags","waif","wail","wain","wait","wake","wale","walk",
  "wall","wand","wane","want","ward","ware","warm","warn","warp","wars",
  "wart","wary","wash","wasp","watt","wave","wavy","ways","weak","weal",
  "wean","wear","webs","weds","weed","week","weep","weft","weir","weld",
  "well","wend","wens","went","wept","were","west","wets","wham","what",
  "when","whet","whew","whey","whig","whim","whip","whir","whit","whiz",
  "whoa","whom","whop","whys","wick","wide","wife","wigs","wild","wile",
  "will","wilt","wily","wimp","wind","wine","wing","wink","wino","wins",
  "winy","wipe","wire","wiry","wise","wish","wisp","with","wits","woes",
  "woke","woks","wolf","womb","wont","wood","woof","wool","woos","word",
  "wore","work","worm","worn","wort","wove","wows","wrap","wren","writ",
  "wuss","wyes","yack","yaks","yams","yang","yank","yaps","yard","yarn",
  "yawl","yawn","yaws","yeah","year","yeas","yell","yelp","yens","yeps",
  "yeti","yews","yips","yobs","yoga","yogi","yoke","yolk","yore","your",
  "yowl","yoyo","yuck","yule","yups","zaps","zeal","zebu","zeds","zees",
  "zero","zest","zinc","zing","zips","zits","zone","zonk","zoom","zoos"
];
const WORD_SET = new Set(WORDS);

/* -------------------------------------------------------------------
 * 2. Word graph + BFS
 * ------------------------------------------------------------------- */
function differsByOne(a, b) {
  if (a.length !== b.length) return false;
  let diffs = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i] && ++diffs > 1) return false;
  }
  return diffs === 1;
}

// Built lazily and cached. Uses the wildcard-bucket trick to build
// adjacency in O(N * L) instead of O(N^2).
let _graph = null;
function buildGraph() {
  if (_graph) return _graph;
  const clean = WORDS.filter((w) => /^[a-z]{4}$/.test(w));
  const buckets = new Map();
  for (const word of clean) {
    for (let i = 0; i < 4; i++) {
      const pattern = word.slice(0, i) + "*" + word.slice(i + 1);
      if (!buckets.has(pattern)) buckets.set(pattern, []);
      buckets.get(pattern).push(word);
    }
  }
  const adj = new Map();
  for (const w of clean) adj.set(w, new Set());
  for (const list of buckets.values()) {
    if (list.length < 2) continue;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        adj.get(list[i]).add(list[j]);
        adj.get(list[j]).add(list[i]);
      }
    }
  }
  const final = new Map();
  for (const [w, s] of adj.entries()) final.set(w, Array.from(s));
  _graph = final;
  return final;
}

function bfsShortestPath(start, target) {
  start = start.toLowerCase();
  target = target.toLowerCase();
  if (!WORD_SET.has(start) || !WORD_SET.has(target)) return null;
  if (start === target) return [start];

  const g = buildGraph();
  if (!g.has(start) || !g.has(target)) return null;

  const queue = [start];
  const visited = new Set([start]);
  const parent = new Map();

  while (queue.length) {
    const cur = queue.shift();
    for (const nxt of g.get(cur) || []) {
      if (visited.has(nxt)) continue;
      visited.add(nxt);
      parent.set(nxt, cur);
      if (nxt === target) {
        const path = [target];
        let node = target;
        while (parent.has(node)) {
          node = parent.get(node);
          path.push(node);
        }
        return path.reverse();
      }
      queue.push(nxt);
    }
  }
  return null;
}

function pickRandomPair({ minSteps = 3, maxSteps = 6, attempts = 200 } = {}) {
  const g = buildGraph();
  const pool = Array.from(g.keys()).filter((w) => (g.get(w) || []).length > 0);
  if (!pool.length) return null;
  for (let i = 0; i < attempts; i++) {
    const s = pool[Math.floor(Math.random() * pool.length)];
    const t = pool[Math.floor(Math.random() * pool.length)];
    if (s === t) continue;
    const p = bfsShortestPath(s, t);
    if (!p) continue;
    const steps = p.length - 1;
    if (steps >= minSteps && steps <= maxSteps)
      return { start: s, target: t, path: p, steps };
  }
  // Fallback: any connected pair
  for (let i = 0; i < attempts; i++) {
    const s = pool[Math.floor(Math.random() * pool.length)];
    const t = pool[Math.floor(Math.random() * pool.length)];
    if (s === t) continue;
    const p = bfsShortestPath(s, t);
    if (p) return { start: s, target: t, path: p, steps: p.length - 1 };
  }
  return null;
}

/* -------------------------------------------------------------------
 * 3. Shared UI primitives
 * ------------------------------------------------------------------- */
function WordTile({ label, word, accent = "sky" }) {
  const ring =
    accent === "fuchsia"
      ? "ring-fuchsia-500/40 from-fuchsia-500/15 to-fuchsia-500/0"
      : "ring-sky-500/40 from-sky-500/15 to-sky-500/0";
  const labelColor =
    accent === "fuchsia" ? "text-fuchsia-300" : "text-sky-300";
  return (
    <div
      className={`rounded-2xl border border-slate-700/60 bg-gradient-to-b ${ring} ring-1 p-4 text-center backdrop-blur`}
    >
      <div
        className={`text-[10px] uppercase tracking-[0.25em] mb-1 ${labelColor}`}
      >
        {label}
      </div>
      <div className="font-mono text-2xl sm:text-3xl tracking-[0.4em] font-bold text-slate-100">
        {word.toUpperCase()}
      </div>
    </div>
  );
}

function LadderRung({ word, index, prev, kind }) {
  let badge = "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/40";
  let tile = "border-slate-700/60 bg-slate-800/40";
  if (kind === "start") {
    badge = "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/40";
    tile = "border-sky-500/30 bg-sky-500/5";
  } else if (kind === "target") {
    badge = "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40";
    tile = "border-emerald-500/40 bg-emerald-500/5";
  }
  const letters = word.toUpperCase().split("").map((ch, i) => ({
    ch,
    changed: prev ? prev.toUpperCase()[i] !== ch : false,
  }));
  return (
    <li className={`flex items-center gap-3 rounded-xl border ${tile} px-3 py-2`}>
      <span
        className={`text-xs font-bold rounded-md px-2 py-0.5 ${badge} min-w-[2.25rem] text-center`}
      >
        {index}
      </span>
      <div className="font-mono text-lg sm:text-xl tracking-[0.4em] flex gap-1">
        {letters.map((l, i) => (
          <span
            key={i}
            className={l.changed ? "text-amber-300 font-bold" : "text-slate-100"}
          >
            {l.ch}
          </span>
        ))}
      </div>
    </li>
  );
}

const LetterInput = React.forwardRef(function LetterInput(
  { label, value, onChange, accent = "sky", onEnter },
  ref
) {
  const labelColor =
    accent === "fuchsia" ? "text-fuchsia-300" : "text-sky-300";
  return (
    <label className="block">
      <span
        className={`block text-[10px] uppercase tracking-[0.25em] mb-1 ${labelColor}`}
      >
        {label}
      </span>
      <input
        ref={ref}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 4).toLowerCase()
          )
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" && onEnter) onEnter();
        }}
        maxLength={4}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder="____"
        className="w-full rounded-xl bg-slate-950/70 border border-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 outline-none px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] uppercase text-slate-100 placeholder-slate-600"
      />
    </label>
  );
});

/* -------------------------------------------------------------------
 * 4. Play tab (the original game)
 * ------------------------------------------------------------------- */
function PlayTab() {
  const [puzzle, setPuzzle] = useState(null);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [won, setWon] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);
  const errorTimerRef = useRef(null);

  const startNewGame = useCallback(() => {
    setLoading(true);
    setError("");
    setHistory([]);
    setInput("");
    setWon(false);
    setTimeout(() => {
      const pair = pickRandomPair({ minSteps: 3, maxSteps: 6 });
      if (!pair) {
        setError("Could not generate a puzzle. Try again.");
        setLoading(false);
        return;
      }
      setPuzzle({
        start: pair.start,
        target: pair.target,
        optimalPath: pair.path,
        par: pair.steps,
      });
      setLoading(false);
    }, 30);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    if (!loading && !won && inputRef.current) inputRef.current.focus();
  }, [loading, won, history.length]);

  useEffect(
    () => () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    },
    []
  );

  const flashError = (m) => {
    setError(m);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setError(""), 2200);
  };

  const previousWord = useMemo(() => {
    if (!puzzle) return "";
    return history.length ? history[history.length - 1] : puzzle.start;
  }, [history, puzzle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!puzzle || won) return;
    const word = input.trim().toLowerCase();
    if (word.length !== 4) return flashError("Word must be exactly 4 letters.");
    if (!/^[a-z]{4}$/.test(word))
      return flashError("Letters only — no numbers or symbols.");
    if (!WORD_SET.has(word)) return flashError("Not a valid word.");
    if (word === previousWord)
      return flashError("That's the same as the previous word.");
    if (history.includes(word))
      return flashError("You've already used that word in this chain.");
    if (!differsByOne(previousWord, word))
      return flashError("You must change exactly one letter.");

    const next = [...history, word];
    setHistory(next);
    setInput("");
    setError("");
    if (word === puzzle.target.toLowerCase()) setWon(true);
  };

  const steps = history.length;
  const par = puzzle?.par ?? 0;
  const diff = steps - par;
  const optimalPath = puzzle?.optimalPath || [];

  return (
    <div className="flex items-start sm:items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            Word Ladder
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Change one letter at a time to climb from{" "}
            <span className="text-slate-200 font-semibold">Start</span> to{" "}
            <span className="text-slate-200 font-semibold">Target</span>.
          </p>
        </header>

        {loading && (
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-8 text-center backdrop-blur">
            <div className="animate-pulse text-slate-300">Computing puzzle…</div>
          </div>
        )}

        {!loading && puzzle && (
          <>
            <section className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
              <WordTile label="Start" word={puzzle.start} accent="sky" />
              <WordTile label="Target" word={puzzle.target} accent="fuchsia" />
            </section>

            <section className="flex items-center justify-between text-sm mb-4">
              <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 px-3 py-1.5">
                <span className="text-slate-400">Steps:</span>{" "}
                <span className="font-semibold text-slate-100">{steps}</span>
              </div>
              <div className="rounded-lg bg-slate-800/60 border border-slate-700/60 px-3 py-1.5">
                <span className="text-slate-400">Previous word:</span>{" "}
                <span className="font-mono font-semibold text-slate-100 tracking-widest">
                  {previousWord.toUpperCase()}
                </span>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 sm:p-6 backdrop-blur mb-4">
              <h2 className="text-xs uppercase tracking-widest text-slate-400 mb-3">
                Your Ladder
              </h2>
              <ol className="space-y-2">
                <LadderRung word={puzzle.start} index={0} kind="start" />
                {history.map((w, i) => {
                  const isTarget = won && i === history.length - 1;
                  return (
                    <LadderRung
                      key={`${w}-${i}`}
                      word={w}
                      index={i + 1}
                      prev={i === 0 ? puzzle.start : history[i - 1]}
                      kind={isTarget ? "target" : "played"}
                    />
                  );
                })}
              </ol>
            </section>

            {!won ? (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 sm:p-6 backdrop-blur"
              >
                <label
                  htmlFor="word-input"
                  className="block text-xs uppercase tracking-widest text-slate-400 mb-2"
                >
                  Next word
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="word-input"
                    ref={inputRef}
                    value={input}
                    onChange={(e) =>
                      setInput(
                        e.target.value
                          .replace(/[^a-zA-Z]/g, "")
                          .slice(0, 4)
                          .toLowerCase()
                      )
                    }
                    maxLength={4}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="____"
                    className="flex-1 rounded-xl bg-slate-950/70 border border-slate-700 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 outline-none px-4 py-3 text-center sm:text-left text-2xl font-mono tracking-[0.5em] uppercase text-slate-100 placeholder-slate-600"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-sky-500 hover:bg-sky-400 active:bg-sky-600 transition px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-sky-500/20"
                  >
                    Submit
                  </button>
                </div>
                <div className="h-6 mt-3">
                  {error ? (
                    <p className="text-rose-400 text-sm">{error}</p>
                  ) : (
                    <p className="text-slate-500 text-xs">
                      Tip: change exactly one letter from{" "}
                      <span className="font-mono font-semibold text-slate-300">
                        {previousWord.toUpperCase()}
                      </span>
                      , then press Enter.
                    </p>
                  )}
                </div>
              </form>
            ) : (
              <SuccessPanel
                steps={steps}
                par={par}
                diff={diff}
                optimalPath={optimalPath}
                onPlayAgain={startNewGame}
              />
            )}

            <footer className="mt-6 text-center text-xs text-slate-500">
              Built with React + Tailwind • Optimal path computed by BFS.
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

function SuccessPanel({ steps, par, diff, optimalPath, onPlayAgain }) {
  let verdict;
  if (diff <= 0)
    verdict = { title: "Perfect! You matched the algorithm.", tone: "text-emerald-300", emoji: "🏆" };
  else if (diff <= 2)
    verdict = { title: "Great job — very close to optimal!", tone: "text-sky-300", emoji: "✨" };
  else
    verdict = { title: "Nice — you made it to the target!", tone: "text-indigo-300", emoji: "🎉" };

  return (
    <section className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-slate-900/60 p-6 backdrop-blur">
      <div className="text-center">
        <div className="text-4xl mb-2">{verdict.emoji}</div>
        <h2 className={`text-2xl font-bold ${verdict.tone}`}>{verdict.title}</h2>
        <p className="text-slate-300 mt-2">
          You finished in <span className="font-bold">{steps}</span> step
          {steps === 1 ? "" : "s"}. The optimal path is{" "}
          <span className="font-bold">{par}</span> step{par === 1 ? "" : "s"}.
        </p>
        <p className="text-slate-400 text-sm mt-1">
          {diff <= 0
            ? "You matched (or beat) the BFS algorithm — incredible."
            : `You were ${diff} step${diff === 1 ? "" : "s"} over par.`}
        </p>
      </div>
      <div className="mt-5">
        <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-2">
          Algorithm's optimal path
        </h3>
        <ol className="space-y-2">
          {optimalPath.map((w, i) => (
            <LadderRung
              key={`opt-${w}-${i}`}
              word={w}
              index={i}
              prev={i > 0 ? optimalPath[i - 1] : null}
              kind={
                i === 0
                  ? "start"
                  : i === optimalPath.length - 1
                  ? "target"
                  : "played"
              }
            />
          ))}
        </ol>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={onPlayAgain}
          className="rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 transition px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/20"
        >
          Play Again
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
 * 5. Solver tab (user provides start + target)
 * ------------------------------------------------------------------- */
function SolverTab() {
  const [start, setStart] = useState("");
  const [target, setTarget] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle"); // 'idle' | 'computing' | 'done' | 'error'
  const [error, setError] = useState("");
  const [elapsedMs, setElapsedMs] = useState(null);
  const startRef = useRef(null);

  useEffect(() => {
    startRef.current?.focus();
  }, []);

  const validate = () => {
    if (start.length !== 4 || target.length !== 4)
      return "Both words must be exactly 4 letters.";
    if (!/^[a-z]{4}$/.test(start) || !/^[a-z]{4}$/.test(target))
      return "Letters only — no numbers or symbols.";
    if (!WORD_SET.has(start))
      return `"${start.toUpperCase()}" is not in the dictionary.`;
    if (!WORD_SET.has(target))
      return `"${target.toUpperCase()}" is not in the dictionary.`;
    if (start === target) return "Start and target are the same word.";
    return null;
  };

  const handleSolve = (e) => {
    e?.preventDefault?.();
    setResult(null);
    setError("");
    setElapsedMs(null);
    const v = validate();
    if (v) {
      setError(v);
      setStatus("error");
      return;
    }
    setStatus("computing");
    setTimeout(() => {
      const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
      const path = bfsShortestPath(start, target);
      const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
      setElapsedMs(Math.max(0, t1 - t0));
      if (!path) {
        setError(
          `No path exists between "${start.toUpperCase()}" and "${target.toUpperCase()}" in this dictionary.`
        );
        setStatus("error");
        return;
      }
      setResult({ path, steps: path.length - 1 });
      setStatus("done");
    }, 20);
  };

  const handleSwap = () => {
    setStart(target);
    setTarget(start);
    setResult(null);
    setError("");
    setStatus("idle");
  };

  const handleClear = () => {
    setStart("");
    setTarget("");
    setResult(null);
    setError("");
    setStatus("idle");
    setElapsedMs(null);
    startRef.current?.focus();
  };

  return (
    <div className="flex items-start sm:items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
            Ladder Solver
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Enter any two 4-letter words from the dictionary. BFS returns the
            absolute shortest one-letter-change ladder.
          </p>
        </header>

        <form
          onSubmit={handleSolve}
          className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 sm:p-6 backdrop-blur"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LetterInput
              ref={startRef}
              label="Start word"
              value={start}
              onChange={setStart}
              accent="sky"
              onEnter={handleSolve}
            />
            <LetterInput
              label="Target word"
              value={target}
              onChange={setTarget}
              accent="fuchsia"
              onEnter={handleSolve}
            />
          </div>

          <div className="flex flex-wrap gap-3 mt-5 justify-center">
            <button
              type="submit"
              className="rounded-xl bg-sky-500 hover:bg-sky-400 active:bg-sky-600 transition px-5 py-2.5 font-semibold text-slate-950 shadow-lg shadow-sky-500/20"
            >
              Find Shortest Path
            </button>
            <button
              type="button"
              onClick={handleSwap}
              className="rounded-xl bg-slate-800 hover:bg-slate-700 transition px-4 py-2.5 font-medium text-slate-200 border border-slate-700/60"
            >
              ⇄ Swap
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-xl bg-slate-800 hover:bg-slate-700 transition px-4 py-2.5 font-medium text-slate-200 border border-slate-700/60"
            >
              Clear
            </button>
          </div>

          <div className="min-h-[1.5rem] mt-4 text-center">
            {status === "computing" && (
              <span className="text-slate-300 animate-pulse text-sm">
                Computing shortest path…
              </span>
            )}
            {status === "error" && error && (
              <span className="text-rose-400 text-sm">{error}</span>
            )}
            {status === "done" && result && (
              <span className="text-emerald-300 text-sm">
                Found a {result.steps}-step ladder
                {elapsedMs != null && (
                  <span className="text-slate-500">
                    {" "}
                    · solved in {elapsedMs.toFixed(1)} ms
                  </span>
                )}
              </span>
            )}
            {status === "idle" && (
              <span className="text-slate-500 text-xs">
                Both words must exist in the built-in dictionary.
              </span>
            )}
          </div>
        </form>

        {result && (
          <section className="mt-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 to-slate-900/60 p-4 sm:p-6 backdrop-blur">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-xs uppercase tracking-widest text-emerald-300">
                Shortest Ladder
              </h2>
              <span className="text-sm text-slate-300">
                <span className="font-bold text-slate-100">{result.steps}</span>{" "}
                step{result.steps === 1 ? "" : "s"} •{" "}
                <span className="font-bold text-slate-100">{result.path.length}</span>{" "}
                words
              </span>
            </div>
            <ol className="space-y-2">
              {result.path.map((w, i) => (
                <LadderRung
                  key={`${w}-${i}`}
                  word={w}
                  index={i}
                  prev={i > 0 ? result.path[i - 1] : null}
                  kind={
                    i === 0
                      ? "start"
                      : i === result.path.length - 1
                      ? "target"
                      : "played"
                  }
                />
              ))}
            </ol>

            <div className="mt-5">
              <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-1">
                Plain path
              </h3>
              <pre className="rounded-lg bg-slate-950/60 border border-slate-700/60 px-3 py-2 text-sm font-mono text-slate-200 overflow-x-auto">
                {result.path.map((w) => w.toUpperCase()).join(" → ")}
              </pre>
            </div>
          </section>
        )}

        <footer className="mt-6 text-center text-xs text-slate-500">
          Solver uses the same Breadth-First Search and word graph as the game.
        </footer>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
 * 6. Root App with tabs
 * ------------------------------------------------------------------- */
export default function App() {
  const [tab, setTab] = useState("play");
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="sticky top-0 z-20 backdrop-blur bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 px-4 py-3">
          {[
            { id: "play", label: "Play" },
            { id: "solver", label: "Solver" },
          ].map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={
                  "px-4 py-2 rounded-xl text-sm font-semibold transition " +
                  (active
                    ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20"
                    : "bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60")
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      {tab === "play" ? <PlayTab /> : <SolverTab />}
    </div>
  );
}
