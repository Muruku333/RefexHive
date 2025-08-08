// @project
import { landingMegamenu, pagesMegamenu } from '../../common-data';
import SvgIcon from '@/components/SvgIcon';
import { SECTION_PATH, ADMIN_PATH, BUY_NOW_URL, DOCS_URL, FREEBIES_URL } from '@/path';

/***************************  DEFAULT - NAVBAR  ***************************/

const linkProps = { target: '_blank', rel: 'noopener noreferrer' };
export const navbar = {
  customization: true,
  secondaryBtn: {
    children: <SvgIcon name="tabler-brand-github" color="primary.main" size={18} />,
    href: FREEBIES_URL,
    ...linkProps,
    sx: { minWidth: 40, width: 40, height: 40, p: 0 }
  },
  primaryBtn: { children: 'Log out', href: BUY_NOW_URL, ...linkProps },
  navItems: [
    { id: 'home', title: 'Home', link: '/' },
    { id: 'lms', title: 'LMS', link: '/lms' },
    { id: 'newsroom', title: 'Newsroom', link: '/newsroom' },
    { id: 'employeee_corner', title: 'Employees Corner', link: '/employee_corner' },
    { id: 'hr_corner', title: 'HR Corner', link: '/hr_corner' },
    { id: 'it_support', title: 'IT Support', link: '/it_support' },
    // { id: 'docs', title: 'Docs', link: DOCS_URL, ...linkProps, icon: 'tabler-pin-invoke' },
    // pagesMegamenu,
    landingMegamenu
  ]
};
