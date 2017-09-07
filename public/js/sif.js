(() => {
  $(document).ready(() => {

    // Put an onclick listener on the close envelope that replaces it
    // with the open envelope, which then animates itself to grow fat as fuck
    // before exploding in disappointment for all you gacha fools

    $(".envelope-closed").on("click", () => {
      let $closed_envelope = $(".envelope-closed");
      let $open_envelope = $(".envelope-open");
      let $data_blob = $(".data");

      // Play kinky music
      let audio = new Audio($data_blob.data("open-sound-url"));
      audio.play();

      // Replace the closed envelope with the open one
      $closed_envelope.addClass("hide");
      $open_envelope.removeClass("hide");

      // Do some stupid ass animation of the open envelope
      $open_envelope.animate({width:'275px'}, 450, () => {
        //do stuff after animation
        $(".envelope-image-container").remove();
        let $container = $(".opened-card-container");
        $container.css("display", "none").removeClass("hide");
        $container.fadeIn("slow");
      });
    });
  });
})();
