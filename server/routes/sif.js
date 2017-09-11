'use strict';

const router = require('express').Router();

// Love Live Gacha crap
router.get('/random', (req, res, next) => {
  const LoveLiveClient = require(PROJECT_ROOT + 'lib/love_live_client');
  const ll_client = new LoveLiveClient();

  ll_client.getRandomCard().then((card) => {
    return res.render('sif',
      {
        header: true,
        footer: true,
        title: card.getName(),
        card_image_url: card.getImageUrl(),
      }
    );
  });
});

// Test endpoint
router.get('/gacha', (req, res) => {
  const LoveLiveClient = require(PROJECT_ROOT + 'lib/love_live_client');
  const ll_client = new LoveLiveClient();

  ll_client.gachaRCard().then((card) => {
    let { envelope_image_closed, envelope_image_open, open_sound } = mapRarityToAssets(card.getRarity());
    return res.render('sif',
      {
        header: true,
        footer: true,
        title: "School Idol Festival Gacha",
        js: ["sif.js"],
        css: ["sif.css"],

        card_title: "[" + card.getId() + "] " + card.getName(),
        card_ext_link: card.getWebsiteUrl(),
        card_image_url: card.getImageUrl(),
        rarity: card.getRarity(),
        envelope_image_closed: envelope_image_closed,
        envelope_image_open: envelope_image_open,
        open_sound: open_sound,
      }
    );
  });
});

const mapRarityToAssets = (rarity) => {
  let envelope_image_closed;
  let envelope_image_open;
  let open_sound;
  switch (rarity) {
    case "UR":
      envelope_image_closed = "envelope_ur1.png";
      envelope_image_open = "envelope_ur2.png";
      open_sound = "ur_open.mp3";
      break;
    case "SSR":
      envelope_image_closed = "envelope_ssr1.png";
      envelope_image_open = "envelope_ssr2.png";
      open_sound = "ssr_open.mp3";
      break;
    case "SR":
      envelope_image_closed = "envelope_sr1.png";
      envelope_image_open = "envelope_sr2.png";
      open_sound = "sr_open.mp3";
      break;
    case "R":
    default:
      envelope_image_closed = "envelope_r1.png";
      envelope_image_open = "envelope_r2.png";
      open_sound = "r_open.mp3";
      break;
  }
};

module.exports = router;
