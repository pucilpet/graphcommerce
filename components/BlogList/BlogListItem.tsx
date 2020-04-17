import React from 'react'
import { Typography, makeStyles } from '@material-ui/core'
import Link from '../Link'
import Asset from '../Asset'

const useStyles = makeStyles({
  item: {
    position: 'relative',
    fontSize: 20,
    marginBottom: '75px',
  },
  title: {
    color: '#000',
    fontSize: '25px',
    fontWeight: 500,
    lineHeight: '1.68',
    letterSpacing: '-0.0375em',
    margin: '0 0 30px',
  },
  date: {
    display: 'inline-block',
    color: '#b8b8b8',
    marginBottom: '30px',
  },
  imageContainer: {
    display: 'block',
    position: 'relative',
    marginBottom: '50px',
    '&::before': {
      content: '""',
      height: '100%',
      width: '100%',
      position: 'absolute',
      display: 'block',
      zIndex: '-1',
      boxShadow: '0 30px 60px 0 rgba(0, 0, 0, 0.25)',
      transform: 'scale(.85, 0.95)',
    },
  },
  image: {
    display: 'block',
    width: '100%',
    height: 'auto',
  },
  href: {
    textDecoration: 'none !important',
  },
  link: {
    textDecoration: 'underline',
  },
})

const BlogListItem: React.FC<GQLBlogListItemFragment> = ({
  title,
  url,
  metaRobots,
  documentInStages,
  asset,
  locale,
}) => {
  const classes = useStyles()
  const publishedAt = documentInStages?.[0]?.publishedAt

  const publishedAtFormatted = new Date(publishedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={url} metaRobots={metaRobots!} className={classes.href}>
      <div className={classes.item}>
        <div className={classes.imageContainer}>
          {asset ? (
            <Asset asset={asset} className={classes.image} width={179} />
          ) : (
            <div>GEEN AFBEELDING</div>
          )}
        </div>
        <div className={classes.date}>{publishedAtFormatted}</div>
        <Typography component='h4' className={classes.title}>
          {title}
        </Typography>
        <div className={classes.link}>Lees meer</div>
      </div>
    </Link>
  )
}

export default BlogListItem