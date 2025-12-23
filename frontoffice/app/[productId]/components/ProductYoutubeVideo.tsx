type YouTubeEmbedProps = {
  url?: string;
};

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function ProductYoutubeVideo({ url }: YouTubeEmbedProps) {
  if (!url) return null;

  const videoId = extractYouTubeId(url);
  if (!videoId) return null;

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        className="absolute inset-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
