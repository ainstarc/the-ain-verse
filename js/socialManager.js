// imports starts

import {
    GITHUB_USERNAME,
    INSTAGRAM_HANDLER,
    YOUTUBE_HANDLER,
    TWITTER_HANDLER,
    DISCORD_HANDLER,
} from "./config.js";

import { github, instagram, youtube, twitter, discord } from "./domElements.js";
// imports ends

export function injectSocial() {
    github.href = `https://github.com/${GITHUB_USERNAME}`;

    if (INSTAGRAM_HANDLER) {
        instagram.href = `https://www.instagram.com/${INSTAGRAM_HANDLER}`;
        instagram.classList.remove("hide");
    }

    if (YOUTUBE_HANDLER) {
        youtube.href = `https://www.youtube.com/@${YOUTUBE_HANDLER}`;
        youtube.classList.remove("hide");
    }
    if (TWITTER_HANDLER) {
        twitter.href = `https://www.twitter.com/${TWITTER_HANDLER}`;
        twitter.classList.remove("hide");
    }
    if (DISCORD_HANDLER) {
        discord.href = `https://www.discord.com/users/${DISCORD_HANDLER}`;
        discord.classList.remove("hide");
    }
}
