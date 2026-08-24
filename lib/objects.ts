export type ObjectItem = {
  id: string;
  name: string;
  description: string;
  imageSrc: string;
  href?: string;
};

export const OBJECT_ITEMS = [
  {
    id: "macbook-pro-13",
    name: 'MacBook Pro 13"',
    description:
      "I spend most of my waking hours in front of this machine. Given by my company.",
    imageSrc: "/objects/macbook-pro-13.png",
    href: "https://www.apple.com/macbook-pro-13/index.html",
  },
  {
    id: "kindle-paperwhite",
    name: "Kindle Paperwhite",
    description:
      "I LOVE reading physical books, the feel, the collection. But Kindle is worth the switch.",
    imageSrc: "/objects/kindle-paperwhite.png",
    href: "https://www.amazon.com/Amazon-Kindle-Ereader-Family/b?ie=UTF8&node=6669702011",
  },
  {
    id: "aer-travel-pack",
    name: "AER Travel Pack",
    description:
      "Built like a beast and makes my life (and back) comfortable af.",
    imageSrc: "/objects/aer-travel-pack.png",
    href: "https://aersf.com/products/travel-pack-3",
  },
  {
    id: "muji-suitcase",
    name: "Muji Suitcase",
    description: "Fairly simple suitcase with some thoughtful design choices.",
    imageSrc: "/objects/muji-suitcase.png",
    href: "https://www.muji.com/sg/products/cmdty/detail/4550512711209",
  },
  {
    id: "airpods-pro-2",
    name: "AirPods Pro 2",
    description:
      "These are what made me switch to the iPhone. The convenience was too good. 2nd pair.",
    imageSrc: "/objects/airpods-pro-2.png",
    href: "https://www.apple.com/in/airpods-pro/",
  },
  {
    id: "logitech-mx-keys",
    name: "Logitech MX keys",
    description:
      "A good keyboard is really under appreciated by people. Go get one ASAP.",
    imageSrc: "/objects/logitech-mx-keys.png",
    href: "https://www.logitech.com/en-us/products/keyboards/mx-keys-mac-wireless-keyboard.html",
  },
  {
    id: "tomtoc-edc-sling",
    name: "Tomtoc EDC Sling",
    description:
      "I take my sling everywhere I go. This has really good materials and a clever design.",
    imageSrc: "/objects/tomtoc-edc-sling.png",
    href: "https://www.tomtoc.com/products/tomtoc-urban-sling-bag-with-8-inch-minimalist-edc-design-black",
  },
  {
    id: "hario-mizudashi",
    name: "Hario Mizudashi Coffee Pot",
    description:
      "I take this pot with me to brew coffee while I travel. Simply works like it should.",
    imageSrc: "/objects/hario-mizudashi.png",
    href: "https://global.hario.com/product/coffee/coldbrew/MCPN.html",
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    description:
      "Aside from the apple eco-system, iPhone just has this amazing catalogue of (indie) apps.",
    imageSrc: "/objects/iphone-15.png",
  },
  {
    id: "apple-watch-se",
    name: "Apple Watch SE 2022",
    description:
      "Very recently got an Apple Watch. It is always satisfying to see metrics on my football sessions.",
    imageSrc: "/objects/apple-watch-se.png",
    href: "https://www.apple.com/in/apple-watch-se/",
  },
  {
    id: "homepod",
    name: "HomePod",
    description:
      "For the size of it, the sound is amazing, you have to hear it to believe it.",
    imageSrc: "/objects/homepod.png",
    href: "https://www.apple.com/in/homepod-2nd-generation/",
  },
  {
    id: "magic-trackpad",
    name: "Apple Magic Trackpad",
    description: "Don't @ me I'm a trackpad person.",
    imageSrc: "/objects/magic-trackpad.png",
    href: "https://www.apple.com/in/shop/product/MXK93ZM/A/magic-trackpad",
  },
  {
    id: "ipad-pro-11",
    name: 'iPad Pro 11" 2018',
    description:
      "iPad is where my obsession started with Apple products. Gifted by my brother.",
    imageSrc: "/objects/ipad-pro-11.png",
    href: "https://www.apple.com/in/ipad-pro/",
  },
  {
    id: "sony-wxm5",
    name: "Sony WXM5",
    description:
      "Noise cancellation headphones let me drown out my environment and focus a little better.",
    imageSrc: "/objects/sony-wxm5.png",
    href: "https://electronics.sony.com/audio/headphones/headband/p/wh1000xm5-b",
  },
  {
    id: "mepal-coffee-mug",
    name: "Mepal Coffee Mug",
    description:
      "Solid mug. Great design. Loving it so far plus it's easy to clean.",
    imageSrc: "/objects/mepal-coffee-mug.png",
    href: "https://www.mepal.com/us/insulated-mug-ellipse-375-ml-nordic-green-104180092400",
  },
  {
    id: "monitor-lightbar",
    name: "Monitor Lightbar",
    description:
      "Doesn't take any space on my desk and illuminates the whole surface, plus it's wireless.",
    imageSrc: "/objects/monitor-lightbar.png",
    href: "https://www.amazon.in/Troner-Eye-Care-Technology-Computer-Auto-Dimming/dp/B0BHYRMF6C/",
  },
  {
    id: "playstation-5",
    name: "PlayStation 5",
    description:
      "Sony’s PS exclusives are just too good to pass on. Playstation forever!",
    imageSrc: "/objects/playstation-5.png",
    href: "https://www.playstation.com/en-in/ps5/",
  },
  {
    id: "sony-pulse-3d",
    name: "Sony Pulse 3D headset",
    description: "Zero-lag, wireless surround sound headphones for gaming.",
    imageSrc: "/objects/sony-pulse-3d.png",
    href: "https://www.playstation.com/en-in/accessories/pulse-3d-wireless-headset/",
  },
  {
    id: "belkin-boostcharge-pro",
    name: "Belkin BoostCharge Pro 65w GaN charger",
    description:
      "Dual port, compact fast charger. One charger to rule them all.",
    imageSrc: "/objects/belkin-boostcharge-pro.png",
    href: "https://www.belkin.com/in/p/dual-usb-c-gan-wall-charger-with-pps-65w/WCH013zbWH.html",
  },
  {
    id: "magsafe-duo",
    name: "Magsafe Duo",
    description:
      "iPhone + Watch charger. One (wireless) charger to rule them all.",
    imageSrc: "/objects/magsafe-duo.png",
  },
  {
    id: "mepal-water-bottle",
    name: "Mepal water bottle",
    description:
      "Good looking water bottle that fits snugly into my bagpack side-pocket.",
    imageSrc: "/objects/mepal-water-bottle.png",
  },
  {
    id: "teknion-contessa",
    name: "Teknion Contessa",
    description: "Bought it second-hand. Pretty good chair.",
    imageSrc: "/objects/teknion-contessa.png",
    href: "https://www.teknion.com/products/product-details?productlineid=745a336e-8e7a-673b-a6c8-ff00004460c4",
  },
  {
    id: "ikea-anfallare",
    name: "IKEA ANFALLARE",
    description: "Bamboo, smooeth rounded edges, and wide enough.",
    imageSrc: "/objects/ikea-anfallare.png",
    href: "https://www.ikea.com/us/en/p/anfallare-tabletop-bamboo-00465141/",
  },
  {
    id: "lg-ergo-4k",
    name: 'LG Ergo 4k 27" Monitor',
    description:
      "The ergo arm is superb, the color accuracy is decent and the 4k tho not ideal is good enough.",
    imageSrc: "/objects/lg-ergo-4k.png",
    href: "https://www.lg.com/in/monitors/ergo-monitors/27un880-b/",
  },
  {
    id: "braun-alarm-clock",
    name: "Braun Alarm Clock",
    description: "functional, beautiful and tactile. It's Braun afterall.",
    imageSrc: "/objects/braun-alarm-clock.jpg",
    href: "https://www.amazon.in/dp/B09HL4GJDM?ref=ppx_yo2ov_dt_b_fed_asin_title",
  },
  {
    id: "muji-aroma-diffuser",
    name: "MUJI Aroma Diffuser",
    description: "Adds softness to the air and to my mood.",
    imageSrc: "/objects/muji-aroma-diffuser.webp",
    href: "https://muji.in/product/aroma-diffuser-9662132",
  },
  {
    id: "muji-mechanical-pencil",
    name: "MUJI Mechanical Pencil 0.5mm",
    description:
      "Clicky and fidgety. Low center of gravity makes it quite comfortable.",
    imageSrc: "/objects/muji-mechanical-pencil.webp",
    href: "https://muji.in/product/sharp-pencil-w-low-center-of-gravity-9645281",
  },
  {
    id: "givenchy-gentleman",
    name: "Givenchy Gentleman Eau De Toilette",
    description: "Gentle and sweet. Just like me.",
    imageSrc: "/objects/givenchy-gentleman.jpeg",
    href: "https://sephora.in/product/givenchy-gentleman-eau-de-toilette-v-60ml",
  },
] satisfies ObjectItem[];
