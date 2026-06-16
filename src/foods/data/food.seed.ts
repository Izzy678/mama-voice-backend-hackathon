// ─────────────────────────────────────────────────────────────────────────────
//  MamaVoice Companion — Enriched Food Seed Data
//  Nigerian Maternal & Infant Nutrition Database
// ─────────────────────────────────────────────────────────────────────────────

import {
  FoodCategoryEnum,
  FoodStageEnum,
  TrimesterEnum,
} from '../enum/food.enum';

// Helper: nutritional values per 100g
// calories(kcal), protein(g), carbs(g), fat(g), fiber(g), sodium(mg),
// iron(mg), calcium(mg), vitaminC(mg), folate(mcg), vitaminA(mcg), zinc(mg)
function per100g(
  calories: number,
  protein: number,
  carbs: number,
  fat: number,
  fiber: number,
  sodium: number,
  iron: number,
  calcium: number,
  vitaminC: number,
  folate: number,
  vitaminA: number,
  zinc: number,
) {
  return { calories, protein, carbs, fat, fiber, sodium, iron, calcium, vitaminC, folate, vitaminA, zinc };
}

export interface FoodItem {
  name: string;
  category: FoodCategoryEnum;
  benefits: string;
  mamaVoiceTip: string;                 // Short voice-friendly tip (used in TTS)
  dangerWarning: string | null;         // Warning if over-consumed or allergenic
  preparationTips: string;             // How to prepare it the Nigerian way
  affordabilityRating: 1 | 2 | 3;      // 1 = very affordable, 3 = expensive
  availabilityRating: 1 | 2 | 3;       // 1 = widely available, 3 = seasonal/rare
  imageUrl: string[] | null;
  nutritionalValues: ReturnType<typeof per100g>;
  suitableFor: FoodStageEnum[];
  trimesterRecommendation: TrimesterEnum[];
  keyNutrients: string[];              // Top 3 nutrients — shown on card UI
  servingSuggestion: string;           // Practical portion for a Nigerian mother
  pairsWellWith: string[];             // Complementary foods
  avoidWith: string[] | null;          // Foods/conditions to avoid combining
  isHighIron: boolean;
  isHighFolate: boolean;
  isHighCalcium: boolean;
  isHighProtein: boolean;
  isHighVitaminC: boolean;
}

export const FOOD_SEED_DATA: FoodItem[] = [
  // ──────────────────────────────────────────────────────────────
  //  VEGETABLES
  // ──────────────────────────────────────────────────────────────
  {
    name: 'Fluted Pumpkin Leaves',
    category: FoodCategoryEnum.Vegetables,
    benefits:
      'One of Nigeria\'s most nutritious leafy greens. Rich in iron and folate, which are essential for making healthy blood and preventing anaemia during pregnancy. Also contains vitamins A, C, and K.',
    mamaVoiceTip:
      'Eat ugu soup at least three times a week. It gives your baby\'s brain and blood the iron it needs to grow strong.',
    dangerWarning: null,
    preparationTips:
      'Wash leaves thoroughly before cooking. Add to egusi soup, ofe owerri, or cook with crayfish and stockfish. Avoid overcooking — add leaves in the last 5 minutes to preserve nutrients.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: ["https://res.cloudinary.com/djnl9luvi/image/upload/v1781598085/ugu-soup-2_w8nud2.jpg", "https://res.cloudinary.com/djnl9luvi/image/upload/v1781598085/ugu-soup-3_ucpx5u.jpg", "https://res.cloudinary.com/djnl9luvi/image/upload/v1781598085/ugu-soup-2_w8nud2.jpg"],
    nutritionalValues: per100g(32, 4.5, 5.0, 0.5, 2.5, 180, 3.5, 120, 30, 80, 380, 0.6),
    suitableFor: [FoodStageEnum.Pregnant, FoodStageEnum.Postpartum, FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Iron', 'Folate', 'Vitamin A'],
    servingSuggestion: 'A generous handful (about 100g) added to your daily soup or stew.',
    pairsWellWith: ['Egusi', 'Smoked Fish', 'Stockfish', 'Crayfish', 'Palm Oil'],
    avoidWith: null,
    isHighIron: true,
    isHighFolate: true,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  {
    name: 'Bitter Leaf',
    category: FoodCategoryEnum.Vegetables,
    benefits:
      'Contains vitamins A, C, and B-complex, plus minerals that support digestion and liver health. Has mild antimicrobial properties. Helps manage blood sugar levels.',
    mamaVoiceTip:
      'Bitter leaf soup is good for digestion. Use it in small amounts — the bitterness means it is working to clean your body.',
    dangerWarning:
      'Avoid consuming very large amounts in the first trimester — high doses of bitter leaf extract have traditionally been used to stimulate the uterus. Moderate soup portions are safe.',
    preparationTips:
      'Squeeze and wash the leaves thoroughly in water to reduce bitterness before adding to soup. Used in ofe onugbu (bitter leaf soup) with cocoyam, smoked meat, and stockfish.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: ["https://res.cloudinary.com/djnl9luvi/image/upload/v1781598528/bitter-leaf-soup-2_cyktwp.jpg"],
    nutritionalValues: per100g(25, 3.0, 4.0, 0.3, 1.5, 80, 1.8, 110, 22, 50, 240, 0.4),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.Second, TrimesterEnum.Third],
    keyNutrients: ['Vitamin A', 'Vitamin C', 'Antioxidants'],
    servingSuggestion: 'One bowl of bitter leaf soup (about 200ml) 2–3 times per week.',
    pairsWellWith: ['Cocoyam (ofe thickener)', 'Stockfish', 'Assorted Meat'],
    avoidWith: ['Avoid in very large quantities in first trimester'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  {
    name: 'Moringa Leaves',
    category: FoodCategoryEnum.Vegetables,
    benefits:
      'Called the "miracle tree" — moringa leaves contain more iron than spinach, more calcium than milk, and more vitamin C than oranges. Excellent for boosting breast milk production after delivery and replenishing nutrients lost during childbirth.',
    mamaVoiceTip:
      'After you deliver your baby, add moringa to your soup every day. It helps your breast milk come in stronger and helps you recover faster.',
    dangerWarning:
      'Avoid moringa root and bark during pregnancy — they contain compounds that may cause contractions. The leaves in food quantities are safe for pregnant women.',
    preparationTips:
      'Strip leaves from stems and add fresh to soups or stews at the end of cooking. Can be dried and powdered to add to pap (ogi) or porridge. Mix moringa powder into akamu for a nutritious morning meal.',
    affordabilityRating: 1,
    availabilityRating: 2,
    imageUrl: ["https://res.cloudinary.com/djnl9luvi/image/upload/v1781597094/moringa-leaves-extract_2_lz3ecd.webp", "https://res.cloudinary.com/djnl9luvi/image/upload/v1781597349/moringa_crop.webp"],
    nutritionalValues: per100g(64, 9.0, 8.0, 1.4, 4.0, 40, 4.0, 185, 51, 40, 378, 0.6),
    suitableFor: [FoodStageEnum.Postpartum, FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.Second, TrimesterEnum.Third],
    keyNutrients: ['Iron', 'Calcium', 'Vitamin C'],
    servingSuggestion: 'A handful of fresh leaves daily in soup, or 1 teaspoon of moringa powder in pap.',
    pairsWellWith: ['Pap (Ogi)', 'Egusi Soup', 'Groundnut Soup'],
    avoidWith: ['Moringa root/bark during pregnancy'],
    isHighIron: true,
    isHighFolate: false,
    isHighCalcium: true,
    isHighProtein: true,
    isHighVitaminC: true,
  },

  {
    name: 'Garden Egg',
    category: FoodCategoryEnum.Vegetables,
    benefits:
      'Low in calories but high in fibre and antioxidants. Helps manage blood sugar and blood pressure — important for preventing gestational diabetes and pre-eclampsia. Contains nasunin, which protects cell membranes.',
    mamaVoiceTip:
      'Garden egg is one of the safest vegetables in pregnancy. It helps keep your blood pressure steady and your sugar balanced.',
    dangerWarning: null,
    preparationTips:
      'Can be eaten raw as a snack with garden egg sauce (made with crayfish and palm oil), boiled, or added to stews. The white variety (garden egg) is slightly bitter — the green type is milder.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(25, 1.0, 6.0, 0.2, 3.0, 22, 0.4, 18, 5, 22, 14, 0.2),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Fibre', 'Antioxidants', 'Potassium'],
    servingSuggestion: '2–3 medium garden eggs as a snack or side dish.',
    pairsWellWith: ['Garden Egg Sauce', 'Crayfish', 'Palm Oil', 'Boiled Yam'],
    avoidWith: null,
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  {
    name: 'Waterleaf',
    category: FoodCategoryEnum.Vegetables,
    benefits:
      'Very high water content keeps the body hydrated. Rich in folate, iron, calcium, and vitamins A and C. Supports kidney function and helps prevent oedema (leg swelling) in pregnancy.',
    mamaVoiceTip:
      'Waterleaf is great if your legs are swollen. It helps your kidneys flush out extra water and gives your blood the folate it needs.',
    dangerWarning:
      'High in oxalates — avoid eating in very large amounts if you have kidney stones.',
    preparationTips:
      'Wash well and add to egusi or edikaikong soup. Often combined with ugu in edikaikong (Cross River style) — this combination is one of the most nutritious Nigerian soups for pregnant women.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(19, 2.0, 3.0, 0.3, 1.2, 60, 2.0, 98, 28, 60, 300, 0.3),
    suitableFor: [FoodStageEnum.Pregnant, FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Folate', 'Iron', 'Calcium'],
    servingSuggestion: 'Included in edikaikong or egusi soup 3–4 times weekly.',
    pairsWellWith: ['Ugu Leaves', 'Egusi', 'Smoked Shrimp', 'Palm Oil'],
    avoidWith: ['Excessive amounts if prone to kidney stones'],
    isHighIron: true,
    isHighFolate: true,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  // ──────────────────────────────────────────────────────────────
  //  LEGUMES
  // ──────────────────────────────────────────────────────────────
  {
    name: 'Black-eyed Peas',
    category: FoodCategoryEnum.Legumes,
    benefits:
      'One of the best plant-based proteins in Nigerian cuisine. Packed with folate, which is critical in the first trimester for preventing neural tube defects (open spine). Also provides iron, zinc, and slow-release energy.',
    mamaVoiceTip:
      'Beans and yam or beans and plantain is one of the best meals you can eat in pregnancy. The protein and folate protect your baby\'s brain and spine from the very beginning.',
    dangerWarning:
      'May cause gas and bloating. Soak beans overnight and discard soaking water before cooking to reduce this. If bloating is severe, pair with ginger tea.',
    preparationTips:
      'Soak overnight to reduce cooking time and gas. Cook as ewa agoyin with spicy sauce, moi moi (steamed bean pudding), or akara (bean cakes). Moi moi is particularly easy to digest.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(127, 8.0, 23.0, 0.5, 6.5, 130, 2.2, 50, 1, 110, 3, 1.0),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Folate', 'Protein', 'Iron'],
    servingSuggestion: 'One cup of cooked beans (about 180g) at least 3 times per week.',
    pairsWellWith: ['Yam', 'Plantain', 'Garri (for swallow)', 'Rice', 'Palm Oil', 'Orange (to boost iron absorption)'],
    avoidWith: null,
    isHighIron: true,
    isHighFolate: true,
    isHighCalcium: false,
    isHighProtein: true,
    isHighVitaminC: false,
  },

  {
    name: 'Groundnut',
    category: FoodCategoryEnum.Legumes,
    benefits:
      'High in healthy fats, protein, and folate. The fats support your baby\'s brain development and help your body absorb fat-soluble vitamins A, D, E, and K. Great energy booster for breastfeeding mothers.',
    mamaVoiceTip:
      'A small handful of groundnuts in the afternoon gives you lasting energy and healthy fat for your baby\'s brain. It\'s also great for making more breast milk.',
    dangerWarning:
      'If you or your family has a history of peanut allergy, consult your doctor before eating regularly. High in calories — keep portions moderate if concerned about excessive weight gain.',
    preparationTips:
      'Eat roasted as a snack, use in groundnut soup (ofe ose) for soups, blend into groundnut paste for stew, or add to kunu drink. Groundnut soup with chicken is an excellent postpartum recovery meal.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(567, 26.0, 16.0, 49.0, 8.5, 18, 1.3, 62, 0, 240, 0, 3.3),
    suitableFor: [FoodStageEnum.Postpartum, FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.Second, TrimesterEnum.Third],
    keyNutrients: ['Healthy Fats', 'Protein', 'Folate'],
    servingSuggestion: 'A small handful (30g) as a snack, or groundnut soup 2–3 times per week.',
    pairsWellWith: ['Kunu Drink', 'Chicken', 'Yam', 'Tuwo Shinkafa'],
    avoidWith: ['Avoid if known peanut allergy'],
    isHighIron: false,
    isHighFolate: true,
    isHighCalcium: false,
    isHighProtein: true,
    isHighVitaminC: false,
  },

  {
    name: 'Soybean',
    category: FoodCategoryEnum.Legumes,
    benefits:
      'Complete plant protein containing all essential amino acids. Excellent for mothers who cannot afford meat or fish regularly. High in calcium for bone health and isoflavones that support hormonal balance postpartum.',
    mamaVoiceTip:
      'If you cannot afford meat today, eating wara (tofu) or soy milk gives your baby the same protein. It is cheap and very powerful food for a pregnant mother.',
    dangerWarning:
      'Some women with thyroid problems should moderate soy intake — consult your doctor. In general food amounts, soy is safe for pregnant and breastfeeding women.',
    preparationTips:
      'Cook soybean as wara (Nigerian tofu) — fry in oil and add to soups. Blend as soy milk. Roast soybeans and grind as soy powder to add to pap. Soy can replace or extend meat in any stew.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(173, 17.0, 10.0, 9.0, 6.0, 375, 4.4, 140, 6, 55, 1, 1.8),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Protein', 'Calcium', 'Iron'],
    servingSuggestion: 'One cup of cooked soybean, 2–3 pieces of fried wara, or a glass of soy milk daily.',
    pairsWellWith: ['Pap (Ogi)', 'Jollof Rice', 'Egusi Soup', 'Yam Porridge'],
    avoidWith: ['Moderate if diagnosed with thyroid disorder'],
    isHighIron: true,
    isHighFolate: false,
    isHighCalcium: true,
    isHighProtein: true,
    isHighVitaminC: false,
  },

  {
    name: 'Melon Seeds',
    category: FoodCategoryEnum.Legumes,
    benefits:
      'Energy-dense and rich in protein, zinc, magnesium, and healthy unsaturated fats. Zinc supports immune function and baby\'s cell growth. Magnesium helps reduce leg cramps in the third trimester.',
    mamaVoiceTip:
      'Egusi soup is not just delicious — it gives your baby zinc for growing cells and helps you with the leg cramps that often happen in the last months of pregnancy.',
    dangerWarning:
      'High in calories — moderate consumption is ideal for women managing gestational diabetes or excessive weight gain.',
    preparationTips:
      'Grind egusi seeds and fry in palm oil before adding to water/stock for soup. Combine with ugu, bitter leaf, or waterleaf. Add smoked fish, crayfish, and stockfish for complete nutrition.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(559, 28.0, 11.0, 47.0, 3.5, 58, 3.7, 40, 2, 58, 28, 7.3),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Zinc', 'Protein', 'Magnesium'],
    servingSuggestion: 'Egusi soup (2–3 tablespoons of seeds per serving) 3–4 times per week.',
    pairsWellWith: ['Ugu Leaves', 'Waterleaf', 'Smoked Fish', 'Stockfish', 'Fufu', 'Eba'],
    avoidWith: ['Large portions if managing gestational diabetes or weight gain'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: true,
    isHighVitaminC: false,
  },

  // ──────────────────────────────────────────────────────────────
  //  PROTEINS
  // ──────────────────────────────────────────────────────────────
  {
    name: 'Smoked Fish',
    category: FoodCategoryEnum.Proteins,
    benefits:
      'High-quality protein and omega-3 fatty acids (DHA and EPA) that are critical for baby\'s brain, eye, and nervous system development. Also provides iodine for thyroid function, which controls the baby\'s brain development in the first trimester.',
    mamaVoiceTip:
      'Smoked fish in your soup is one of the best things for your baby\'s brain. The omega-3 fat in fish builds the part of the brain responsible for thinking and seeing.',
    dangerWarning:
      'Avoid high-mercury fish (large tuna, shark, swordfish). Small smoked fish like panla, titus (mackerel), and herrings are safe. Ensure fish is fully cooked — avoid raw or undercooked fish.',
    preparationTips:
      'Soak briefly in hot water to soften and remove excess salt before adding to soups. Use in egusi, edikaikong, ofe owerri, or okro soup. Dried/smoked crayfish is a safe, affordable alternative.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(120, 22.0, 0.0, 3.0, 0.0, 420, 1.0, 60, 0, 8, 14, 0.8),
    suitableFor: [FoodStageEnum.Pregnant, FoodStageEnum.Postpartum, FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Omega-3 (DHA)', 'Protein', 'Iodine'],
    servingSuggestion: '60–100g of smoked fish in your daily soup.',
    pairsWellWith: ['Egusi Soup', 'Okro Soup', 'Edikaikong', 'Ugu Leaves', 'Crayfish'],
    avoidWith: ['Large, high-mercury fish (shark, swordfish, large tuna)', 'Raw or undercooked fish'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: true,
    isHighVitaminC: false,
  },

  {
    name: 'Egg',
    category: FoodCategoryEnum.Proteins,
    benefits:
      'One of the most affordable and complete foods available. Contains choline — a nutrient essential for baby\'s brain and spinal cord development, often missing from prenatal supplements. Also provides vitamins D, B12, and selenium.',
    mamaVoiceTip:
      'One egg a day is one of the cheapest ways to protect your baby\'s brain. The yellow yolk especially has choline which builds the memory part of the brain.',
    dangerWarning:
      'Always cook eggs fully during pregnancy — avoid runny yolks or raw eggs in drinks, which carry risk of salmonella infection. Hard-boiled or well-scrambled is safest.',
    preparationTips:
      'Hard boil for an easy snack, scramble with tomatoes and onions (fried egg stew), add to moi moi, or include in vegetable stew. Egg sauce over yam or rice is a quick nutritious meal.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(155, 13.0, 1.0, 11.0, 0.0, 124, 1.8, 56, 0, 44, 149, 1.3),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Choline', 'Protein', 'Vitamin D'],
    servingSuggestion: '1–2 eggs daily, cooked thoroughly.',
    pairsWellWith: ['Yam', 'Bread', 'Plantain', 'Moi Moi', 'Tomato Stew'],
    avoidWith: ['Raw or undercooked eggs (salmonella risk)'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: true,
    isHighVitaminC: false,
  },

  {
    name: 'Chicken',
    category: FoodCategoryEnum.Proteins,
    benefits:
      'Lean protein source with niacin (vitamin B3) and phosphorus that support baby\'s bone development and maternal tissue repair. Chicken broth/pepper soup is traditionally given to new mothers in many Nigerian communities for good reason — it is easy to digest and deeply nourishing.',
    mamaVoiceTip:
      'Chicken pepper soup after delivery is not just tradition — it is real medicine. It helps your uterus heal, gives you protein, and warms your body from the inside.',
    dangerWarning:
      'Ensure chicken is fully cooked to avoid listeria and salmonella. Avoid processed chicken products high in sodium.',
    preparationTips:
      'Chicken pepper soup with uziza and utazi leaves is the classic postpartum dish. Also use in stew, jollof rice, or ofe nsala (white soup). Grill or bake as a lighter option.',
    affordabilityRating: 2,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(165, 31.0, 0.0, 3.6, 0.0, 74, 1.0, 15, 0, 5, 21, 2.0),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Protein', 'Niacin (B3)', 'Phosphorus'],
    servingSuggestion: '100–150g of cooked chicken 3–4 times per week.',
    pairsWellWith: ['Jollof Rice', 'Fried Plantain', 'Pepper Soup', 'Ofe Nsala', 'Ugba'],
    avoidWith: ['Undercooked chicken', 'High-sodium processed chicken products'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: true,
    isHighVitaminC: false,
  },

  {
    name: 'Dried Crayfish',
    category: FoodCategoryEnum.Proteins,
    benefits:
      'Extremely nutrient-dense despite small serving sizes. Rich in calcium, zinc, selenium, and iodine. Iodine is critical in the first trimester for the baby\'s brain and thyroid development. Affordable and available year-round.',
    mamaVoiceTip:
      'The crayfish you add to your soup is doing so much work — it adds calcium for your baby\'s bones, iodine for the brain, and zinc for the immune system. Never skip your crayfish!',
    dangerWarning:
      'High in sodium — if you have high blood pressure (pre-eclampsia risk), reduce the amount you use and avoid adding extra salt when cooking.',
    preparationTips:
      'Grind and add to soups, stews, and sauces. A standard serving in a pot of soup (2–3 tablespoons ground) significantly boosts the nutritional value of any meal.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(292, 61.0, 0.0, 4.0, 0.0, 1800, 12.0, 380, 0, 12, 7, 5.4),
    suitableFor: [FoodStageEnum.Pregnant, FoodStageEnum.Postpartum, FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Iodine', 'Calcium', 'Zinc'],
    servingSuggestion: '2–3 tablespoons of ground crayfish added to your daily soup or stew.',
    pairsWellWith: ['All Nigerian Soups', 'Egusi', 'Ugu Leaves', 'Okro'],
    avoidWith: ['Reduce if managing high blood pressure (high sodium)'],
    isHighIron: true,
    isHighFolate: false,
    isHighCalcium: true,
    isHighProtein: true,
    isHighVitaminC: false,
  },

  {
    name: 'Liver',
    category: FoodCategoryEnum.Proteins,
    benefits:
      'The single most nutrient-dense food for iron and folate. One serving of beef liver provides more than a full day\'s requirement of folate and iron. Also extremely high in vitamin B12, vitamin A, and copper.',
    mamaVoiceTip:
      'Liver once or twice a week is a powerful way to fight anaemia in pregnancy. Just a small piece gives you more iron and folate than many supplements.',
    dangerWarning:
      'Do NOT eat liver more than once or twice per week during pregnancy — it is very high in vitamin A (retinol), and too much can harm the baby. Once or twice weekly is safe and beneficial.',
    preparationTips:
      'Add to pepper soup, stew, or fried with onions and tomatoes. Slice thinly for quicker cooking. Combine with ugu soup for a maximum iron-folate meal.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(175, 27.0, 4.0, 5.0, 0.0, 78, 6.2, 6, 2, 215, 4968, 4.0),
    suitableFor: [FoodStageEnum.Pregnant, FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.Second, TrimesterEnum.Third],
    keyNutrients: ['Iron', 'Folate', 'Vitamin B12'],
    servingSuggestion: 'A small portion (50–80g) once or twice per week ONLY.',
    pairsWellWith: ['Ugu Soup', 'Pepper Soup', 'Stew with Rice or Yam'],
    avoidWith: ['More than twice per week (excessive vitamin A toxicity risk)'],
    isHighIron: true,
    isHighFolate: true,
    isHighCalcium: false,
    isHighProtein: true,
    isHighVitaminC: false,
  },

  // ──────────────────────────────────────────────────────────────
  //  GRAINS / STAPLES
  // ──────────────────────────────────────────────────────────────
  {
    name: 'Fermented Maize Porridge',
    category: FoodCategoryEnum.Grains,
    benefits:
      'Fermented cereal porridge made from maize, millet, or sorghum. Easy to digest, gentle on the stomach, and naturally probiotic from the fermentation process. Ideal postpartum food that restores energy without straining the digestive system.',
    mamaVoiceTip:
      'Pap after delivery is tradition for a reason. It is easy on your stomach, hydrating, and gives you quick energy. Make it thicker and add moringa or soybean powder to make it even more powerful.',
    dangerWarning:
      'Plain pap is low in protein and fat — always fortify with soy powder, groundnut, moringa, or milk to make it nutritionally complete. Do not rely on pap alone.',
    preparationTips:
      'Mix pap powder with cold water, then add boiling water while stirring. Fortify with: soy powder (protein), moringa powder (iron/vitamins), groundnut paste (healthy fat), or full-cream milk (calcium). Sweeten with a little honey or sugar.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(87, 2.0, 19.0, 0.5, 0.8, 10, 0.5, 10, 0, 8, 0, 0.3),
    suitableFor: [FoodStageEnum.Postpartum, FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Carbohydrates', 'Probiotics', 'Energy'],
    servingSuggestion: 'One bowl (300ml) fortified with moringa powder and milk, for breakfast.',
    pairsWellWith: ['Moringa Powder', 'Soy Powder', 'Milk', 'Groundnut Paste', 'Akara (Bean Cakes)', 'Moi Moi'],
    avoidWith: ['Plain pap alone as a complete meal — always fortify'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  {
    name: 'Oatmeal',
    category: FoodCategoryEnum.Grains,
    benefits:
      'Rich in beta-glucan fibre, which helps manage cholesterol and blood sugar. Contains iron, magnesium, and B vitamins. A filling breakfast that prevents the blood sugar spikes that contribute to gestational diabetes.',
    mamaVoiceTip:
      'Oats for breakfast keeps your blood sugar steady all morning. This helps you avoid the tiredness that comes when sugar goes up and down. It also helps if you have constipation.',
    dangerWarning: null,
    preparationTips:
      'Cook with milk or water, add banana slices, a spoon of groundnut paste, and a sprinkle of moringa powder for a complete fortified breakfast bowl. Available affordably at most markets.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(389, 17.0, 66.0, 7.0, 11.0, 2, 4.7, 54, 0, 56, 0, 4.0),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Fibre (beta-glucan)', 'Iron', 'Magnesium'],
    servingSuggestion: 'One cup of cooked oats (180g) fortified with milk, banana, and groundnut paste.',
    pairsWellWith: ['Banana', 'Milk', 'Groundnut Paste', 'Moringa Powder', 'Honey'],
    avoidWith: null,
    isHighIron: true,
    isHighFolate: true,
    isHighCalcium: false,
    isHighProtein: true,
    isHighVitaminC: false,
  },

  {
    name: 'Rice',
    category: FoodCategoryEnum.Grains,
    benefits:
      'The most widely consumed staple in Nigeria. Provides steady energy from complex carbohydrates. Parboiled rice retains more B vitamins than white rice. Combining with beans creates a complete protein meal with all essential amino acids.',
    mamaVoiceTip:
      'Rice and beans together is one of the best combinations you can eat in pregnancy. Together they form a complete protein — like eating chicken, but cheaper.',
    dangerWarning:
      'White rice alone causes rapid blood sugar spikes. Always pair with vegetables and protein. If you have gestational diabetes, prefer smaller portions of parboiled rice with a lot of vegetables and protein.',
    preparationTips:
      'Cook as jollof rice with tomato, peppers, and vegetables. Pair with stew and ugu soup. Add to rice and beans (waakye style) for maximum nutrition. Parboiled rice is more nutritious than regular white rice.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(130, 2.7, 28.0, 0.3, 0.4, 1, 0.2, 10, 0, 8, 0, 0.5),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Carbohydrates', 'B Vitamins', 'Energy'],
    servingSuggestion: 'One medium plate of rice paired with protein (fish, chicken, beans) and a vegetable soup.',
    pairsWellWith: ['Beans', 'Egusi Soup', 'Tomato Stew', 'Chicken', 'Smoked Fish', 'Plantain'],
    avoidWith: ['Eating rice alone in large portions if managing gestational diabetes'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  {
    name: 'Yam',
    category: FoodCategoryEnum.Grains,
    benefits:
      'A good source of complex carbohydrates, potassium, and vitamin B6. Potassium helps manage blood pressure and reduces fluid retention (oedema). Vitamin B6 is known to help with morning sickness in the first trimester.',
    mamaVoiceTip:
      'If you are feeling sick in the morning, plain boiled yam can help settle your stomach. The vitamin B6 in yam is one of the natural remedies for nausea in early pregnancy.',
    dangerWarning: null,
    preparationTips:
      'Boil and serve with egg sauce, garden egg sauce, or vegetable stew. Pound into pounded yam (iyan) to eat with egusi or okro soup. Yam porridge (asaro) with vegetables and fish is a complete one-pot meal.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(116, 1.5, 28.0, 0.1, 4.1, 9, 0.5, 14, 12, 22, 8, 0.2),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Potassium', 'Vitamin B6', 'Fibre'],
    servingSuggestion: '2–3 medium slices of boiled yam or one bowl of yam porridge.',
    pairsWellWith: ['Egg Sauce', 'Garden Egg Sauce', 'Egusi Soup', 'Vegetable Stew', 'Smoked Fish'],
    avoidWith: null,
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  {
    name: 'Plantain',
    category: FoodCategoryEnum.Grains,
    benefits:
      'Rich in potassium, magnesium, vitamin B6, and vitamin C. Ripe plantain contains natural sugars for quick energy. Unripe plantain has a lower glycaemic index and more resistant starch — better for blood sugar control. Magnesium helps with leg cramps.',
    mamaVoiceTip:
      'Roasted plantain (boli) is one of the best roadside snacks you can choose in pregnancy. It gives you potassium for your blood pressure and magnesium for those painful night cramps.',
    dangerWarning:
      'Overripe plantain has a high sugar content — eat in moderation if managing gestational diabetes. Prefer roasted or boiled over fried (reduces unhealthy fat).',
    preparationTips:
      'Roast over open flame (boli) as a snack with groundnut. Fry ripe plantain (dodo) as a side dish. Boil unripe plantain for a blood-sugar-friendly version. Add to mixed bean pottage for a balanced meal.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(122, 1.3, 32.0, 0.4, 2.3, 4, 0.6, 3, 18, 22, 56, 0.1),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Potassium', 'Magnesium', 'Vitamin B6'],
    servingSuggestion: '1–2 medium plantains (roasted or boiled preferred).',
    pairsWellWith: ['Groundnut', 'Beans', 'Egg Sauce', 'Grilled Fish'],
    avoidWith: ['Large amounts of fried plantain if managing weight or gestational diabetes'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  {
    name: 'Garri',
    category: FoodCategoryEnum.Grains,
    benefits:
      'Provides quick carbohydrate energy. Widely available and affordable across Nigeria. Yellow garri (made with palm oil) contains vitamin A. Eba (soaked garri used as swallow) is a carrier for nutritious soups.',
    mamaVoiceTip:
      'Garri alone has very little nutrition. The nutrition comes from the soup you eat it with. Make sure your egusi, ugu, or okro soup is rich — that is where all the goodness is.',
    dangerWarning:
      'Garri soaked in cold water with groundnut and sugar is low in nutritional value — do not use this as a meal replacement during pregnancy. Raw cassava can contain low levels of cyanide — proper processing (fermentation) in commercial garri eliminates this risk.',
    preparationTips:
      'Use as eba (swallow) with any soup. Yellow garri is preferred — it has more vitamin A from palm oil added during processing. Always pair with a nutritious, protein-rich soup.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(357, 1.4, 84.0, 0.5, 1.8, 27, 0.3, 20, 0, 0, 0, 0.1),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Carbohydrates', 'Energy', 'Vitamin A (yellow garri)'],
    servingSuggestion: 'One ball of eba as a swallow paired with a rich, protein-vegetable soup.',
    pairsWellWith: ['Egusi Soup', 'Okro Soup', 'Edikaikong', 'Ogbono Soup', 'Bitter Leaf Soup'],
    avoidWith: ['Garri soaked in cold water as a meal substitute — nutritionally empty'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  // ──────────────────────────────────────────────────────────────
  //  FRUITS
  // ──────────────────────────────────────────────────────────────
  {
    name: 'Orange',
    category: FoodCategoryEnum.Fruits,
    benefits:
      'Exceptionally rich in vitamin C, which greatly increases the body\'s absorption of iron from plant-based foods like beans, ugu, and moringa. Also contains folate and immune-boosting antioxidants. Keeps the skin healthy and elastic.',
    mamaVoiceTip:
      'Drink orange juice or eat an orange right after your bean or ugu soup meal. The vitamin C will help your body absorb up to three times more iron from the food.',
    dangerWarning:
      'Orange juice from cartons in Nigeria is often high in added sugar. Fresh oranges or freshly squeezed juice are far better. Avoid if you have severe heartburn.',
    preparationTips:
      'Eat fresh after meals to boost iron absorption. Squeeze as fresh juice. Add orange slices to fruit salads. Use orange zest in cooking for flavour. Peak season December–April.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(47, 0.9, 12.0, 0.1, 2.4, 0, 0.1, 40, 53, 30, 11, 0.1),
    suitableFor: [FoodStageEnum.Pregnant, FoodStageEnum.Postpartum, FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Vitamin C', 'Folate', 'Antioxidants'],
    servingSuggestion: '1–2 fresh oranges daily, ideally after iron-rich meals.',
    pairsWellWith: ['Beans', 'Ugu Soup', 'Moringa', 'Iron-rich foods (enhances absorption)'],
    avoidWith: ['Avoid commercial sugary orange juice', 'Reduce if severe heartburn/GERD'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: true,
  },

  {
    name: 'Banana',
    category: FoodCategoryEnum.Fruits,
    benefits:
      'Rich in potassium, vitamin B6, and magnesium. Vitamin B6 helps with nausea and morning sickness in early pregnancy. Potassium helps control blood pressure. Easy to digest and gentle on a queasy stomach.',
    mamaVoiceTip:
      'If you are feeling sick in the morning, try eating a banana before you even get out of bed. It is gentle on the stomach and the vitamin B6 helps reduce nausea.',
    dangerWarning:
      'High in natural sugar — eat in moderation if managing gestational diabetes. One banana per day is generally fine.',
    preparationTips:
      'Eat as a snack at any time. Blend into smoothies with milk. Add to pap or oatmeal for breakfast. Overripe bananas are sweeter and easier to digest.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(89, 1.1, 23.0, 0.3, 2.6, 1, 0.3, 5, 9, 20, 3, 0.2),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Vitamin B6', 'Potassium', 'Magnesium'],
    servingSuggestion: '1 medium banana daily as a snack or added to breakfast.',
    pairsWellWith: ['Oatmeal', 'Pap (Ogi)', 'Milk', 'Groundnut'],
    avoidWith: ['More than 1–2 per day if managing gestational diabetes'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  {
    name: 'Watermelon',
    category: FoodCategoryEnum.Fruits,
    benefits:
      'Over 90% water — excellent for hydration in the Nigerian heat. Contains lycopene (antioxidant), vitamin C, and vitamin A. Helps with oedema (swollen feet and ankles) by supporting kidney function and fluid balance.',
    mamaVoiceTip:
      'When your legs are swollen and the heat is too much, watermelon is your friend. It hydrates you, reduces the swelling, and has vitamins for your baby too.',
    dangerWarning:
      'Eat in moderation if you have gestational diabetes — watermelon has a moderately high glycaemic index despite containing natural sugars. Always buy fresh and refrigerate.',
    preparationTips:
      'Eat chilled as a snack. Blend as a refreshing drink without added sugar. Great as a fruit salad with banana and orange. Buy from clean, reputable vendors.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(30, 0.6, 8.0, 0.2, 0.4, 1, 0.2, 7, 8, 3, 28, 0.1),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Hydration', 'Lycopene', 'Vitamin C'],
    servingSuggestion: '2–3 slices (about 300g) as a snack or part of fruit plate.',
    pairsWellWith: ['Banana', 'Orange', 'Other Fruits'],
    avoidWith: ['Moderate if managing gestational diabetes'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  {
    name: 'Papaya',
    category: FoodCategoryEnum.Fruits,
    benefits:
      'Ripe pawpaw is rich in vitamin C, vitamin A (beta-carotene), folate, and the enzyme papain, which aids digestion. Helps relieve constipation — a common complaint in pregnancy. Also supports the immune system.',
    mamaVoiceTip:
      'Ripe pawpaw helps with the constipation that many pregnant women suffer from. It also gives your baby vitamin A for healthy eyes and skin.',
    dangerWarning:
      'ONLY eat fully RIPE pawpaw during pregnancy. UNRIPE or semi-ripe pawpaw contains high concentrations of latex and papain that can cause uterine contractions — this is a traditional abortifacient in some communities. Avoid unripe pawpaw completely.',
    preparationTips:
      'Eat fresh ripe pawpaw (fully orange flesh) as a snack. Add to fruit salads. Blend as a smoothie with banana and milk. Only use fully ripe fruit.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(43, 0.5, 11.0, 0.3, 1.7, 8, 0.3, 20, 62, 37, 47, 0.1),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.Second, TrimesterEnum.Third],
    keyNutrients: ['Vitamin C', 'Vitamin A', 'Folate'],
    servingSuggestion: '1 cup of ripe pawpaw cubes (about 150g) daily.',
    pairsWellWith: ['Banana', 'Orange', 'Yoghurt', 'Milk'],
    avoidWith: ['Unripe or semi-ripe pawpaw — serious pregnancy risk'],
    isHighIron: false,
    isHighFolate: true,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: true,
  },

  // ──────────────────────────────────────────────────────────────
  //  DAIRY
  // ──────────────────────────────────────────────────────────────
  {
    name: 'Full-Cream Milk',
    category: FoodCategoryEnum.Dairy,
    benefits:
      'The best dietary source of calcium and vitamin D together — both needed to build your baby\'s bones and teeth. Also provides high-quality protein and vitamin B12 for nervous system development.',
    mamaVoiceTip:
      'One glass of milk a day helps your baby grow strong bones. If you cannot get fresh milk, Peak or Cowbell evaporated milk added to pap or tea works too.',
    dangerWarning:
      'Avoid unpasteurised (raw) milk — it carries risk of listeria, which is dangerous in pregnancy. Use pasteurised full-cream milk (Peak, Three Crowns, etc).',
    preparationTips:
      'Add to pap (ogi) for a fortified breakfast. Drink a glass warm in the evening. Use in tea or malt drinks. Evaporated milk (Peak tin) is affordable and widely available in Nigerian markets.',
    affordabilityRating: 2,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(61, 3.2, 4.8, 3.3, 0.0, 43, 0.1, 113, 0, 5, 46, 0.4),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Calcium', 'Vitamin D', 'Protein'],
    servingSuggestion: '1–2 glasses of milk (250–500ml) daily, or milk fortified pap.',
    pairsWellWith: ['Pap (Ogi)', 'Oatmeal', 'Banana', 'Tea'],
    avoidWith: ['Unpasteurised / raw milk (listeria risk)'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: true,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  {
    name: 'Palm Oil',
    category: FoodCategoryEnum.Dairy,
    benefits:
      'Nigeria\'s most important cooking fat. Red palm oil is one of the richest natural sources of vitamin A (as beta-carotene) and vitamin E. Vitamin A is critical for the baby\'s eye development, immune system, and skin. Supports absorption of fat-soluble vitamins.',
    mamaVoiceTip:
      'The red colour of palm oil is vitamin A — it goes straight to your baby\'s eyes and immune system. Use it in your soups every day, but not too much.',
    dangerWarning:
      'High in saturated fat — use in moderation (1–2 tablespoons per meal). Excessive palm oil intake can raise cholesterol. Avoid in large quantities if managing gestational hypertension.',
    preparationTips:
      'Use as the base for all Nigerian soups and stews. 1–2 tablespoons per pot is sufficient. Red palm oil (unrefined) is significantly more nutritious than bleached/refined palm oil.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(884, 0.0, 0.0, 100.0, 0.0, 0, 0.0, 0, 0, 0, 500, 0.0),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Vitamin A (beta-carotene)', 'Vitamin E', 'Healthy Fats'],
    servingSuggestion: '1–2 tablespoons per meal in soups and stews.',
    pairsWellWith: ['All Nigerian Soups', 'Stews', 'Rice', 'Yam'],
    avoidWith: ['Large amounts if managing hypertension or gestational diabetes'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  // ──────────────────────────────────────────────────────────────
  //  SOUPS (Whole Meal Context)
  // ──────────────────────────────────────────────────────────────
  {
    name: 'Mixed Vegetable Soup',
    category: FoodCategoryEnum.Soups,
    benefits:
      'Considered the most nutritious Nigerian soup for pregnant women. Made with ugu and waterleaf, smoked fish, periwinkle, and crayfish — it combines iron, folate, omega-3, iodine, zinc, and calcium in one bowl. Strongly recommended throughout pregnancy.',
    mamaVoiceTip:
      'Edikaikong is the number one soup for pregnancy in Nigeria. It has almost everything your baby needs — iron from ugu, omega-3 from fish, calcium from periwinkle, and vitamins from waterleaf. Try to eat it at least twice a week.',
    dangerWarning: null,
    preparationTips:
      'Combine ugu and waterleaf (equal amounts). Fry in palm oil with crayfish, stockfish, smoked fish, and periwinkle. No water added. The soup should be dry. Add less salt if managing blood pressure.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(85, 7.0, 5.0, 5.0, 2.5, 350, 3.2, 90, 28, 55, 280, 1.5),
    suitableFor: [FoodStageEnum.Pregnant, FoodStageEnum.Postpartum, FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.All],
    keyNutrients: ['Iron', 'Folate', 'Omega-3', 'Calcium'],
    servingSuggestion: 'A generous serving with eba, fufu, or pounded yam, 2–3 times per week.',
    pairsWellWith: ['Eba (Garri)', 'Pounded Yam', 'Fufu', 'Semovita'],
    avoidWith: null,
    isHighIron: true,
    isHighFolate: true,
    isHighCalcium: true,
    isHighProtein: true,
    isHighVitaminC: false,
  },

  {
    name: 'Okra Soup',
    category: FoodCategoryEnum.Soups,
    benefits:
      'Okra (lady\'s finger) is rich in folate, vitamin K, and mucilage (the slippery substance) that soothes the digestive tract. Excellent for constipation, heartburn, and reducing cholesterol. Folate content supports neural tube development in early pregnancy.',
    mamaVoiceTip:
      'Okro soup is very good for the first three months of pregnancy because of the folate. It also helps with constipation and heartburn that many women suffer in early pregnancy.',
    dangerWarning: null,
    preparationTips:
      'Slice okra finely (or blend for draw soup). Cook with palm oil, crayfish, smoked fish, and meat. Add ugu or waterleaf for extra nutrients. Can be combined with ogbono for a super nutritious draw soup.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(33, 2.0, 7.0, 0.2, 3.2, 8, 0.6, 82, 23, 60, 36, 0.6),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.First, TrimesterEnum.All],
    keyNutrients: ['Folate', 'Vitamin K', 'Fibre'],
    servingSuggestion: 'A bowl of okro soup with swallow, 2–3 times per week, especially in first trimester.',
    pairsWellWith: ['Eba', 'Fufu', 'Pounded Yam', 'Smoked Fish', 'Ogbono'],
    avoidWith: null,
    isHighIron: false,
    isHighFolate: true,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  // ──────────────────────────────────────────────────────────────
  //  DRINKS
  // ──────────────────────────────────────────────────────────────
  {
    name: 'Hibiscus Drink',
    category: FoodCategoryEnum.Drinks,
    benefits:
      'When consumed in moderate amounts in the second and third trimester, zobo provides vitamin C, iron, antioxidants, and can help manage blood pressure. A popular and affordable Nigerian drink.',
    mamaVoiceTip:
      'Zobo is okay in small amounts in the second and third months of pregnancy, but avoid it in the first three months. Always make it at home without too much sugar.',
    dangerWarning:
      'AVOID in the first trimester — hibiscus has been shown in studies to stimulate uterine contractions and may increase risk of early pregnancy loss. In the second and third trimester, small amounts (1 glass occasionally) are generally considered safe. Avoid commercial zobo with high sugar content. Do NOT use zobo as a treatment for high blood pressure without medical supervision.',
    preparationTips:
      'Boil dried hibiscus flowers with ginger, cloves, and a little sugar. Strain and serve cold. Add pineapple for flavour. Make at home to control sugar content.',
    affordabilityRating: 1,
    availabilityRating: 1,
    imageUrl: null,
    nutritionalValues: per100g(37, 0.1, 9.0, 0.1, 0.0, 6, 0.9, 9, 12, 0, 0, 0.0),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.Second, TrimesterEnum.Third],
    keyNutrients: ['Vitamin C', 'Antioxidants', 'Iron'],
    servingSuggestion: '1 small glass (200ml) occasionally in second or third trimester only.',
    pairsWellWith: ['Ginger', 'Pineapple', 'Cloves'],
    avoidWith: ['Avoid in first trimester entirely', 'Commercial high-sugar versions', 'Avoid large amounts throughout pregnancy'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },

  {
    name: 'Millet Drink',
    category: FoodCategoryEnum.Drinks,
    benefits:
      'A traditional Nigerian fermented grain drink rich in B vitamins, calcium, phosphorus, and natural probiotics from fermentation. Kunu aya (with tiger nuts) is especially nutritious — tiger nuts are high in iron and vitamin E.',
    mamaVoiceTip:
      'Kunu aya made with tiger nuts is very good for pregnant women. It gives you iron, calcium, and energy. Make it at home to avoid buying versions mixed with water from the roadside that can make you sick.',
    dangerWarning:
      'Always make kunu at home or buy from very trusted, clean sources. Roadside kunu is frequently made with contaminated water and causes severe diarrhoea — very dangerous in pregnancy. Avoid unpasteurised commercial kunu in sachets.',
    preparationTips:
      'Blend millet or sorghum with ginger and pepper, ferment for 24 hours, then cook. Kunu aya: blend tiger nuts and dates with water, strain, and serve chilled. Both are best homemade.',
    affordabilityRating: 1,
    availabilityRating: 2,
    imageUrl: null,
    nutritionalValues: per100g(60, 1.5, 13.0, 0.5, 0.5, 15, 0.8, 35, 0, 8, 0, 0.4),
    suitableFor: [FoodStageEnum.Both],
    trimesterRecommendation: [TrimesterEnum.Second, TrimesterEnum.Third],
    keyNutrients: ['B Vitamins', 'Calcium', 'Probiotics'],
    servingSuggestion: '1–2 glasses of homemade kunu per day.',
    pairsWellWith: ['Akara (Bean Cakes)', 'Masa (Rice Cakes)', 'Puff Puff'],
    avoidWith: ['Commercially prepared roadside kunu (contamination risk)', 'Avoid in first trimester if unsure of preparation safety'],
    isHighIron: false,
    isHighFolate: false,
    isHighCalcium: false,
    isHighProtein: false,
    isHighVitaminC: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
//  CONVENIENCE EXPORTS — Filtered subsets for quick UI queries
// ─────────────────────────────────────────────────────────────────────────────

export const HIGH_IRON_FOODS = FOOD_SEED_DATA.filter(f => f.isHighIron);
export const HIGH_FOLATE_FOODS = FOOD_SEED_DATA.filter(f => f.isHighFolate);
export const HIGH_CALCIUM_FOODS = FOOD_SEED_DATA.filter(f => f.isHighCalcium);
export const HIGH_PROTEIN_FOODS = FOOD_SEED_DATA.filter(f => f.isHighProtein);
export const HIGH_VITAMIN_C_FOODS = FOOD_SEED_DATA.filter(f => f.isHighVitaminC);
export const AFFORDABLE_FOODS = FOOD_SEED_DATA.filter(f => f.affordabilityRating === 1);
export const FIRST_TRIMESTER_FOODS = FOOD_SEED_DATA.filter(f =>
  f.trimesterRecommendation.includes(TrimesterEnum.First) ||
  f.trimesterRecommendation.includes(TrimesterEnum.All),
);
export const POSTPARTUM_FOODS = FOOD_SEED_DATA.filter(f =>
  f.suitableFor.includes(FoodStageEnum.Postpartum) ||
  f.suitableFor.includes(FoodStageEnum.Both),
);
export const FOODS_WITH_WARNINGS = FOOD_SEED_DATA.filter(f => f.dangerWarning !== null);