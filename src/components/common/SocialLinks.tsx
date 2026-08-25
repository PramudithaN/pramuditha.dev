import { Icon } from '@iconify/react';
import type { SocialLinkItem } from '../../types';
import { socialLinks, aboutSocialLinks } from '../../constants/socials';

interface SocialLinksProps {
  variant: 'vertical' | 'footer' | 'about';
  customLinks?: SocialLinkItem[];
}

export default function SocialLinks({ variant, customLinks }: SocialLinksProps) {
  const links = customLinks || (variant === 'about' ? aboutSocialLinks : socialLinks);

  let containerClass = 'footer-links';
  let iconSize = '24';

  if (variant === 'vertical') {
    containerClass = 'left-socials-vertical';
    iconSize = '22';
  } else if (variant === 'about') {
    containerClass = 'about-social-links';
    iconSize = '20';
  }

  return (
    <div className={containerClass} aria-label="Social media links">
      {links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target={link.url.startsWith('mailto:') ? undefined : '_blank'}
          rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
          className={variant === 'footer' ? 'footer-link' : undefined}
          title={link.title}
          aria-label={link.title}
        >
          <Icon icon={link.icon} width={iconSize} height={iconSize} />
        </a>
      ))}
    </div>
  );
}
