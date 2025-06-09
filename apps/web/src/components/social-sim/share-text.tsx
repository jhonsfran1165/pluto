import { TwitterIcon, TwitterShareButton } from 'react-share';

export function ShareToX({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  return (
    <TwitterShareButton url={url} title={title}>
      <TwitterIcon size={32} round />
      Share on X
    </TwitterShareButton>
  );
}