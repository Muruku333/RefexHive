// @mui
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { SECTION_PATH } from '@/path';
const linkProps = { target: '_blank', rel: 'noopener noreferrer' };

export const hero = {
  chip: {
    label: (
      <>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Yours to
        </Typography>
        <Chip
          label={
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              Connect
            </Typography>
          }
          sx={{ height: 24, bgcolor: 'primary.lighter', mr: -1, ml: 0.75, '& .MuiChip-label': { px: 1.25 } }}
          icon={
            <CardMedia
              component="img"
              image="/assets/images/shared/celebration.svg"
              sx={{ width: 16, height: 16 }}
              alt="celebration"
              loading="lazy"
            />
          }
        />
      </>
    )
  },
  headLine: 'Welcome to Refex Hive',
  captionLine: 'Yours to work smarter — with news, HR tools, and IT support in one integrated platform.',
  primaryBtn: { children: 'Explore All Business', href: 'https://www.refex.group/', ...linkProps },
  // videoSrc: 'https://d2elhhoq00m1pj.cloudfront.net/saasable-intro.mp4',
  // videoThumbnail: '/assets/videos/thumbnails/intro-thumbnail.png',
  videoSrc: '/uploads/videos/refex-intro.mp4',
  videoThumbnail: '/assets/videos/thumbnails/refex-thumbnail.png',
  listData: [
    { image: '/assets/images/companies/refex.png', title: 'Refex', link: 'https://www.refex.group/' },
    { image: '/assets/images/companies/sparzana.png', title: 'Sparzana', link: 'https://sparzana.com/' },
    { image: '/assets/images/companies/mobility.png', title: 'Refex Mobility', link: 'https://refexmobility.com/' },
    { image: '/assets/images/companies/3i.png', title: '3i MedTech', link: 'https://3imedtech.com/' },
    { image: '/assets/images/companies/venwind.png', title: 'Venwind Refex', link: 'https://venwindrefex.com/' }
    // { image: '/assets/images/shared/react.svg', title: 'React 19' },
    // { image: '/assets/images/shared/next-js.svg', title: 'Next.js' },
    // { image: '/assets/images/shared/material-ui.svg', title: 'Material UI v7' },
    // { image: '/assets/images/shared/typescript.svg', title: 'TypeScript' },
    // { image: '/assets/images/shared/javascript.svg', title: 'JavaScript' },
    // { image: '/assets/images/shared/m3.svg', title: 'Material 3' },
    // { image: '/assets/images/shared/figma.svg', title: 'Figma' }
  ]
};
