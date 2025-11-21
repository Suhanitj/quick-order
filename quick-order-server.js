const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Simple catalog mock
const CATALOG = [
  { id: "tomato", name: "Tomatoes", packs: [{ g: 500, price: 30 }] },
  { id: "onion", name: "Onions", packs: [{ g: 1000, price: 40 }] },
  { id: "potato", name: "Potatoes", packs: [{ g: 1000, price: 35 }] },
];

// Basic parser
function parseText(text) {
  text = text.toLowerCase();
  const days = text.match(/(\d+)\s*day/) ? parseInt(text.match(/(\d+)\s*day/)[1]) : 1;
  const budgetMatch = text.match(/(\d+)\s*(rs|inr)?/);
  const budget = budgetMatch ? parseInt(budgetMatch[1]) : null;

  return {
    intent: "order_groceries",
    categories: ["vegetables"],
    days,
    budget,
    raw: text,
  };
}

function createBaskets(parsed) {
  const baseBasket = [
    { name: "Tomatoes", qty_g: 500, price: 30 },
    { name: "Onions", qty_g: 1000, price: 40 },
    { name: "Potatoes", qty_g: 1000, price: 35 }
  ];

  return [
    { tier: "economy", items: baseBasket, items_total: 105 },
    { tier: "balanced", items: baseBasket, items_total: 105 },
    { tier: "premium", items: baseBasket, items_total: 105 }
  ];
}

app.post("/quick-order", (req, res) => {
  const parsed = parseText(req.body.text || "");
  const suggestions = createBaskets(parsed);

  const slots = [
    { slot_id: "1", label: "Today 7–9pm", fee: 20 },
    { slot_id: "2", label: "Tomorrow 6–8am", fee: 0 },
    { slot_id: "3", label: "Today 9–11pm", fee: 30 },
  ];

  res.json({ parsed, suggestions, slots });
});

app.listen(process.env.PORT || 3333, () => {
  console.log("Quick-order server running on port 3333");
});
app.post('/orders', (req, res) => {
  const { basket, slot } = req.body || {};
  if (!basket || !slot) return res.status(400).json({ error: 'missing_basket_or_slot' });
  const orderId = 'ORD' + Date.now();
  const eta = slot.label || 'TBD';
  console.log('Demo order created:', { orderId, basket, slot });
  return res.json({ ok: true, orderId, eta });
});
