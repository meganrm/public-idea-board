import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import {
    kebabCase
} from 'lodash'
import PreviewCompatibleImage from './PreviewCompatibleImage'

class ProjectPost extends React.Component {
  render() {
    const { post } = this.props;
    return (
            <div className="is-parent column is-6" key={post.id}>
              <article
                className={`blog-list-item tile is-child box notification ${
                  post.frontmatter.featuredpost ? 'is-featured' : ''
                }`}
              >
                <header>
                  {post.frontmatter.featuredimage ? (
                    <div className="featured-thumbnail">
                      <PreviewCompatibleImage
                        imageInfo={{
                          image: post.frontmatter.featuredimage,
                          alt: `featured image thumbnail for post ${post.frontmatter.title}`,
                        }}
                      />
                    </div>
                  ) : null}
                  <div className="post-meta">
                    <Link
                      className="title has-text-primary is-size-4"
                      to={post.fields.slug}
                    >
                      {post.frontmatter.title}
                    </Link>
                    <span> &bull; </span>
                    <span className="subtitle is-size-5 is-block">
                      {post.frontmatter.date}
                    </span>
                    <span className="subtitle is-size-5 is-block">
                      Status: {post.frontmatter.status}
                    </span>
                    <span className="subtitle is-size-5 is-block">
                      {post.frontmatter.description}
                    </span>
                  </div>
                </header>
               {post.frontmatter.tags && post.frontmatter.tags.length ? (
              <div style={{ marginTop: `4rem` }}>
                <h4>Keywords</h4>
                <ul className="taglist">
                  {post.frontmatter.tags.map((tag) => (
                    <li key={tag + `tag`}>
                      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
              </article>
            </div>
        
    )
  }
}

ProjectPost.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
}

export default ProjectPost;
