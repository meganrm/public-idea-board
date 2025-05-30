import React from "react";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import { Helmet } from "react-helmet";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";

export const DatasetTemplate = ({
    content,
    contentComponent,
    tags,
    title,
    helmet,
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

DatasetTemplate.propTypes = {
    content: PropTypes.node.isRequired,
    contentComponent: PropTypes.func,
    description: PropTypes.string,
    title: PropTypes.string,
    helmet: PropTypes.object,
};

const Dataset = ({ data }) => {
    const { markdownRemark: post } = data;
    return (
        <Layout>
            <DatasetTemplate
                content={post.html}
                contentComponent={HTMLContent}
                description={post.frontmatter.description}
                helmet={
                    <Helmet titleTemplate="%s | Blog">
                        <title>{`${post.frontmatter.title}`}</title>
                        <meta
                            name="description"
                            content={`${post.frontmatter.description}`}
                        />
                    </Helmet>
                }
                tags={post.frontmatter.tags}
                title={post.frontmatter.title}
            />
        </Layout>
    );
};

Dataset.propTypes = {
    data: PropTypes.shape({
        markdownRemark: PropTypes.object,
    }),
};

export default Dataset;

export const pageQuery = graphql`
    query DatasetByID($id: String!) {
        markdownRemark(id: { eq: $id }) {
            id
            html
            frontmatter {
                title
                description
                tags
            }
        }
    }
`;
