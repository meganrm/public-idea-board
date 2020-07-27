import React from 'react'
import { map } from 'lodash';
import PropTypes from 'prop-types'
import { kebabCase } from 'lodash'
import { Helmet } from 'react-helmet'
import { graphql, Link } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'

export const ProjectTemplate = ({
  content,
  contentComponent,
  tags,
  title,
  goals,
  roles,
  helmet,
  datasets
}) => {
  const PostContent = contentComponent || Content
  return (
    <section className="section">
      {helmet || ''}
      <div className="container content">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
              {title} 
            </h1>
            <ul>
              {map(goals, (value, key) => (
                <li key={key}>{key}: {value}</li>)
              )}
            </ul>
            <ul className="unstyled-list">
              {datasets && datasets.map((dataset) => (
                <li key={dataset.id + `tag`} className="box">
                  <Link to={`/tags/${kebabCase(dataset.frontmatter.link)}/`}>{dataset.frontmatter.title}</Link>
                  {dataset.html && <PostContent content={dataset.html} />}
                </li>
              ))}
            </ul>
            <PostContent content={content} />
            {tags && tags.length ? (
              <div style={{ marginTop: `4rem` }}>
                <h4>Keywords</h4>
                <ul className="taglist">
                  {tags.map((tag) => (
                    <li key={tag + `tag`}>
                      <Link to={`/tags/${kebabCase(tag)}/`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

ProjectTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
}

const Project = ({ data }) => {
  const { markdownRemark: project } = data
  console.log(project);
  const {
    datasets
  } = project.fields;

  return (
    <Layout>
      <ProjectTemplate
        content={project.html}
        contentComponent={HTMLContent}
        goals={project.frontmatter.goals}
        roles={project.frontmatter.roles}
        datasets={datasets}
        helmet={
          <Helmet titleTemplate="%s | Blog">
            <title>{`${project.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${project.frontmatter.goals["high level"]}`}
            />
          </Helmet>
        }
        title={project.frontmatter.title}
      />
    </Layout>
  )
}

Project.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default Project

export const pageQuery = graphql`
  query ProjectByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      fields {
        datasets {
          id
          html
          frontmatter {
            title
            link
            description
          }
        }
      }
      frontmatter {
        title
        datasets
        goals {
            high_level
            smart_goals
        }
        roles {
            scientific_lead
            scientific_project_lead
            team_ambassadors
            project_managers
        }
      }
    }
  }
`
