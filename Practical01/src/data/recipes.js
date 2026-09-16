// Sample data for the recipe box. In a real app this would come from an API.
const recipes = [
  {
    id: 'r1',
    name: 'Brown Butter Miso Pasta',
    icon: '🍝',
    category: 'Dinner',
    difficulty: 'Easy',
    time: 25,
    rating: 4,
    servings: 2,
    description:
      'Nutty brown butter and salty miso paste come together into a glossy sauce that clings to every strand of spaghetti.',
    ingredients: [
      '200g spaghetti',
      '4 tbsp unsalted butter',
      '1 tbsp white miso paste',
      '2 cloves garlic, minced',
      '1/4 cup pasta water',
      'Grated parmesan, to serve'
    ],
    tags: ['Vegetarian', 'Weeknight']
  },
  {
    id: 'r2',
    name: 'Charred Corn & Chili Salad',
    icon: '🌽',
    category: 'Salads',
    difficulty: 'Easy',
    time: 20,
    rating: 5,
    servings: 4,
    description:
      'Sweet charred corn tossed with lime, cotija, and a good pinch of chili powder for a salad that disappears fast.',
    ingredients: [
      '4 ears corn',
      '1/2 cup cotija cheese',
      '1 lime, juiced',
      '1 tsp chili powder',
      '2 tbsp mayonnaise',
      'Fresh cilantro'
    ],
    tags: ['Vegetarian', 'Spicy']
  },
  {
    id: 'r3',
    name: 'Slow Braised Short Ribs',
    icon: '🍖',
    category: 'Dinner',
    difficulty: 'Hard',
    time: 210,
    rating: 5,
    servings: 4,
    description:
      'Red wine and beef stock reduce for hours around fall-apart short ribs until the sauce turns dark and silky.',
    ingredients: [
      '4 bone-in short ribs',
      '2 cups red wine',
      '2 cups beef stock',
      '1 onion, chopped',
      '2 carrots, chopped',
      '3 sprigs thyme'
    ],
    tags: ['Make-ahead']
  },
  {
    id: 'r4',
    name: 'Lemon Ricotta Pancakes',
    icon: '🥞',
    category: 'Breakfast',
    difficulty: 'Easy',
    time: 30,
    rating: 4,
    servings: 3,
    description:
      'Whipped ricotta keeps these pancakes impossibly light, with lemon zest brightening every bite.',
    ingredients: [
      '1 cup ricotta',
      '1 cup flour',
      '2 eggs, separated',
      'Zest of 1 lemon',
      '1 tbsp sugar',
      '1/2 cup milk'
    ],
    tags: ['Vegetarian', 'Weekend']
  },
  {
    id: 'r5',
    name: 'Spiced Chickpea Stew',
    icon: '🍲',
    category: 'Dinner',
    difficulty: 'Medium',
    time: 45,
    rating: 4,
    servings: 4,
    description:
      'A warming, cumin-forward stew of chickpeas and tomatoes finished with a swirl of yogurt.',
    ingredients: [
      '2 cans chickpeas',
      '1 can crushed tomatoes',
      '1 onion, diced',
      '2 tsp cumin',
      '1 tsp smoked paprika',
      'Plain yogurt, to serve'
    ],
    tags: ['Vegetarian', 'Freezer-friendly']
  },
  {
    id: 'r6',
    name: 'Almond Olive Oil Cake',
    icon: '🍰',
    category: 'Dessert',
    difficulty: 'Medium',
    time: 75,
    rating: 5,
    servings: 8,
    description:
      'A dense, moist cake made with good olive oil and ground almonds, barely sweet and perfect with coffee.',
    ingredients: [
      '1 1/2 cups almond flour',
      '3/4 cup olive oil',
      '4 eggs',
      '3/4 cup sugar',
      'Zest of 1 orange',
      '1 tsp baking powder'
    ],
    tags: ['Gluten-free', 'Make-ahead']
  },
  {
    id: 'r7',
    name: 'Crispy Sesame Tofu Bowl',
    icon: '🥢',
    category: 'Dinner',
    difficulty: 'Easy',
    time: 35,
    rating: 4,
    servings: 2,
    description:
      'Cornstarch-crusted tofu fried until shattering-crisp, tossed in a sticky sesame glaze over rice.',
    ingredients: [
      '1 block firm tofu',
      '3 tbsp cornstarch',
      '2 tbsp soy sauce',
      '1 tbsp sesame oil',
      '1 tbsp honey',
      '2 cups cooked rice'
    ],
    tags: ['Vegan option', 'Weeknight']
  },
  {
    id: 'r8',
    name: 'Grapefruit & Fennel Salad',
    icon: '🍊',
    category: 'Salads',
    difficulty: 'Easy',
    time: 15,
    rating: 3,
    servings: 2,
    description:
      'Shaved fennel and segmented grapefruit make a crisp, palate-cleansing salad with a mustard vinaigrette.',
    ingredients: [
      '1 grapefruit, segmented',
      '1 fennel bulb, shaved',
      '1 tbsp dijon mustard',
      '2 tbsp olive oil',
      '1 tsp honey',
      'Flaky salt'
    ],
    tags: ['Vegan', 'Light']
  },
  {
    id: 'r9',
    name: 'Dark Chocolate Espresso Cookies',
    icon: '🍪',
    category: 'Dessert',
    difficulty: 'Medium',
    time: 40,
    rating: 5,
    servings: 12,
    description:
      'Fudgy, brownie-like cookies with a deep espresso kick and pools of melted dark chocolate.',
    ingredients: [
      '200g dark chocolate',
      '2 tbsp instant espresso',
      '2 eggs',
      '3/4 cup sugar',
      '1/2 cup flour',
      '1 tsp baking powder'
    ],
    tags: ['Crowd-pleaser']
  }
]

export const categories = ['All', ...new Set(recipes.map((r) => r.category))]

export default recipes
