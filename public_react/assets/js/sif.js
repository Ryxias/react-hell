(() => {
  $(document).ready(() => {
    const $closed_envelope = $(".envelope-closed");
    const $open_envelope = $(".envelope-open");
    const $data_blob = $(".data");
    const audio = new Audio($data_blob.data("open-sound-url"));

    // Put an onclick listener on the close envelope that replaces it
    // with the open envelope, which then animates itself to grow fat as fuck
    // before exploding in disappointment for all you gacha fools

    $closed_envelope.on("click", () => {
      // Play kinky music
      //   Putting the animation crap in here ensures the audio begins to play before
      //   the animations, making the UI "feel" more snappy.
      console.log('CARD HAS BEEN CLICKED!');
      audio.play().then(animateOpeningBox);
    });

    const animateOpeningBox = () => {
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
    };
  });
})();
