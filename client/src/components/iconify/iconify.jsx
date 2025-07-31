import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export default function Iconify({ icon, width = 20, sx, ...other }, ref) {
  return <Box ref={ref} component={Icon} className="component-iconify" icon={icon} sx={{ width, height: width, ...sx }} {...other} />;
}

Iconify.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  width: PropTypes.number
};
