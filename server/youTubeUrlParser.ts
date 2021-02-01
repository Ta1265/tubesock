export default function YouTubeGetID(fullurl: string): string {
  const url = fullurl.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_-]/i)[0] : url[0];
};
