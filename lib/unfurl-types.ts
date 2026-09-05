export type UnfurlTextMode = "light" | "dark";

export type UnfurlResult = {
  url: string;
  title: string;
  domain: string;
  imageUrl: string | null;
  backgroundHex: string;
  textMode: UnfurlTextMode;
};
