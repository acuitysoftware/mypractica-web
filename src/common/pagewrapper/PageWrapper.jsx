import React from 'react';
import './styles.scss';
import pagebanner from '../../assets/page-banner.png';
import { Link, useLocation } from 'react-router-dom';

const PageWrapper = ({ children, head, Img, dynamictitle }) => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean); // ['sign-in']
  const pageSlug = pathParts[pathParts.length - 1] || 'home';

  console.log(head);

  // Capitalize and remove dashes
  const formatPageName = (slug) => {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const pageTitle = formatPageName(pageSlug);
  return (
    <div className="page-wrapper">
      <div
        className="banner-img"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
            Img ? Img : pagebanner
          })`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="bread-crumb">
          {head ? (
            <div dangerouslySetInnerHTML={{ __html: head }} />
          ) : (
            <h1>{pageTitle}</h1>
          )}

          {/* <p>
            <Link
              style={{
                color: '#fff',
                textDecoration: 'none',
              }}
              to={`/home`}
            >
              <span>Home</span>
            </Link>{' '}
            &gt;{' '}
            <Link
              style={{
                color: '#fff',
                textDecoration: 'none',
              }}
              to={dynamictitle ? null : `/${pageSlug}`}
            >
              <span>{dynamictitle ? head : pageTitle}</span>
            </Link>
          </p> */}
        </div>
      </div>
      <div className="body">{children}</div>
    </div>
  );
};

export default PageWrapper;
