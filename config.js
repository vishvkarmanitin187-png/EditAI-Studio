// EditFlux production configuration.
// NEVER put private API keys here. Only public IDs/config belong in this file.
window.EDITFLUX_CONFIG = {
  ads: {
    enabled: false,
    provider: "google-rewarded",
    publisherId: "ca-pub-REPLACE_WITH_YOUR_PUBLISHER_ID",
    rewardedAdUnitId: "REPLACE_WITH_YOUR_REWARDED_AD_UNIT_ID",
    requiredAdsForFreeExport: 0,
    requiredAdsFor4K: 0
  },
  firebase: {
    enabled: false,
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  },
  ai: {
    backendBaseUrl: "/api",
    captionsEndpoint: "/api/captions",
    backgroundRemovalEndpoint: "/api/background-remove",
    imageEditEndpoint: "/api/image-edit"
  }
};
