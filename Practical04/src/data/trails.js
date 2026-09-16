const trails = [
  {
    id: 'ridgeline-loop',
    name: 'Ridgeline Loop',
    region: 'Blue Hollow Range',
    difficulty: 'Moderate',
    distance: 8.4,
    elevation: 620,
    icon: '⛰️',
    summary: 'A wide ridge walk with near-constant views, best at sunrise before the wind picks up.',
    description:
      'Ridgeline Loop climbs out of the trailhead parking lot through a stand of old pine before breaking onto open ridge for most of its length. Expect exposure to wind and sun with very little shade, so an early start pays off. The final descent switchbacks steeply through scree — trekking poles help.',
    highlights: ['360° summit views', 'Wildflowers in early summer', 'Popular at sunrise']
  },
  {
    id: 'fern-hollow-creek',
    name: 'Fern Hollow Creek',
    region: 'Blue Hollow Range',
    difficulty: 'Easy',
    distance: 3.1,
    elevation: 90,
    icon: '🌿',
    summary: 'A shaded, flat creekside walk that stays cool even on the hottest afternoons.',
    description:
      'This is the trail to send a beginner on, or to walk twice in one visit. It follows Fern Hollow Creek almost the entire way, crossing three small wooden footbridges. The canopy keeps it cool and the grade barely rises, making it comfortable for most fitness levels and manageable with a stroller on the first mile.',
    highlights: ['Shaded the whole way', 'Good for beginners', 'Wheel-friendly first mile']
  },
  {
    id: 'granite-spire',
    name: 'Granite Spire',
    region: 'Cathedral Peaks',
    difficulty: 'Hard',
    distance: 11.2,
    elevation: 1450,
    icon: '🗻',
    summary: 'A long, exposed scramble to a narrow summit — not for a first big hike.',
    description:
      'Granite Spire earns its name in the final half mile, where the trail narrows to a hands-on scramble along an exposed ridge. The reward is a summit barely wide enough for four people and a view over the whole Cathedral Peaks basin. Start before dawn; afternoon storms build fast here in summer.',
    highlights: ['Exposed scramble section', 'Best before noon', 'Basin views from the summit']
  },
  {
    id: 'lower-meadow-trail',
    name: 'Lower Meadow Trail',
    region: 'Cathedral Peaks',
    difficulty: 'Easy',
    distance: 2.4,
    elevation: 60,
    icon: '🌼',
    summary: 'A short, flat loop through open meadow, best in the golden hour before dusk.',
    description:
      'Lower Meadow Trail loops through open grassland at the base of the Cathedral Peaks, with the spires visible the whole way. It floods briefly after heavy rain, so check conditions in spring. Deer are common at dawn and dusk, and the meadow turns gold in the last hour of light.',
    highlights: ['Flat and short', 'Great for golden hour', 'Frequent deer sightings']
  },
  {
    id: 'copper-basin-traverse',
    name: 'Copper Basin Traverse',
    region: 'Sable Mountains',
    difficulty: 'Moderate',
    distance: 6.7,
    elevation: 540,
    icon: '🏔️',
    summary: 'A rolling traverse across an old mining basin, with rusted equipment still along the trail.',
    description:
      'Copper Basin Traverse crosses the site of a mining operation abandoned in the 1920s — old cart rails and a collapsed shaft house are visible from the trail, though fenced off. The path itself rolls gently across the basin floor before a short, steep climb to an overlook at the far end.',
    highlights: ['Mining-era ruins', 'Rolling, moderate grade', 'Overlook at the far end']
  },
  {
    id: 'sable-falls',
    name: 'Sable Falls',
    region: 'Sable Mountains',
    difficulty: 'Moderate',
    distance: 5.3,
    elevation: 380,
    icon: '💧',
    summary: 'A steady climb to a 40-foot waterfall that runs strongest in early spring.',
    description:
      'The trail to Sable Falls climbs steadily but never steeply through mixed forest, crossing the creek twice on log bridges before arriving at the base of the falls. Flow is strongest from snowmelt in April and May and can slow to a trickle by late summer, so time your visit accordingly.',
    highlights: ['40-ft waterfall', 'Best in April–May', 'Two creek crossings']
  }
]

export const REGIONS = [...new Set(trails.map((t) => t.region))]
export const DIFFICULTIES = ['Easy', 'Moderate', 'Hard']

export function getTrailById(id) {
  return trails.find((t) => t.id === id)
}

export default trails
