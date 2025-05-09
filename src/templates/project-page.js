import React from "react";
import { map } from "lodash";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import { Helmet } from "react-helmet";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";

export const ProjectTemplate = ({
    content,
    contentComponent,
    tags,
    title,
    goals,
    roles,
    helmet,
    datasets,
    meetings,
}) => {
    const PostContent = contentComponent || Content;
    return (
        <section className="section">
            {helmet || ""}
            <div className="container content">
                <div className="columns">
                    <div className="column is-10 is-offset-1">
                        <h1 className="title is-size-2 has-text-weight-bold is-bold-light">
                            {title}
                        </h1>
                        <h4>High Level Goals: {goals.high_level}</h4>
                        <h4>Related SMART Goals: {goals.smart_goals}</h4>
                        <h3>Datatsets and Resources</h3>
                        <ul className="unstyled-list">
                            {datasets &&
                                datasets.map((dataset) => (
                                    <li key={dataset.id} className="box">
                                        <a href={dataset.frontmatter.link}>
                                            {dataset.frontmatter.title}
                                        </a>
                                        {dataset.html && (
                                            <PostContent
                                                content={dataset.html}
                                            />
                                        )}
                                    </li>
                                ))}
                        </ul>
                        <h3>Past meetings</h3>
                        {meetings &&
                            meetings.map((meeting) => (
                                <li key={meeting.id + `tag`} className="box">
                                    {meeting.frontmatter.title}
                                </li>
                            ))}
                        <PostContent content={content} />
                        {tags && tags.length ? (
                            <div style={{ marginTop: `4rem` }}>
                                <h4>Keywords</h4>
                                <ul className="taglist">
                                    {tags.map((tag) => (
                                        <li key={tag + `tag`}>
                                            <Link
                                                to={`/tags/${kebabCase(tag)}/`}
                                            >
                                                {tag}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
};

ProjectTemplate.propTypes = {
    content: PropTypes.node.isRequired,
    contentComponent: PropTypes.func,
    description: PropTypes.string,
    title: PropTypes.string,
    helmet: PropTypes.object,
};

const Project = ({ data }) => {
    const { markdownRemark: project } = data;
    const { datasets, meetings } = project.fields;

    return (
        <Layout>
            <ProjectTemplate
                content={project.html}
                contentComponent={HTMLContent}
                goals={project.frontmatter.goals}
                roles={project.frontmatter.roles}
                datasets={datasets}
                meetings={meetings || []}
                helmet={
                    <Helmet titleTemplate="%s | Blog">
                        <title>{`${project.frontmatter.title}`}</title>
                        <meta
                            name="description"
                            content={`${project.frontmatter.goals.high_level}`}
                        />
                    </Helmet>
                }
                title={project.frontmatter.title}
            />
        </Layout>
    );
};

Project.propTypes = {
    data: PropTypes.shape({
        markdownRemark: PropTypes.object,
    }),
};

export default Project;

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
                    }
                }
                meetings {
                    id
                    html
                    frontmatter {
                        title
                        date
                    }
                }
            }
            frontmatter {
                title
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
`;
