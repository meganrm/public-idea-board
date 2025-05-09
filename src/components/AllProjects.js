import React from "react";
import PropTypes from "prop-types";
import { graphql, StaticQuery } from "gatsby";
import InternalProjectPost from "./InternalProjectPost";

class AllProjects extends React.Component {
    render() {
        const { data } = this.props;
        const { edges: projects } = data.allMarkdownRemark;

        return (
            <div className="columns is-multiline">
                {projects &&
                    projects.map(({ node: project }) => (
                        <InternalProjectPost
                            post={project}
                            key={project.frontmatter.title}
                        />
                    ))}
            </div>
        );
    }
}

AllProjects.propTypes = {
    data: PropTypes.shape({
        allMarkdownRemark: PropTypes.shape({
            edges: PropTypes.array,
        }),
    }),
};

export default () => (
    <StaticQuery
        query={graphql`
            query AllProjectsQuery {
                allMarkdownRemark(
                    sort: { order: DESC, fields: [frontmatter___date] }
                    filter: {
                        frontmatter: { templateKey: { eq: "project-page" } }
                    }
                ) {
                    edges {
                        node {
                            excerpt(pruneLength: 400)
                            id
                            fields {
                                slug
                            }
                            frontmatter {
                                title
                                templateKey
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
                                groups {
                                    launch_material
                                    weekly_working_groups
                                    summaries
                                }
                            }
                        }
                    }
                }
            }
        `}
        render={(data, count) => <AllProjects data={data} count={count} />}
    />
);
