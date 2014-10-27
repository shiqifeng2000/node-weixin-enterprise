var image, voice, video,logging=require('./logging');

exports.text = function (json, next) {

    var text = json.Content;
    if (text == "help") {
        next.text("You may type [video], [voice], [image] for the latest follower uploads, or type [music] for a pop song and [news] for latest news ");
    } else if (text == "video") {
        next.video(video);
    } else if (text == "voice") {
        next.voice(voice);
    } else if (text == "image") {
        next.image(image);
    } else if (text == "music") {
        next.music();
    } else if (text == "news") {
        next.news();
    }
}

exports.video = function (json, next) {

    video = json.MediaId;
    next.text("thank you for sending this video, type [video] for the latest updates on server ");
}

exports.voice = function (json, next) {

    voice = json.MediaId;
    next.text("thank you for sending this voice, type [voice] for the latest updates on server");
}

exports.image = function (json, next) {

    image = json.MediaId;
    next.text("thank you for sending this image, type [image] for the latest updates on server ");
}

exports.location = function (json, next) {

    next.text("you are now at: " + json.Location_X + "," + json.Location_Y);
}

exports.link = function (json, next) {

    next.text("the link <" + json.Title + "> has been received and recorded in our logs");
}

exports.event = function (json, next) {

    next.news();
}


/**
 * Created by Robin on 10/18/2014.
 */
