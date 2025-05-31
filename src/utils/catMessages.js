// Fun cat-themed messages for API rate limit errors
export const catMessages = [
  {
    title: "CAT INVASION!",
    message: "Meow! GitHub API rate limit exceeded. The cats have taken over!",
    button: "Shoo Away Cats",
  },
  {
    title: "GitHub Has Been Overpetted",
    message:
      "You pet the GitHub API too much... Rate limit exceeded. Kitty needs a nap... 🐱",
    button: "Let Kitty Rest",
  },
  {
    title: "MEOW-STOP!",
    message: 'GitHub says: "Too many treats! Wait a bit and try again later."',
    button: "No More Treats",
  },
  {
    title: "Paws For A Moment",
    message:
      "HTTP 403 – API Rate Limit Exceeded. The cats are taking a catnap.",
    button: "Wake Me Later",
  },
  {
    title: "Catastrophic Overload",
    message:
      "Too many requests! The GitHub cats are hiding under the API couch.",
    button: "Coax Them Out",
  },
  {
    title: "Error 429: Too Many Meows",
    message:
      "The GitHub kittens are overwhelmed with belly rubs. Please try again after a nap.",
    button: "Try Again Later",
  },
  {
    title: "Nap Mode Activated",
    message:
      "GitHub’s cats are curled up and ignoring your requests. Rate limit reached.",
    button: "Respect the Nap",
  },
  {
    title: "Scratch Limit Reached",
    message:
      "You've scratched GitHub's API one too many times. It's hissing now. 🐾",
    button: "Back Away Slowly",
  },
  {
    title: "Fur-midable Traffic",
    message:
      "Too much purring on the line. GitHub needs a moment to breathe. 🐈",
    button: "Give It Space",
  },
  {
    title: "Whisker Fatigue",
    message:
      "GitHub’s whiskers are tingling — too many requests at once. It’s break time!",
    button: "Let It Chill",
  },
];

// Get a random cat message
export const getRandomCatMessage = () => {
  const randomIndex = Math.floor(Math.random() * catMessages.length);
  return catMessages[randomIndex];
};
