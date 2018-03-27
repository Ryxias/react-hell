'use strict';

const { Controller } = require('express-route-registry');

class SifApiController extends Controller {

  get_roll_gacha_action(req, res, next) {
    const units = ["Mu's", "Aqours"];
    let unit = units[Math.floor(Math.random() * 2)];
    this._ll_client().gachaRCard(unit)
      .then((card) => {
        this._renderJSON(card, res);
      });
  }

  _ll_client() {
    return this.get('sif.client');
  }

  _renderJSON(card, res) {
    const { envelope_image_closed, envelope_image_open, open_sound } = this._mapRarityToAssets(card.getRarity());
    const data = {
      card_title: "[" + card.getId() + "] " + card.getName(),
      card_ext_link: card.getWebsiteUrl(),
      card_image_url: card.getImageUrl(),
      rarity: card.getRarity(),
      envelope_image_closed: envelope_image_closed,
      envelope_image_open: envelope_image_open,
      open_sound: open_sound,
    };
    res.send(data);
  }

  // Had to use some methods from routes/sif.js since they weren't exported out
  _mapRarityToAssets(rarity) {
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

    return {
      envelope_image_open,
      envelope_image_closed,
      open_sound,
    };
  }
}
module.exports = SifApiController;
