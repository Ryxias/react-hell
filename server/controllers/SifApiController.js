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

  share_roll_action(req, res, next) {
    const card_id = req.body.card_id;
    const idolized = !!req.body.idolized;

    if (!card_id) {
      return res.status(400).send({
        success: false,
        message: 'No card provided',
        system_code: '40498072POLMWUYBW',
      });
    }

    this._ll_client().getCard(card_id)
      .then(card => {
        if (!card) {
          return res.status(404).send({
            success: false,
            message: 'No such card found',
            system_code: '404738236VYBEOMDW',
            card_id,
          });
        }

        const getPersonString = this.get('SlackUserStore').findSlackUserByUserId(req.user.id)
          .then(slack_user => {
            if (!slack_user) {
              return req.user.getUsername();
            }
            return `<@${slack_user.slack_user_id}>`;
          })
          .catch(err => '... someone');

        return Promise.resolve(getPersonString)
          .then(person => {
            const sif_channel_id = require('../../lib/Slack/SlackChannels').schoolidolfestival;
            const card_string = '[' + card.getId() + '] '
              + card.getName() + ' - '
              + (idolized ? card.getIdolizedImageUrl() : card.getImageUrl());

            const text = `Look! ${person} rolled a ${card_string}`;
            return this.get('chuubot').sendMessage(text, sif_channel_id)
              .then(message_result => {
                return res.send({
                  success: true,
                  message: 'Shared!',
                  system_code: '2007493PUEBNEWQSJSA',
                  card,
                  res: message_result,
                });
              });
          });
      })
      .catch(err => res.status(500).send({
        success: false,
        message: err.message,
        system_code: '500007182BUENQLW',
        error: err,
      }));
  }

  _ll_client() {
    return this.get('sif.client');
  }

  _renderJSON(card, res) {
    const { envelope_image_closed, envelope_image_open, open_sound } = this._mapRarityToAssets(card.getRarity());
    const data = {
      id: card.getId(),
      card_title: "[" + card.getId() + "] " + card.getName(),
      card_ext_link: card.getWebsiteUrl(),
      card_image_url: card.getImageUrl(),
      card_idolized_image_url: card.getIdolizedImageUrl(),
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
